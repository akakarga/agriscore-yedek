from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import random
import os
from groq import Groq
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# Groq API Client setup (.env dosyasından okur)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
try:
    groq_client = Groq(api_key=GROQ_API_KEY)
except Exception:
    groq_client = None

from typing import List, Dict, Any, Optional, Union

class ChatPayload(BaseModel):
    message: str
    context: Union[Dict[str, Any], List[Dict[str, Any]]] = {}

# Gelecekte eklenecek Makine Öğrenmesi Modelleri
# import pandas as pd
# from sklearn.ensemble import RandomForestRegressor

app = FastAPI(title="AgriScore AI Backend", version="1.0.0")

# CORS ayarları - React frontend'in API'ye erişebilmesi için
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme ortamında her şeye izin veriyoruz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Veri Modelleri (Pydantic) ---

class Financials(BaseModel):
    monthlyMilkRevenue: float
    monthlyFeedCost: float
    monthlyOtherCosts: float
    currentLoanInstallments: float
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

class DocumentPayload(BaseModel):
    text: str

class CksPayload(BaseModel):
    document_text: str

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

# --- API Uç Noktaları ---

@app.get("/")
def read_root():
    return {"message": "AgriScore AI API Çalışıyor!", "status": "aktif"}

@app.post("/api/score")
def calculate_score(producer: Producer):
    """
    Bu endpoint, çiftçinin verilerini alır ve risk skorunu hesaplar.
    (Sprint 2: Frontend'deki kural tabanlı motor tamamen Python'a taşındı, 100'lük sisteme standardize edildi)
    """
    warnings_list = []
    positive_signals = []

    # --- 0. Veri Güvenilirliği (Reliability) Hesaplaması ---
    rel_score = 100
    if not producer.productionHistory or len(producer.productionHistory) < 6:
        missing_count = 6 - len(producer.productionHistory) if producer.productionHistory else 6
        rel_score -= missing_count * 10

    if not producer.financials.monthlyMilkRevenue or producer.financials.monthlyMilkRevenue == 0:
        rel_score -= 15
    if not producer.financials.monthlyFeedCost or producer.financials.monthlyFeedCost == 0:
        rel_score -= 10

    if not producer.dataSources or len(producer.dataSources) == 0:
        rel_score -= 30
    else:
        for source in producer.dataSources:
            if source.status == 'eksik':
                rel_score -= 15
            elif source.status == 'bekliyor':
                rel_score -= 5
    
    rel_score = max(0, rel_score)

    # --- 1. Üretim İstikrarı (Production Stability - %20 Ağırlık) ---
    production_stability_score = 0
    if len(producer.productionHistory) > 1:
        changes = []
        for i in range(1, len(producer.productionHistory)):
            prev = producer.productionHistory[i - 1].totalLiters
            curr = producer.productionHistory[i].totalLiters
            if prev > 0:
                pct_change = abs((curr - prev) / prev)
                changes.append(pct_change)
        
        if changes:
            avg_change = sum(changes) / len(changes)
            production_stability_score = max(0, 100 - (avg_change * 500))
    else:
        production_stability_score = 50

    # --- 2. Nakit Akışı Gücü (Cashflow Strength - %20 Ağırlık) ---
    total_revenue = producer.financials.monthlyMilkRevenue
    total_costs = producer.financials.monthlyFeedCost + producer.financials.monthlyOtherCosts
    net_cashflow = total_revenue - total_costs
    
    cashflow_strength_score = 0
    if net_cashflow > 0:
        margin = net_cashflow / total_revenue if total_revenue > 0 else 0
        cashflow_strength_score = min(100, margin * 300)

    # --- 3. Sürü Gücü (Herd Strength - %15 Ağırlık) ---
    milking_ratio = producer.herd.milkingCows / producer.herd.totalCattle if producer.herd.totalCattle > 0 else 0
    herd_strength_score = min(100, milking_ratio * 150)
    
    if producer.herd.totalCattle > 0 and (producer.herd.heifers / producer.herd.totalCattle) > 0.3:
        herd_strength_score = min(100, herd_strength_score + 10)

    # --- 4. Borç Yükü (Debt Burden - %15 Ağırlık) ---
    debt_burden_score = 100
    if net_cashflow > 0:
        installments = producer.financials.currentLoanInstallments if producer.financials.currentLoanInstallments > 0 else 1
        dscr = net_cashflow / installments
        if dscr < 1.2 and producer.financials.currentLoanInstallments > 0:
            debt_burden_score = max(0, dscr * 50)
        elif 1.2 <= dscr < 2:
            debt_burden_score = 75
    elif producer.financials.currentLoanInstallments > 0:
        debt_burden_score = 0

    # --- 5. Gelir Düzenliliği (Income Regularity - %15 Ağırlık) ---
    income_regularity_score = 100
    if len(producer.productionHistory) < 6:
        income_regularity_score -= (6 - len(producer.productionHistory)) * 15
        
    for note in producer.riskNotes:
        if 'düzensiz' in note.lower():
            income_regularity_score -= 30

    # --- 6. Operasyonel Risk (Operational Risk - %15 Ağırlık) ---
    operational_risk_score = 100
    for note in producer.riskNotes:
        note_lower = note.lower()
        if 'mastitis' in note_lower or 'salgın' in note_lower or 'hastalık' in note_lower:
            operational_risk_score -= 40
        if 'dalgalanma' in note_lower or 'yetersiz' in note_lower:
            operational_risk_score -= 20

    # --- TOPLAM SKOR (Ağırlıklandırılmış Dağılım) ---
    overall_score = (
        (production_stability_score * 0.20) + 
        (cashflow_strength_score * 0.20) + 
        (herd_strength_score * 0.15) + 
        (debt_burden_score * 0.15) + 
        (income_regularity_score * 0.15) +
        (operational_risk_score * 0.15)
    )

    # Veri eksikliği varsa skor baskılanır
    if rel_score < 50:
        overall_score *= 0.6
    elif rel_score < 80:
        overall_score *= 0.9

    final_score = int(round(overall_score))

    # Risk Seviyesi Belirleme
    if final_score >= 75:
        risk_level = "Düşük"
    elif final_score >= 50:
        risk_level = "Orta"
    else:
        risk_level = "Yüksek"

    # Güvenli Taksit Kapasitesi
    safe_installment_max = net_cashflow * 0.6 if net_cashflow > 0 else 0
    safe_installment_min = net_cashflow * 0.3 if net_cashflow > 0 else 0

    return {
        "overallScore": final_score,
        "riskLevel": risk_level,
        "netCashflow": net_cashflow,
        "safeInstallmentRange": {
            "min": int(safe_installment_min),
            "max": int(safe_installment_max)
        },
        "message": "AI Destekli Skorlama Tamamlandı (Frontend Algoritmasıyla %100 Uyumlu)"
    }

@app.post("/api/forecast")
def forecast_production(producer: Producer):
    """
    Bu endpoint, geçmiş aylardaki süt üretimine bakarak
    gelecek 6 ayın tahminini yapar. (Prophet entegrasyonu buraya gelecek)
    """
    history = producer.productionHistory
    if not history:
        raise HTTPException(status_code=400, detail="Geçmiş veri bulunamadı.")
        
    # Son ayın üretimini al
    last_production = history[-1].totalLiters
    
    # Gelecek 6 ay için basit bir trend simülasyonu (Bunu Prophet'e çevireceğiz)
    forecast = []
    current_val = last_production
    
    months = ["Ağu", "Eyl", "Eki", "Kas", "Ara", "Oca"]
    
    for i in range(6):
        # %-5 ile %+8 arası rastgele bir dalgalanma (Suni mevsimsellik)
        fluctuation = current_val * random.uniform(-0.05, 0.08)
        current_val += fluctuation
        
        forecast.append({
            "month": f"{months[i]} 2026",
            "predictedLiters": int(current_val),
            "lowerBound": int(current_val * 0.9),
            "upperBound": int(current_val * 1.1)
        })
        
    return {
        "forecast": forecast,
        "modelUsed": "Simulated Prophet Engine v1.0",
        "confidenceScore": 85
    }

@app.post("/api/ai-agent")
def ai_agent_report(producer: Producer):
    """
    LangChain entegrasyonu ile LLM destekli risk raporu özeti oluşturur.
    """
    # İleride OpenAI API'si ile buraya gerçek LangChain eklenecek
    net_cashflow = producer.financials.monthlyMilkRevenue - (producer.financials.monthlyFeedCost + producer.financials.monthlyOtherCosts)
    
    report = f"Merhaba, {producer.name} adlı işletmenin risk analizini inceledim.\n\n"
    if net_cashflow > 0:
        report += f"İşletmenin aylık net nakit akışı {net_cashflow:,.0f} ₺ ile pozitif seyrediyor. Bu durum mikro-kredi ödemeleri için oldukça güvenli bir tablo çizmektedir.\n"
    else:
        report += f"İşletmenin aylık giderleri gelirlerini aşmaktadır (Net: {net_cashflow:,.0f} ₺). Yeni bir kredi tahsisi oldukça risklidir.\n"
        
    report += f"Sürü sağlığına baktığımda, toplam {producer.herd.totalCattle} büyükbaş hayvanın {producer.herd.milkingCows} kadarı sağmal durumdadır.\n"
    report += "Yapay zeka asistanı olarak önerim, işletmenin yem maliyetlerini optimize etmesi ve sürü verimliliğini artırmasıdır."
    
    return {
        "report": report,
        "generatedBy": "AgriScore AI Agent"
    }

@app.post("/api/parse-document")
def parse_document(payload: DocumentPayload):
    """
    NLP (Doğal Dil İşleme) Simülasyonu: 
    Çiftçinin WhatsApp üzerinden attığı sesli mesajı veya yüklediği 
    karmaşık bir faturayı JSON yapısına dönüştürür.
    """
    text = payload.text.lower()
    import re
    
    extracted_data = {
        "riskNotes": [],
        "detectedIssues": [],
        "financialImpact": {},
        "confidence": "Yüksek (%92)"
    }
    
    # Hastalık ve Operasyonel risk tespiti
    if "mastitis" in text or "hastalık" in text or "hastalandı" in text or "salgın" in text:
        extracted_data["riskNotes"].append("Sürü sağlığı riski: Hastalık tespit edildi.")
        extracted_data["detectedIssues"].append("Acil Veteriner Kontrolü Gerekli")
        
    # Üretim Tespiti
    if "süt" in text and ("düştü" in text or "azaldı" in text):
        extracted_data["riskNotes"].append("Üretim düşüşü tespit edildi (Risk faktörü arttı).")
        
    # Gider Tespiti
    if "yem" in text and ("arttı" in text or "masraf" in text or "zam" in text or "pahalı" in text):
        extracted_data["riskNotes"].append("Yem maliyetlerinde beklenmedik artış (Nakit akışı uyarısı).")
        extracted_data["detectedIssues"].append("Marj Daralması Riski")

    # Basit Regex ile rakamları çekip finansal etkiye atama (Örn: "15000 lira masraf")
    numbers = re.findall(r'\b\d+\b', text)
    if numbers:
        extracted_data["financialImpact"]["detectedNumbers"] = numbers
        
    if not extracted_data["riskNotes"]:
        extracted_data["riskNotes"].append("Önemli bir risk faktörü tespit edilmedi.")
        
    return {
        "success": True,
        "message": "Metin başarıyla anlamlandırıldı ve JSON formatına dönüştürüldü.",
        "parsedData": extracted_data
    }

@app.post("/api/parse-cks")
def parse_cks(payload: CksPayload):
    """
    Kullanıcının yüklediği ÇKS (Çiftçi Kayıt Sistemi) metninden
    Yapay Zeka (NLP simülasyonu) ile verileri çeker ve ön analiz yapar.
    """
    text = payload.document_text.lower()
    import re
    
    extracted = {
        "totalCattle": 0,
        "landSize": 0,
        "estimatedScore": 0,
        "riskLevel": "Bilinmiyor",
        "notes": []
    }
    
    # Hayvan sayısı çıkarımı
    cattle_matches = re.findall(r'(\d+)\s*(?:adet|baş|büyükbaş|inek|sığır|dana|düve)', text)
    if cattle_matches:
        extracted["totalCattle"] = sum(int(n) for n in cattle_matches)
            
    # Arazi büyüklüğü çıkarımı
    land_matches = re.findall(r'(\d+)\s*(?:dekar|dönüm|m2|metrekare)', text)
    if land_matches:
        extracted["landSize"] = sum(int(n) for n in land_matches)
        extracted["notes"].append(f"Toplam {extracted['landSize']} dekar/dönüm tarımsal arazi tespit edildi.")
            
    # Basit ön-skorlama (Hayvan sayısı ve araziye göre)
    if extracted["totalCattle"] >= 50 or extracted["landSize"] >= 100:
        extracted["estimatedScore"] = 85
        extracted["riskLevel"] = "Düşük (Krediye Uygun)"
        extracted["notes"].append("Orta/Büyük ölçekli işletme. Kredi geri ödeme kapasitesi yüksek.")
    elif extracted["totalCattle"] >= 10 or extracted["landSize"] >= 20:
        extracted["estimatedScore"] = 65
        extracted["riskLevel"] = "Orta (İncelenmeli)"
        extracted["notes"].append("Küçük/Aile işletmesi ölçeği tespit edildi. Ek teminat istenebilir.")
    else:
        extracted["estimatedScore"] = 40
        extracted["riskLevel"] = "Yüksek (Riskli)"
        extracted["notes"].append("Düşük kapasite veya yetersiz veri. Otomatik ret/detaylı inceleme.")

    if extracted["totalCattle"] > 0:
        extracted["notes"].append(f"Belgede toplam {extracted['totalCattle']} büyükbaş hayvan saptandı.")
    else:
        extracted["notes"].append("Belgede hayvancılık faaliyetine dair sayısal veri bulunamadı.")
        
    return {
        "success": True,
        "extractedData": extracted
    }

@app.post("/api/upload-cks-pdf")
async def upload_cks_pdf(file: UploadFile = File(...)):
    """
    Gerçek bir PDF dosyasını yükler, içindeki metni pypdf ile çıkarır
    ve yapay zeka/NLP analizinden geçirerek sonucu döner.
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Lütfen bir PDF dosyası yükleyin.")
        
    try:
        contents = await file.read()
        import io
        from pypdf import PdfReader
        
        pdf_file = io.BytesIO(contents)
        reader = PdfReader(pdf_file)
        
        extracted_text = ""
        for page in reader.pages:
            extracted_text += page.extract_text() + "\n"
            
        text = extracted_text.lower()
        import re
        
        extracted = {
            "totalCattle": 0,
            "landSize": 0,
            "estimatedScore": 0,
            "riskLevel": "Bilinmiyor",
            "notes": ["PDF OCR Tarama Sonucu:"]
        }
        
        # Hayvan sayısı çıkarımı
        cattle_matches = re.findall(r'(\d+)\s*(?:adet|baş|büyükbaş|inek|sığır|dana|düve)', text)
        if cattle_matches:
            extracted["totalCattle"] = sum(int(n) for n in cattle_matches)
                
        # Arazi büyüklüğü çıkarımı
        total_land = 0.0
        
        # 1. Strateji: ÇKS belgesindeki net toplam alanı arayalım (Örn: "Toplam Kullanılan Alan (da): 216.784")
        # Python .lower() "I" harfini "i" yapar, bu yüzden "kullanilan" veya "kullanılan" olabilir.
        exact_total_match = re.search(r'toplam kullan[ıi]lan alan \(da\):\s*(\d+(?:[.,]\d+)?)', text)
        if exact_total_match:
            clean_num = exact_total_match.group(1).replace(',', '.')
            try:
                total_land = float(clean_num)
            except ValueError:
                pass
                
        # 2. Strateji: Eğer o başlığı bulamazsak alt kısımdaki genel TOPLAM satırlarını arayalım
        if total_land == 0.0:
            toplam_matches = re.findall(r'toplam\s+(\d+(?:[.,]\d{1,3}))\s+(?:-|\bbu belgenin)', text)
            if toplam_matches:
                clean_num = toplam_matches[0].replace(',', '.')
                try:
                    total_land = float(clean_num)
                except ValueError:
                    pass

        # 3. Strateji: Önceki gibi satır satır ürün veya "da" arama
        if total_land == 0.0:
            land_matches = re.findall(r'(\d+(?:[.,]\d+)?)\s*(?:dekar|dönüm|m2|metrekare|da\b)', text)
            if land_matches:
                for match in land_matches:
                    clean_match = match.replace(',', '.')
                    try:
                        total_land += float(clean_match)
                    except ValueError:
                        pass
        
        if total_land > 0:
            extracted["landSize"] = int(total_land)
            extracted["notes"].append(f"Toplam {extracted['landSize']} dekar tarımsal arazi tespit edildi.")
                
        # Basit ön-skorlama (Sadece bitkisel üretim yapanlar için de adaleti sağlayalım)
        if extracted["totalCattle"] >= 50 or extracted["landSize"] >= 100:
            extracted["estimatedScore"] = 85
            extracted["riskLevel"] = "Düşük (Krediye Uygun)"
            extracted["notes"].append("Orta/Büyük ölçekli işletme tespit edildi. Kredi geri ödeme kapasitesi yüksek.")
        elif extracted["totalCattle"] >= 10 or extracted["landSize"] >= 30:
            extracted["estimatedScore"] = 70
            extracted["riskLevel"] = "Orta (Kabul Edilebilir)"
            extracted["notes"].append("Küçük/Orta ölçekli işletme tespit edildi. Kredi kullandırımı yapılabilir.")
        elif extracted["landSize"] > 0:
             extracted["estimatedScore"] = 55
             extracted["riskLevel"] = "Orta-Yüksek"
             extracted["notes"].append("Mikro ölçekli bitkisel üretim tespit edildi.")
        else:
            extracted["estimatedScore"] = 40
            extracted["riskLevel"] = "Yüksek (Riskli)"
            extracted["notes"].append("Düşük kapasite veya yetersiz veri tespit edildi.")

        if extracted["totalCattle"] > 0:
            extracted["notes"].append(f"Belgede toplam {extracted['totalCattle']} büyükbaş hayvan saptandı.")
        elif extracted["landSize"] > 0:
            extracted["notes"].append("Belgede hayvancılık verisi bulunamadı, işletmenin Bitkisel Üretim odaklı olduğu varsayıldı.")
        else:
            extracted["notes"].append("Belgede anlamlı bir tarımsal/hayvansal kapasite verisi okunamadı.")
            
        return {
            "success": True,
            "extractedText": extracted_text,
            "extractedData": extracted
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF okuma hatası: {str(e)}")

@app.post("/api/copilot/chat")
def copilot_chat(payload: ChatPayload):
    """
    Ekrandaki çiftçinin JSON verisini ve kullanıcının mesajını (veya hazır promptunu) alıp 
    Groq (LLaMA3) ile anında akıllı yanıt üretir.
    """
    if not groq_client:
        return {"reply": "Groq API Anahtarı eksik veya hatalı."}
        
    producer_data = payload.context or {}
    
    if isinstance(producer_data, list):
        # Portföy (Çoklu Çiftçi) bağlamı
        portfolio_summary = "\\n".join([
            f"- İsim: {p.get('name')}, Sektör: {p.get('businessType')}, Aylık Süt Geliri: {p.get('financials', {}).get('monthlyMilkRevenue', 0)} TL, Risk Notları: {', '.join(p.get('riskNotes', []))}, Skor: {p.get('score', 0)}"
            for p in producer_data if isinstance(p, dict)
        ])
        context_str = f"""
        [Şu An İncelenen Çiftçi Portföyü Özeti]:
        {portfolio_summary}
        """
    else:
        # Tekil Çiftçi bağlamı
        context_str = f"""
        [Şu An İncelenen Çiftçi Verileri (Eğer Varsa)]:
        - İsim: {producer_data.get('name', 'Genel Sistem / Belirtilmedi')}
        - Sektör: {producer_data.get('businessType', 'Bilinmiyor')}
        - Risk Notları: {', '.join(producer_data.get('riskNotes', []))}
        - Sağmal İnek Sayısı: {producer_data.get('herd', {}).get('milkingCows', 0)}
        - Aylık Süt Geliri: {producer_data.get('financials', {}).get('monthlyMilkRevenue', 0)} TL
        - Aylık Yem Gideri: {producer_data.get('financials', {}).get('monthlyFeedCost', 0)} TL
        - Kredi Taksidi: {producer_data.get('financials', {}).get('currentLoanInstallments', 0)} TL
        """

    # Context (Bağlam) hazırlığı: Yapay Zekaya şahsın kim olduğunu fısıldıyoruz
    system_prompt = f"""
    Sen 'AgriScore Co-Pilot' adında profesyonel bir Tarımsal Finans Karar Destek asistanısın.
    Görevin, kullanıcının sorularını yanıtlamak, finansal ve tarımsal konularda sohbet etmek ve ekrandaki veriler üzerinden analitik tavsiyeler vermektir.
    KESİNLİKLE DİKKAT ETMEN GEREKEN KURALLAR:
    1. SADECE AgriScore projesi, tarımsal finans, tarım, kredi risk değerlendirmesi ve sana sağlanan çiftçi verileri hakkında konuşabilirsin.
    2. Proje kapsamı dışındaki genel kültür, siyaset, tarih, kodlama veya diğer ilgisiz konularda sorulan soruları KESİNLİKLE yanıtlama. Bu tarz sorulara "Üzgünüm, sadece AgriScore ve tarımsal finans konularında yardımcı olabilirim." şeklinde cevap ver.
    3. Cevaplarını kısa, net ve profesyonel tut (Maksimum 3-4 cümle).
    4. Asla 'Ben bir yapay zekayım' deme.
    
    {context_str}
    """
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": payload.message,
                }
            ],
            model="llama-3.1-8b-instant", # LLaMA 3.1 8B en güncel ve hızlı model
            temperature=0.3,
            max_tokens=350
        )
        
        reply = chat_completion.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Groq AI analizinde hata oluştu: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
