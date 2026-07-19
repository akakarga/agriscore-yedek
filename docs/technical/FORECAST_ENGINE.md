# AgriScore AI - Forecast Engine Architecture

## Genel BakÄ±ÅŸ
Forecast Engine, geÃ§miÅŸ Ã¼retim verileri ve sÃ¼rÃ¼ yapÄ±sÄ± dinamiklerini analiz ederek gelecek 6 aylÄ±k periyotta sÃ¼t Ã¼retim hacmi, ciro ve risk trendlerini projeksiyon olarak sunar.

## Metodoloji
1. **Tarihsel Ãœretim Ã‡izgisi:** Son 6 veya 12 aylÄ±k veriler, basit hareketli ortalama (SMA) veya doÄŸrusal regresyon trendi kullanÄ±larak analiz edilir.
2. **SÃ¼rÃ¼ Demografisi Etkisi:** 
   - DÃ¼velerin saÄŸmal sÃ¼rÃ¼ye katÄ±lma projeksiyonu pozitif etki yaratÄ±r.
   - Kuruya ayrÄ±lacak inek sayÄ±sÄ± veya laktasyon sonu dÃ¶nemleri negatif etki yaratÄ±r.
3. **Mevsimsellik:** Sistem genel bir mevsimsel faktÃ¶r (-%5 ile +%5 arasÄ±) uygulayarak yaz (sÄ±caklÄ±k stresi) veya bahar (bol yem) etkilerini simÃ¼le eder.

## Ã‡Ä±ktÄ±lar
- `predictions`: Gelecek 6 ay iÃ§in Ã¶ngÃ¶rÃ¼len sÃ¼t hacmi ve gelir tablosu.
- `trendExplanation`: AI tarafÄ±ndan aÃ§Ä±klanabilir ÅŸekilde sunulan Ã¶zet (Ã–rn: "GenÃ§ hayvanlarÄ±n sÃ¼rÃ¼ye katÄ±lmasÄ±yla %10 artÄ±ÅŸ beklenmektedir").
- `confidenceLevel`: Veri doÄŸruluÄŸu ve trend stabilitesine gÃ¶re belirlenen gÃ¼ven skoru.

## KullanÄ±m AmacÄ±
Gelecekteki nakit akÄ±ÅŸÄ±nÄ± tahmin ederek, istenilen kredi taksitlerinin 6 ay sonra da gÃ¼venle Ã¶denip Ã¶denemeyeceÄŸini kuruma gÃ¶stermek.
