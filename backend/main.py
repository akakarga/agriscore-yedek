from __future__ import annotations

import io
import json
import os
import re
from datetime import date
from typing import Any, Dict, List, Optional, Union

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    from groq import Groq
except ImportError:  # The API can still serve deterministic endpoints without Groq.
    Groq = None  # type: ignore[assignment]


load_dotenv()

MAX_PDF_BYTES = 10 * 1024 * 1024
MAX_PDF_PAGES = 50
MAX_CONTEXT_ITEMS = 25
MAX_CONTEXT_CHARS = 12_000
SCORE_METHODOLOGY_VERSION = "rules-v2.0"

DEFAULT_ORIGINS = [
    "http://localhost:4173",
    "http://localhost:5173",
    "https://agriscore-yedek-main.vercel.app",
]
allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", ",".join(DEFAULT_ORIGINS)).split(",")
    if origin.strip()
]

groq_api_key = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=groq_api_key) if Groq and groq_api_key else None

app = FastAPI(title="AgriScore AI Backend", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class Financials(BaseModel):
    monthlyMilkRevenue: Optional[float]
    monthlyFeedCost: Optional[float]
    monthlyOtherCosts: Optional[float]
    currentLoanInstallments: Optional[float]
    requestedLoanAmount: float


class Herd(BaseModel):
    totalCattle: int
    milkingCows: int
    heifers: int
    calves: int
    dryCows: int


class ProductionRecord(BaseModel):
    month: str
    totalLiters: float
    averagePerCow: float


class DataSource(BaseModel):
    name: str
    status: str
    date: str
    impact: str
    description: str


class Producer(BaseModel):
    id: str
    name: str
    location: str
    businessType: str
    herd: Herd
    productionHistory: List[ProductionRecord]
    financials: Financials
    riskNotes: List[str]
    dataSources: List[DataSource]
    farmMemory: str
    verificationNotes: List[str]


class DocumentPayload(BaseModel):
    text: str = Field(min_length=1, max_length=20_000)


class CksPayload(BaseModel):
    document_text: str = Field(min_length=1, max_length=200_000)


class ChatPayload(BaseModel):
    message: str = Field(min_length=1, max_length=2_000)
    context: Union[Dict[str, Any], List[Dict[str, Any]]] = Field(default_factory=dict)


def _calculate_reliability(producer: Producer) -> int:
    score = 100
    if len(producer.productionHistory) < 6:
        score -= (6 - len(producer.productionHistory)) * 10
    if (
        producer.financials.monthlyMilkRevenue is None
        or producer.financials.monthlyMilkRevenue <= 0
    ):
        score -= 15
    if (
        producer.financials.monthlyFeedCost is None
        or producer.financials.monthlyFeedCost <= 0
    ):
        score -= 10
    if producer.financials.monthlyOtherCosts is None:
        score -= 15
    if producer.financials.currentLoanInstallments is None:
        score -= 15
    if not producer.dataSources:
        score -= 30
    else:
        for source in producer.dataSources:
            if source.status == "eksik":
                score -= 15
            elif source.status == "bekliyor":
                score -= 5
    return max(0, score)


def _score_producer(producer: Producer) -> Dict[str, Any]:
    history = producer.productionHistory
    financials = producer.financials
    herd = producer.herd
    financial_fields = [
        ("Aylık süt geliri", financials.monthlyMilkRevenue),
        ("Aylık yem gideri", financials.monthlyFeedCost),
        ("Aylık diğer giderler", financials.monthlyOtherCosts),
        ("Mevcut kredi taksitleri", financials.currentLoanInstallments),
    ]
    missing_critical_data = [
        label for label, value in financial_fields if value is None
    ]
    reliability = _calculate_reliability(producer)

    if missing_critical_data:
        return {
            "overallScore": None,
            "riskLevel": None,
            "reliabilityScore": reliability,
            "operatingIncome": None,
            "currentDscr": None,
            "safeInstallmentRange": None,
            "assessmentStatus": "Eksik Bilgi",
            "decisionReadiness": "Bilgi Gerekli",
            "missingCriticalData": missing_critical_data,
            "methodologyVersion": SCORE_METHODOLOGY_VERSION,
            "decisionBoundary": "Karar destek çıktısıdır; kredi onayı veya reddi değildir.",
        }

    production_stability = 50.0
    if len(history) > 1:
        changes = [
            abs((current.totalLiters - previous.totalLiters) / previous.totalLiters)
            for previous, current in zip(history, history[1:])
            if previous.totalLiters > 0
        ]
        if changes:
            production_stability = max(0.0, 100 - (sum(changes) / len(changes) * 500))

    # The early return above guarantees these values are present.
    revenue = financials.monthlyMilkRevenue
    feed_cost = financials.monthlyFeedCost
    other_costs = financials.monthlyOtherCosts
    installments = financials.currentLoanInstallments
    assert revenue is not None
    assert feed_cost is not None
    assert other_costs is not None
    assert installments is not None

    costs = feed_cost + other_costs
    operating_income = revenue - costs
    cashflow_strength = (
        min(100.0, (operating_income / revenue) * 300)
        if operating_income > 0 and revenue > 0
        else 0.0
    )

    total_cattle = herd.totalCattle
    milking_ratio = herd.milkingCows / total_cattle if total_cattle > 0 else 0
    herd_strength = min(100.0, milking_ratio * 150)
    if total_cattle > 0 and herd.heifers / total_cattle > 0.3:
        herd_strength = min(100.0, herd_strength + 10)

    current_dscr = operating_income / installments if installments > 0 else None
    debt_burden = 100.0
    if operating_income > 0 and installments > 0:
        if current_dscr is not None and current_dscr < 1.2:
            debt_burden = max(0.0, current_dscr * 50)
        elif current_dscr is not None and current_dscr < 2:
            debt_burden = 75.0
    elif installments > 0:
        debt_burden = 0.0

    income_regularity = 100.0
    if len(history) < 6:
        income_regularity -= (6 - len(history)) * 15
    if any("düzensiz" in note.lower() for note in producer.riskNotes):
        income_regularity -= 30
    income_regularity = max(0.0, income_regularity)

    operational_risk = 100.0
    for note in producer.riskNotes:
        normalized = note.lower()
        if any(term in normalized for term in ("mastitis", "salgın", "hastalık")):
            operational_risk -= 40
        if any(term in normalized for term in ("dalgalanma", "yetersiz")):
            operational_risk -= 20
    operational_risk = max(0.0, operational_risk)

    overall = (
        production_stability * 0.20
        + cashflow_strength * 0.20
        + herd_strength * 0.15
        + debt_burden * 0.15
        + income_regularity * 0.15
        + operational_risk * 0.15
    )
    overall_score = round(overall)
    risk_level = "Düşük" if overall_score >= 75 else "Orta" if overall_score >= 50 else "Yüksek"

    # New-installment capacity preserves a minimum DSCR after existing installments.
    conservative_capacity = max(0.0, operating_income / 1.5 - installments)
    upper_capacity = max(0.0, operating_income / 1.25 - installments)

    return {
        "overallScore": overall_score,
        "riskLevel": risk_level,
        "reliabilityScore": reliability,
        "operatingIncome": round(operating_income),
        "currentDscr": round(current_dscr, 2) if current_dscr is not None else None,
        "safeInstallmentRange": {
            "min": round(conservative_capacity),
            "max": round(max(conservative_capacity, upper_capacity)),
        },
        "assessmentStatus": "Hesaplanabilir",
        "decisionReadiness": (
            "Hazır" if reliability >= 80 else "Uzman İncelemesi"
        ),
        "missingCriticalData": [],
        "methodologyVersion": SCORE_METHODOLOGY_VERSION,
        "decisionBoundary": "Karar destek çıktısıdır; kredi onayı veya reddi değildir.",
    }


def _parse_cks_text(text: str, source_type: str) -> Dict[str, Any]:
    normalized = text.lower()
    notes: List[str] = []
    warnings: List[str] = []

    cattle_values = [
        int(value)
        for value in re.findall(
            r"(\d+)\s*(?:adet|baş|büyükbaş|inek|sığır|dana|düve)\b", normalized
        )
    ]
    total_cattle = max(cattle_values) if cattle_values else 0
    if len(cattle_values) > 1:
        warnings.append(
            "Belgede birden fazla hayvan sayısı bulundu; tekrar sayımı önlemek için en yüksek değer gösterildi."
        )

    total_land = 0.0
    exact_total = re.search(
        r"toplam\s+kullan[ıi]lan\s+alan\s*\(da\)\s*[:\-]?\s*(\d+(?:[.,]\d+)?)",
        normalized,
    )
    if exact_total:
        total_land = float(exact_total.group(1).replace(",", "."))
    else:
        parcel_values = [
            float(value.replace(",", "."))
            for value in re.findall(
                r"(\d+(?:[.,]\d+)?)\s*(?:dekar|dönüm|da\b)", normalized
            )
        ]
        if parcel_values:
            total_land = sum(parcel_values)
            if len(parcel_values) > 1:
                warnings.append(
                    "Arazi toplamı belgede geçen parsel değerlerinin toplamıdır; resmi toplam alanla teyit edilmelidir."
                )

    if total_cattle:
        notes.append(f"Metinde {total_cattle} baş hayvan değeri tespit edildi.")
    else:
        notes.append("Metinde doğrulanabilir bir hayvan sayısı bulunamadı.")
    if total_land:
        notes.append(f"Metinde {total_land:.1f} dekar arazi değeri tespit edildi.")
    else:
        notes.append("Metinde doğrulanabilir bir arazi büyüklüğü bulunamadı.")

    warnings.append(
        "ÇKS belgesi tek başına gelir, gider ve borç ödeme kapasitesini kanıtlamaz; finansal skor üretilmedi."
    )

    return {
        "totalCattle": total_cattle,
        "landSize": round(total_land, 1),
        "estimatedScore": None,
        "riskLevel": "DEĞERLENDİRİLEMEZ",
        "analysisStatus": "PARSED_FIELDS_ONLY",
        "sourceType": source_type,
        "notes": notes,
        "warnings": warnings,
    }


def _next_month_labels(count: int = 6) -> List[str]:
    month_names = [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
    ]
    current = date.today()
    labels: List[str] = []
    year = current.year
    month = current.month
    for _ in range(count):
        month += 1
        if month == 13:
            month = 1
            year += 1
        labels.append(f"{month_names[month - 1]} {year}")
    return labels


def _sanitize_context(
    context: Union[Dict[str, Any], List[Dict[str, Any]]]
) -> Union[Dict[str, Any], List[Dict[str, Any]]]:
    items = context[:MAX_CONTEXT_ITEMS] if isinstance(context, list) else [context]
    sanitized: List[Dict[str, Any]] = []
    for item in items:
        if not isinstance(item, dict):
            continue
        herd = item.get("herd") if isinstance(item.get("herd"), dict) else {}
        financials = (
            item.get("financials") if isinstance(item.get("financials"), dict) else {}
        )
        sanitized.append(
            {
                "profileId": item.get("id"),
                "businessType": item.get("businessType"),
                "province": str(item.get("location", "")).split(" / ")[0],
                "herd": {
                    "totalCattle": herd.get("totalCattle"),
                    "milkingCows": herd.get("milkingCows"),
                },
                "financials": {
                    "monthlyMilkRevenue": financials.get("monthlyMilkRevenue"),
                    "monthlyFeedCost": financials.get("monthlyFeedCost"),
                    "monthlyOtherCosts": financials.get("monthlyOtherCosts"),
                    "currentLoanInstallments": financials.get("currentLoanInstallments"),
                    "requestedLoanAmount": financials.get("requestedLoanAmount"),
                },
                "riskNotes": [
                    str(note)[:300] for note in item.get("riskNotes", [])[:10]
                ],
            }
        )
    return sanitized if isinstance(context, list) else (sanitized[0] if sanitized else {})


@app.get("/")
def read_root() -> Dict[str, str]:
    return {
        "message": "AgriScore AI API",
        "status": "active",
        "version": "2.0.0",
    }


@app.get("/api/health")
def health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "copilotAvailable": groq_client is not None,
        "scoreMethodologyVersion": SCORE_METHODOLOGY_VERSION,
    }


@app.post("/api/score")
def calculate_score(producer: Producer) -> Dict[str, Any]:
    return _score_producer(producer)


@app.post("/api/forecast")
def forecast_production(producer: Producer) -> Dict[str, Any]:
    history = producer.productionHistory
    if len(history) < 3:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "INSUFFICIENT_DATA",
                "message": "Tahmin için en az üç aylık üretim geçmişi gereklidir.",
            },
        )

    recent = history[-3:]
    older = history[:3]
    recent_average = sum(record.totalLiters for record in recent) / len(recent)
    older_average = sum(record.totalLiters for record in older) / len(older)
    trend_multiplier = 1.0
    if recent_average > older_average * 1.05:
        trend_multiplier = 1.02
    elif recent_average < older_average * 0.95:
        trend_multiplier = 0.97

    if (
        producer.herd.totalCattle > 0
        and producer.herd.heifers / producer.herd.totalCattle > 0.25
    ):
        trend_multiplier += 0.01

    current_value = history[-1].totalLiters
    forecast = []
    for label in _next_month_labels():
        current_value *= trend_multiplier
        forecast.append(
            {
                "month": label,
                "predictedLiters": round(current_value),
            }
        )

    return {
        "forecast": forecast,
        "modelUsed": "Deterministic trend rules v2.0",
        "confidenceLabel": "RULE_BASED_NOT_STATISTICAL_CONFIDENCE",
        "warning": "Bu projeksiyon istatistiksel olarak kalibre edilmiş bir ML tahmini değildir.",
    }


@app.post("/api/ai-agent")
def ai_agent_report(producer: Producer) -> Dict[str, Any]:
    score = _score_producer(producer)
    if score["assessmentStatus"] == "Eksik Bilgi":
        missing_fields = ", ".join(score["missingCriticalData"])
        return {
            "report": (
                "Finansal görünüm henüz hesaplanamadı. "
                f"Tamamlanması gereken bilgiler: {missing_fields}."
            ),
            "generatedBy": "AgriScore kuralları",
            "mode": "local_deterministic",
        }

    return {
        "report": (
            f"Senaryo profilinin AgriScore değeri {score['overallScore']}/100, "
            f"veri güvenilirliği %{score['reliabilityScore']} ve işletme geliri "
            f"{score['operatingIncome']:,.0f} TL'dir. "
            f"{score['decisionBoundary']}"
        ),
        "generatedBy": "Deterministic AgriScore rules v2.0",
        "mode": "local_deterministic",
    }


@app.post("/api/parse-document")
def parse_document(payload: DocumentPayload) -> Dict[str, Any]:
    text = payload.text.lower()
    risk_notes: List[str] = []
    issues: List[str] = []
    if any(term in text for term in ("mastitis", "hastalık", "salgın")):
        risk_notes.append("Metinde sürü sağlığı riski ifadesi bulundu.")
        issues.append("Veteriner kaydıyla doğrulama gerekli.")
    if "süt" in text and any(term in text for term in ("düştü", "azaldı")):
        risk_notes.append("Metinde süt üretimi düşüşü ifadesi bulundu.")
    if "yem" in text and any(
        term in text for term in ("arttı", "masraf", "zam", "pahalı")
    ):
        risk_notes.append("Metinde yem maliyeti artışı ifadesi bulundu.")
        issues.append("Fatura veya hesap hareketiyle doğrulama gerekli.")

    return {
        "success": True,
        "parsedData": {
            "riskNotes": risk_notes,
            "detectedIssues": issues,
            "detectedNumbers": re.findall(r"\b\d+(?:[.,]\d+)?\b", text),
            "confidence": None,
            "analysisStatus": "KEYWORD_EXTRACTION_ONLY",
        },
    }


@app.post("/api/parse-cks")
def parse_cks(payload: CksPayload) -> Dict[str, Any]:
    return {
        "success": True,
        "extractedData": _parse_cks_text(payload.document_text, "plain_text"),
    }


@app.post("/api/upload-cks-pdf")
@app.post("/upload-cks-pdf")
async def upload_cks_pdf(file: UploadFile = File(...)) -> Dict[str, Any]:
    filename = file.filename or ""
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=415,
            detail={"code": "UNSUPPORTED_FILE_TYPE", "message": "Yalnızca PDF yüklenebilir."},
        )
    if file.content_type not in (None, "", "application/pdf", "application/octet-stream"):
        raise HTTPException(
            status_code=415,
            detail={"code": "UNSUPPORTED_FILE_TYPE", "message": "Dosya PDF olarak tanınmadı."},
        )

    contents = await file.read(MAX_PDF_BYTES + 1)
    if len(contents) > MAX_PDF_BYTES:
        raise HTTPException(
            status_code=413,
            detail={"code": "FILE_TOO_LARGE", "message": "PDF en fazla 10 MB olabilir."},
        )
    if not contents.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=422,
            detail={"code": "INVALID_PDF", "message": "Dosya geçerli bir PDF imzası taşımıyor."},
        )

    try:
        from pypdf import PdfReader
        from pypdf.errors import PdfReadError
    except ImportError as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "PYPDF_UNAVAILABLE",
                "message": "PDF metin çıkarma bileşeni sunucuda kullanılamıyor.",
            },
        ) from exc

    try:
        reader = PdfReader(io.BytesIO(contents))
        if reader.is_encrypted and reader.decrypt("") == 0:
            raise HTTPException(
                status_code=422,
                detail={
                    "code": "ENCRYPTED_PDF",
                    "message": "Şifreli PDF dosyaları işlenemiyor.",
                },
            )
        if len(reader.pages) > MAX_PDF_PAGES:
            raise HTTPException(
                status_code=413,
                detail={
                    "code": "TOO_MANY_PAGES",
                    "message": f"PDF en fazla {MAX_PDF_PAGES} sayfa olabilir.",
                },
            )
        extracted_text = "\n".join((page.extract_text() or "") for page in reader.pages).strip()
    except HTTPException:
        raise
    except (PdfReadError, ValueError, TypeError) as exc:
        raise HTTPException(
            status_code=422,
            detail={"code": "INVALID_PDF", "message": "PDF yapısı okunamadı."},
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail={"code": "PDF_PARSE_ERROR", "message": "PDF metni çıkarılamadı."},
        ) from exc

    if len(extracted_text) < 20:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "TEXT_UNAVAILABLE",
                "message": (
                    "PDF'de çıkarılabilir metin bulunamadı. Bu sürüm OCR yapmıyor; "
                    "metin tabanlı PDF veya doğrulanmış OCR çıktısı yükleyin."
                ),
            },
        )

    return {
        "success": True,
        "document": {
            "fileName": filename,
            "pageCount": len(reader.pages),
            "extractedCharacterCount": len(extracted_text),
        },
        "extractedData": _parse_cks_text(extracted_text, "pdf_text"),
    }


@app.post("/api/copilot/chat")
@app.post("/copilot/chat")
def copilot_chat(payload: ChatPayload) -> Dict[str, Any]:
    if groq_client is None:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "COPILOT_UNAVAILABLE",
                "message": "Canlı Co-Pilot yapılandırılmamış; yerel deterministik analiz kullanılmalı.",
            },
        )

    sanitized_context = _sanitize_context(payload.context)
    serialized_context = json.dumps(sanitized_context, ensure_ascii=False)
    if len(serialized_context) > MAX_CONTEXT_CHARS:
        raise HTTPException(
            status_code=413,
            detail={"code": "CONTEXT_TOO_LARGE", "message": "Analiz bağlamı çok büyük."},
        )

    system_prompt = (
        "Sen AgriScore Co-Pilot adlı tarımsal finans karar destek asistanısın. "
        "Yalnızca verilen senaryo verisini analiz et. Veri yoksa DATA_UNAVAILABLE yaz. "
        "Sayı uydurma, doğrulanmamış resmi destek veya mevzuat iddiası üretme. "
        "Kredi onayı, ret, garanti veya kesin uygunluk kararı verme. "
        "Kısa Türkçe cevap ver ve senaryo verisinin gerçek kişi verisi olmadığını koru. "
        f"Minimize edilmiş bağlam: {serialized_context}"
    )

    try:
        completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.message.strip()},
            ],
            model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
            temperature=0.1,
            max_tokens=350,
        )
        reply = completion.choices[0].message.content
        if not reply:
            raise ValueError("Empty model response")
        return {"reply": reply, "mode": "live_llm"}
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "code": "COPILOT_PROVIDER_ERROR",
                "message": "Canlı Co-Pilot sağlayıcısı yanıt veremedi.",
            },
        ) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
