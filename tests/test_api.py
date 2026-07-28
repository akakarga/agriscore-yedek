import io
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient
from pypdf import PdfWriter

from backend import main


def producer_payload():
    return {
        "id": "TEST-1",
        "name": "Sentetik Test Profili",
        "location": "Bursa / Test",
        "businessType": "Süt Çiftliği",
        "herd": {
            "totalCattle": 100,
            "milkingCows": 60,
            "heifers": 20,
            "calves": 15,
            "dryCows": 5,
        },
        "productionHistory": [
            {"month": f"2026-{month:02d}", "totalLiters": 50_000 + month * 100, "averagePerCow": 27}
            for month in range(1, 7)
        ],
        "financials": {
            "monthlyMilkRevenue": 800_000,
            "monthlyFeedCost": 350_000,
            "monthlyOtherCosts": 100_000,
            "currentLoanInstallments": 50_000,
            "requestedLoanAmount": 500_000,
        },
        "riskNotes": [],
        "dataSources": [
            {
                "name": "Test Belgesi",
                "status": "doğrulandı",
                "date": "2026-07-28",
                "impact": "Test",
                "description": "Sentetik test kaydı",
            }
        ],
        "farmMemory": "",
        "verificationNotes": [],
    }


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(main.app)

    def test_score_uses_dscr_protected_new_installment_capacity(self):
        response = self.client.post("/api/score", json=producer_payload())
        self.assertEqual(response.status_code, 200)
        result = response.json()
        operating_income = 800_000 - 350_000 - 100_000

        self.assertEqual(result["methodologyVersion"], "rules-v2.0")
        self.assertEqual(result["currentDscr"], 7.0)
        self.assertEqual(
            result["safeInstallmentRange"],
            {
                "min": round(operating_income / 1.5 - 50_000),
                "max": round(operating_income / 1.25 - 50_000),
            },
        )

    def test_missing_financial_fields_do_not_become_zero_or_a_score(self):
        payload = producer_payload()
        payload["financials"]["monthlyOtherCosts"] = None
        payload["financials"]["currentLoanInstallments"] = None

        response = self.client.post("/api/score", json=payload)
        self.assertEqual(response.status_code, 200)
        result = response.json()

        self.assertEqual(result["assessmentStatus"], "Eksik Bilgi")
        self.assertEqual(result["decisionReadiness"], "Bilgi Gerekli")
        self.assertIsNone(result["overallScore"])
        self.assertIsNone(result["riskLevel"])
        self.assertIsNone(result["operatingIncome"])
        self.assertIsNone(result["safeInstallmentRange"])
        self.assertEqual(result["reliabilityScore"], 70)
        self.assertEqual(
            result["missingCriticalData"],
            ["Aylık diğer giderler", "Mevcut kredi taksitleri"],
        )

    def test_document_reliability_does_not_change_economic_score(self):
        verified_payload = producer_payload()
        incomplete_payload = producer_payload()
        incomplete_payload["dataSources"][0]["status"] = "eksik"

        verified_result = self.client.post(
            "/api/score", json=verified_payload
        ).json()
        incomplete_result = self.client.post(
            "/api/score", json=incomplete_payload
        ).json()

        self.assertEqual(
            verified_result["overallScore"], incomplete_result["overallScore"]
        )
        self.assertGreater(
            verified_result["reliabilityScore"],
            incomplete_result["reliabilityScore"],
        )

    def test_cks_text_extracts_fields_but_never_credit_score(self):
        response = self.client.post(
            "/api/parse-cks",
            json={"document_text": "Toplam kullanılan alan (da): 145,5 ve 28 baş inek."},
        )
        self.assertEqual(response.status_code, 200)
        result = response.json()["extractedData"]

        self.assertEqual(result["totalCattle"], 28)
        self.assertEqual(result["landSize"], 145.5)
        self.assertIsNone(result["estimatedScore"])
        self.assertEqual(result["riskLevel"], "DEĞERLENDİRİLEMEZ")

    def test_malformed_pdf_is_rejected_instead_of_returning_fake_success(self):
        response = self.client.post(
            "/api/upload-cks-pdf",
            files={"file": ("belge.pdf", b"not a pdf", "application/pdf")},
        )
        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.json()["detail"]["code"], "INVALID_PDF")

    def test_image_only_pdf_is_rejected_when_ocr_is_unavailable(self):
        writer = PdfWriter()
        writer.add_blank_page(width=200, height=200)
        buffer = io.BytesIO()
        writer.write(buffer)

        response = self.client.post(
            "/api/upload-cks-pdf",
            files={"file": ("blank.pdf", buffer.getvalue(), "application/pdf")},
        )
        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.json()["detail"]["code"], "TEXT_UNAVAILABLE")

    def test_missing_copilot_provider_returns_degraded_status(self):
        with patch.object(main, "groq_client", None):
            response = self.client.post(
                "/api/copilot/chat",
                json={"message": "Risk nedir?", "context": {}},
            )
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["detail"]["code"], "COPILOT_UNAVAILABLE")


if __name__ == "__main__":
    unittest.main()
