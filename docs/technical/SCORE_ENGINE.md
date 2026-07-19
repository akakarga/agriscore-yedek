# AgriScore AI - Scoring Engine Architecture

## Genel BakÄ±ÅŸ
AgriScore Scoring Engine, Ã§iftlik ve iÅŸletme verilerini alarak 6 temel finansal ve operasyonel faktÃ¶r Ã¼zerinden aÄŸÄ±rlÄ±klÄ± bir kredi risk skoru Ã¼retir. Sistem deterministik algoritmalarla Ã§alÄ±ÅŸÄ±r ve kara kutu AI yerine aÃ§Ä±klanabilir matematiksel bir model kullanÄ±r.

## Alt FaktÃ¶rler ve AÄŸÄ±rlÄ±klar
Model aÅŸaÄŸÄ±daki 6 faktÃ¶rÃ¼ deÄŸerlendirir:
1. **Ãœretim Ä°stikrarÄ± (Production Stability) - %25:** GeÃ§miÅŸ 6 aydaki sÃ¼t Ã¼retim hacminin standart sapmasÄ± ve trend Ã§izgisi incelenir.
2. **Nakit AkÄ±ÅŸÄ± GÃ¼cÃ¼ (Cashflow Strength) - %25:** SÃ¼t geliri ile yem ve diÄŸer operasyonel giderler arasÄ±ndaki pozitif marj (DSCR ve operasyonel marj).
3. **SÃ¼rÃ¼ GÃ¼cÃ¼ (Herd Strength) - %20:** SÃ¼rÃ¼ yapÄ±sÄ±ndaki saÄŸmal inek oranÄ±, dÃ¼ve/genÃ§ hayvan yenileme kapasitesi.
4. **BorÃ§ YÃ¼kÃ¼ (Debt Burden) - %15 (Ters OrantÄ±lÄ±):** Mevcut finansal yÃ¼kÃ¼mlÃ¼lÃ¼kler ve yeni kredi talebinin mevcut nakit akÄ±ÅŸÄ±na oranÄ±.
5. **Gelir DÃ¼zenliliÄŸi (Income Regularity) - %10:** Ã–demelerin ve nakit giriÅŸlerinin dÃ¼zenliliÄŸi. (Fatura ve veri sÃ¼rekliliÄŸi)
6. **Operasyonel Risk (Operational Risk) - %5 (Ters OrantÄ±lÄ±):** BÃ¶lgesel hastalÄ±klar, iklim riskleri ve iÅŸletme Ã¶lÃ§eÄŸine baÄŸlÄ± yapÄ±sal riskler.

## Veri GÃ¼venilirliÄŸi (Reliability Penalty)
Matematiksel model sonucu Ã§Ä±kan ham skor, "Veri GÃ¼venilirlik" bileÅŸeni ile Ã§arpÄ±lÄ±r.
EÄŸer Ã¼reticinin saÄŸladÄ±ÄŸÄ± veriler (fatura, resmi kayÄ±t vb.) eksikse, skor %20'ye varan bir "gÃ¼venilirlik cezasÄ±" alÄ±r.

## GÃ¼venli Taksit Kapasitesi
Mevcut net nakit akÄ±ÅŸÄ± hesaplanÄ±r ve bu akÄ±ÅŸÄ±n maksimum %60-70'i aylÄ±k Ã¶denebilecek "GÃ¼venli Taksit Kapasitesi" (DSCR > 1.25 olacak ÅŸekilde) olarak Ã¶nerilir.

## Yasal UyarÄ±
Bu motor yalnÄ±zca karar destek aracÄ±dÄ±r, kesin onay mekanizmasÄ± DEÄÄ°LDÄ°R. Karar kuruma aittir.
