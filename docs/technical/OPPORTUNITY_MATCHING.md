# AgriScore AI - Opportunity Matching Engine

## Genel BakÄ±ÅŸ
FÄ±rsat EÅŸleÅŸtirme Motoru (`opportunityEngine.ts`), Ã¼reticinin profili ve finansal/yapÄ±sal durumu ile sistemde kayÄ±tlÄ± hibe, teÅŸvik ve sÃ¼bvansiyon programlarÄ±nÄ± eÅŸleÅŸtiren modÃ¼ldÃ¼r.

## EÅŸleÅŸtirme Kriterleri
Sistem aÅŸaÄŸÄ±daki parametrelere gÃ¶re 0'dan 100'e kadar bir uyum skoru (match score) Ã¼retir:
1. **Ä°ÅŸletme Tipi (Business Type):** FÄ±rsatÄ±n hedeflediÄŸi Ã¼retici tipiyle (Ã¶rn: Aile Ä°ÅŸletmesi) eÅŸleÅŸme (+ Puan).
2. **BÃ¶lge (Region):** BÃ¶lgesel teÅŸvikler sadece ilgili bÃ¶lge Ã¼reticilerine Ã¶nerilir.
3. **Kapasite ve Hayvan SayÄ±sÄ±:** IPARD veya KÄ±rsal KalkÄ±nma gibi programlarÄ±n alt ve Ã¼st limitleri kontrol edilir.
4. **Veri GÃ¼venilirliÄŸi ve Risk Skoru:** Risk skoru Ã§ok dÃ¼ÅŸÃ¼k olanlara veya veri eksikliÄŸi olanlara hibe baÅŸvurularÄ± Ã¶nerilmez veya "Riskli" uyarÄ±sÄ± ile sunulur.

## Uyum Skoru (Match Score) Derecelendirmesi
- **75 ve Ãœzeri:** YÃ¼ksek Uygunluk (BaÅŸvuru iÃ§in gÃ¼Ã§lÃ¼ aday)
- **50 - 74:** Orta Uygunluk (BazÄ± ÅŸartlarÄ±n iyileÅŸtirilmesi veya ek belge gerekebilir)
- **50 AltÄ±:** DÃ¼ÅŸÃ¼k Uygunluk (Sistemde filtrelenir veya "Uygun DeÄŸil" olarak listelenir)

## Ã‡Ä±ktÄ±lar
- `matchScore`: 0-100 arasÄ± sayÄ±.
- `missingRequirements`: BaÅŸvuru iÃ§in eksik olan ÅŸartlarÄ±n listesi (Ã–rn: "Kapasite raporu eksik").
- `strongPoints`: AvantajlÄ± Ã¶zellikler.
- `verificationStatus`: Gerekli onay durumu.
