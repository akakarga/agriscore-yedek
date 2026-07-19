# Araştırma Kaynakları (Research Sources)

Bu proje kurgulanırken ulusal ve uluslararası tarımsal finansman, alternatif veri, makine öğrenimi ve veri güvenliği kaynaklarından yararlanılmıştır.

Aşağıdaki tablo, AgriScore AI mimarisi tasarlanırken faydalanılan ana kaynakları, kullanım amaçlarını ve ürün üzerindeki etkilerini listeler. **Önemli Not:** Üründe yer alan değerler yarışma amaçlı demo senaryolarıdır. Aşağıdaki kaynaklara doğrudan canlı bir API entegrasyonu bulunmamaktadır.

| Kaynak Adı / Organizasyon | Ne İçin Kullanıldı? | Ürüne Etkisi | Doğrulama Durumu & Güncellik Notu | Dikkat Edilmesi Gereken Nokta |
| :--- | :--- | :--- | :--- | :--- |
| **TÜİK (Türkiye İstatistik Kurumu)** | Çiğ süt üretim miktarları, sığır varlığı, bölgesel hayvancılık istatistikleri. | Süt üretim verimindeki dalgalanma ihtiyacını ve mevsimselliği modellemek için temel alındı. | Genel konsept olarak doğrulandı. | Makro istatistiklerdir; üretici bazında gerçek değer olarak kullanılamaz. |
| **FAO (Gıda ve Tarım Örgütü)** | Alternatif veriyle kredi skorlama ve küçük ölçekli üretici finansmanı raporları. | Geleneksel skor yerine alternatif verinin önemini kavramak ve pazar problemine dayanak oluşturmak. | Konseptual olarak doğrulandı. (Global Raporlar) | Sektörün ihtiyacını kanıtlar, doğrudan veri girdisi sağlamaz. |
| **World Bank (Dünya Bankası)** | Dijital tarım kredileri ve finansal kapsayıcılık (financial inclusion) araştırmaları. | Tarımsal finansmanın sürdürülebilirliği vizyonu. | Konseptual olarak doğrulandı. | - |
| **EBA (Avrupa Bankacılık Otoritesi)** | Makine öğrenimi tabanlı skorlama modellerinin şeffaflığı ve risk yönetişimi ilkeleri. | AgriScore AI'ın "black-box" olmaktan çıkıp, "açıklanabilir karar destek raporu" olarak tasarlanması. | Referans olarak alındı. | Model şeffaflığının yasal bir zorunluluk (gelecek regülasyonlar bağlamında) olduğu prensibi ürüne entegre edildi. |
| **TKDK / IPARD** | Kırsal kalkınma destekleri başvuru şartları. | Uygulama içerisindeki "Fırsat Eşleştirme" modülünün (Opportunities) temel kurgusu. | Çerçeve şartları incelendi. | Destek şartları dönemsel olarak değişir. Nihai teyit her zaman TKDK yetkili kanallarından yapılmalıdır. |
| **Tarım ve Orman Bakanlığı** | Çiftçi Kayıt Sistemi (ÇKS) ve TÜRKVET hayvan kayıt sistemleri. | Projede "Veri Güvenilirliği" ölçümü için referans alınan en güçlü belge tiplerinin (Sürü Kayıt Örneği vb.) belirlenmesi. | Sistem yapısı referans alındı. | Ürün demo olduğu için bu sistemlere e-Devlet veya API üzerinden canlı bağlantı kurulmamıştır. |
| **TARSİM (Tarım Sigortaları Havuzu)** | Hayvan hayat sigortası vb. ürünlerin varlığı ve risk algısına etkisi. | Sigorta hazırlık durumunun, risk skorunu iyileştiren "risk azaltıcı faktör" olarak konumlandırılması. | Konseptual olarak doğrulandı. | Poliçe kontrolü için gerçek üretim aşamasında TARSİM entegrasyonu gereklidir. |
| **KVKK İlgili Mevzuat** | Kişisel verilerin korunması ve açık rıza prensipleri. | "Veri Güven Merkezi" tasarımının ve kullanıcının verisini kontrol etme prensibinin ürüne yansıtılması. | Hukuki konsept olarak referans alındı. | Canlı üründe açık rıza onay mekanizmaları kritik önem taşıyacaktır. |
| **DenizBank & Tarfin Çalışmaları** | Sektördeki en yakın yerel referansların dijitalleşme ve saha entegrasyon pratikleri. | Üretici profilleme ve "Aylık Süt Geliri - Borç Ödeme" dinamiğinin (DSCR) kurgulanması. | Saha gözlemi / Açık kaynak araştırması | Doğrudan bağlantı veya entegrasyon yoktur, pazar pratiği analizi için incelenmiştir. |

## Gelecek Araştırma ve Doğrulama Adımları
Gerçek bir canlı sistem (production) öncesinde yapılması gereken teknik ve hukuki doğrulamalar şunlardır:
- **Resmi Kurum API Entegrasyonları:** ÇKS, TÜRKVET ve e-Devlet kapısı API dokümantasyonlarının teknik entegrasyonu.
- **Finansal Regülasyon Uyumu:** BDDK ve TCMB çerçevesinde, bankalara dışarıdan sağlanan karar destek ve veri analiz yazılımlarına yönelik güvenlik standartlarının doğrulanması.
- **Sektörel Pilot Uygulama:** Tarımsal bir kooperatif veya bankanın test verisiyle model kalibrasyonunun gerçek veriler üzerinde doğrulanması.
