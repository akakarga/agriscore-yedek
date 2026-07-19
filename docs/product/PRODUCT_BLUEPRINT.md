# PRODUCT BLUEPRINT

## Problem
Bankalar ve finans kurumlarÄ± kÄ±rsaldaki Ã§iftÃ§ilere, sÃ¼t Ã¼reticilerine veya hayvancÄ±lÄ±k iÅŸletmelerine kredi verirken Ã§iftÃ§inin gerÃ§ek Ã¼retim gÃ¼cÃ¼nÃ¼, canlÄ± hayvan varlÄ±ÄŸÄ±nÄ±, sÃ¼t Ã¼retim istikrarÄ±nÄ±, yem maliyeti baskÄ±sÄ±nÄ± ve gelecek nakit akÄ±ÅŸÄ±nÄ± yeterince gÃ¶rÃ¼nÃ¼r ÅŸekilde analiz edememektedir. AyrÄ±ca Ã¼reticiden alÄ±nan verilerin doÄŸruluÄŸu (gÃ¼venilirliÄŸi) bir risk faktÃ¶rÃ¼dÃ¼r.

## Ã‡Ã¶zÃ¼m
AgriScore AI, Ã§iftlik verilerini finansal karar destek diline Ã§evirir. Kredi kararÄ± vermez; kredi deÄŸerlendirme sÃ¼recini destekler. Ãœretim, nakit akÄ±ÅŸÄ± ve sÃ¼rÃ¼ verilerini analiz ederek aÃ§Ä±klanabilir, deterministik bir risk skoru ve finansal projeksiyonlar Ã¼retir.

## KullanÄ±cÄ±lar
- **Banka / Finans Kurumu Personeli:** Ãœretici listelerini inceler, risk skorlarÄ±na gÃ¶re kredi deÄŸerlendirmesi yapar.
- **Kooperatif / TarÄ±msal Finans KuruluÅŸu:** Ãœretici risklerini takip eder, sorunlu Ã¼reticilere destek Ã¶nceliklendirmesi yapar.
- **Ã‡iftÃ§i / SÃ¼t Ãœreticisi:** Kendi verilerini gÃ¶rerek finansal saÄŸlÄ±ÄŸÄ±nÄ± deÄŸerlendirir.

## Ekranlar
1. **Landing (ÃœrÃ¼n TanÄ±tÄ±m):** Problem ve Ã§Ã¶zÃ¼m odaklÄ± Ã¼rÃ¼n karÅŸÄ±lama ekranÄ±.
2. **Platform Ä°nceleme Rehberi:** ÃœrÃ¼nÃ¼n vizyonunu ve "AÃ§Ä±klanabilir Finansal Karar Destek" yaklaÅŸÄ±mÄ±nÄ± aktaran bilgilendirme sayfasÄ±.
3. **Kurum Dashboard:** Toplam Ã¼retici sayÄ±sÄ±, kredi hacmi, risk daÄŸÄ±lÄ±mÄ± grafikleri, bÃ¶lgesel portfÃ¶y analizi ve yÃ¼ksek riskli Ã¼retici listesi.
4. **Ãœretici Listesi:** Ãœreticilerin risk seviyelerine ve AgriScore gÃ¼venilirlik (reliability) puanlarÄ±na gÃ¶re filtreleme yapÄ±labilen analitik tablo.
5. **Ãœretici Detay:** 
   - Genel BakÄ±ÅŸ (Alt skorlar, geÃ§miÅŸ Ã¼retim, taksit kapasitesi)
   - Nakit & SÃ¼rÃ¼ (Finansal veriler)
   - Verim Tahmini (Gelecek projeksiyonu)
   - Veri KaynaklarÄ± (Belge ve doÄŸrulama durumu takibi)
   - Senaryo Analizi (DSCR stres testi, kredi taksiti simÃ¼lasyonu)
   - Uygun Destekler (Hibe ve teÅŸvik eÅŸleÅŸtirmeleri)
   - AI Destekli Risk Raporu
6. **Destek & FÄ±rsatlar Merkezi:** TÃ¼m Ã¼reticiler iÃ§in geÃ§erli hibe ve sÃ¼bvansiyonlarÄ±n listelendiÄŸi, arama yapÄ±labilen eÅŸleÅŸtirme sayfasÄ±.
7. **YazdÄ±rÄ±labilir Kurumsal Rapor:** Kredi komitesine sunulmak Ã¼zere optimize edilmiÅŸ, A4 boyutunda yazdÄ±rÄ±labilir detaylÄ± Ã¼retici skor kartÄ±.

## ModÃ¼ller
- **AgriScore Motoru:** 6 temel faktÃ¶re (Ãœretim, Nakit AkÄ±ÅŸÄ±, SÃ¼rÃ¼, BorÃ§, Gelir DÃ¼zenliliÄŸi, Operasyonel Risk) dayalÄ± risk skoru Ã¼reticisi.
- **Reliability (Veri GÃ¼venilirliÄŸi) Motoru:** Eksik veya zayÄ±f verilerde ihtiyat payÄ± (penalty) kesintisi yapan katman.
- **Senaryo Analiz Motoru:** Yem fiyat artÄ±ÅŸÄ±, verim dÃ¼ÅŸÃ¼ÅŸÃ¼ veya yeni kredi taksiti gibi durumlarda nakit akÄ±ÅŸÄ±nÄ± ve borÃ§ Ã¶deme kapasitesini (DSCR) Ã¶lÃ§en stres testi simÃ¼latÃ¶rÃ¼.
- **Verim Tahmin Motoru (Forecasting):** Trend ve kapasite odaklÄ± gelecek Ã¼retim tahmincisi.
- **FÄ±rsat EÅŸleÅŸtirme Motoru:** Ä°ÅŸletmenin tipi, bÃ¶lgesel durumu ve eksik belge kriterlerine gÃ¶re hibe/teÅŸvik uygunluk skoru hesaplayan deterministik sistem.
- **AI Agent Risk Raporu:** Belirli kural setleri ve veriler Ã¼zerinden metin tabanlÄ± (narrative) rapor Ã¼reticisi (Ä°lerleyen aÅŸamalar iÃ§in RAG/VektÃ¶r DB altyapÄ±sÄ±na hazÄ±r).
- **YazdÄ±rÄ±labilir Raporlama:** Ãœretici detayÄ±ndan alÄ±nabilen fiziksel kredi baÅŸvuru dosyasÄ± uyumlu yazdÄ±rÄ±labilir risk deÄŸerlendirme gÃ¶rÃ¼nÃ¼mÃ¼.

## YarÄ±ÅŸma Teslim KapsamÄ±
Sistem lokal ortamda tamamen Ã§alÄ±ÅŸÄ±r, arayÃ¼zleri etkileÅŸimlidir ve sahte (dummy/mock) API hissi uyandÄ±rmadan deterministik "seed data" ile kendi iÃ§erisinde gÃ¼venilir bir deneyim sunar. TÃ¼m motorlar (skorlama, tahmin, gÃ¼venilirlik, senaryo) mock olarak deÄŸil, saf Typescript algoritmalarÄ± olarak Ã§alÄ±ÅŸÄ±r.
