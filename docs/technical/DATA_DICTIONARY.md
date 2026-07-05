# Veri Sözlüğü (Data Dictionary)

Bu sözlük, AgriScore AI platformunun temel nesnelerini (`seedData` içerisindeki), bu verilerin ne anlama geldiğini, algoritmalara olan etkilerini ve gerçek ortamda hangi kurumlardan/yöntemlerle doğrulanması gerektiğini açıklar.

*Tüm veriler mevcut MVP sürümünde demonstrasyon amaçlı senaryolaştırılmış (seed) verilerdir.*

## Üretici Temel Verileri (Producer Context)

| Alan Adı | Açıklama | Kullanıldığı Yer | Skora/Tahmine Etkisi | Demo Veri mi? | Gerçek Sürümde Doğrulama Kaynağı |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `producerId` | Üretici benzersiz kimliği. | Tüm sistem. | Yok (Sistem Anahtarı). | Evet | TCKN veya VKN (e-Devlet / Banka) |
| `name` | Üretici veya işletme adı. | UI Listeleri, Rapor. | Yok. | Evet | Resmi kimlik / Şirket Sicil |
| `region` | İşletmenin bulunduğu il/bölge. | Fırsat Eşleştirme, UI. | Fırsat (Hibe) bölge uygunluğu. | Evet | ÇKS (Çiftçi Kayıt Sistemi) / Adres |
| `herdSize` | Toplam büyükbaş hayvan sayısı. | Sürü Gücü, Fırsat Eşleştirme. | Güçlü varlık sinyali. | Evet | TÜRKVET / İlçe Tarım Müdürlüğü |
| `milkingCows` | Sağmal (aktif süt veren) inek sayısı. | Gelecek Verim Tahmini. | Süt üretim hacmini ve nakit akışını doğrudan etkiler. | Evet | Sürü Kayıt Örneği / TÜRKVET |

## Finansal ve Operasyonel Veriler (Financial Context)

| Alan Adı | Açıklama | Kullanıldığı Yer | Skora/Tahmine Etkisi | Demo Veri mi? | Gerçek Sürümde Doğrulama Kaynağı |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `monthlyMilkLiters` | Ortalama aylık süt üretimi (L). | Tahmin Motoru, Skor. | İstikrarı ve kapasiteyi ölçer. | Evet | Müstahsil Makbuzu / Süt İşleme Tesisi (B2B API) |
| `milkPrice` | Birim süt satış fiyatı (TL/L). | Nakit Akışı Skoru. | Toplam ciro hesaplamasına temel oluşturur. | Evet | Ulusal Süt Konseyi Verisi / Süt Faturası |
| `monthlyRevenue` | Aylık toplam tahmini ciro. | DSCR, Stres Testi. | Borç ödeme gücünü (pozitif yönde) belirler. | Evet | Banka Hesap Hareketleri (Açık Bankacılık) |
| `feedCost` | Aylık yem ve rasyon maliyeti. | Nakit Akışı Skoru. | Nakit çıkışını ve kar marjını (negatif yönde) belirler. | Evet | Yem Bayi Faturaları / Kooperatif Borç Dökümü |
| `veterinaryCost` | Aylık sağlık ve veteriner gideri. | Operasyonel Risk. | Beklenmeyen giderleri ölçer. Yüksekliği sürü sağlık riski sinyalidir. | Evet | Veteriner Kayıtları / Faturalar |
| `debtPayment` | Aylık mevcut kredi/borç taksidi. | Borç Yükü (DSCR). | Yeni kredi alma kapasitesini baskılar. | Evet | KKB (Kredi Kayıt Bürosu) / Findeks |
| `requestedCreditAmount` | Talep edilen yeni kredi/finansman tutarı. | Stres Testi (Senaryolar). | Olası DSCR düşüşünü ve senaryo riskini tetikler. | Evet | Finans Kurumu Kredi Başvuru Ekranı |

## Güven ve Analiz Çıktıları (Engine Outputs)

| Alan Adı | Açıklama | Kullanıldığı Yer | Skora/Tahmine Etkisi | Demo Veri mi? | Gerçek Sürümde Doğrulama Kaynağı |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `reliabilityScore` | Veri Güvenilirliği Skoru (0-100). | Tüm Raporlar, UI. | Eksik/onaysız belge varsa Risk Skorunu aşağı yönlü (discount) baskılar. | Algoritmik | `documents` nesnesindeki resmi/gayriresmi oranının hesaplanması |
| `riskScore` | AgriScore Ana Risk Skoru (0-100). | Kurumsal Panel, Dashboard. | Karar destek sinyali olarak nihai değerlendirmeyi yansıtır. | Algoritmik | Sistem içi 6 faktörlü hesaplama (deterministik) |
| `opportunityScore` | Fırsat/Hibe Uygunluk Skoru (0-100). | Üretici Paneli (Fırsatlar). | Başvuru rehberi olarak önceliklendirme sağlar. | Algoritmik | Üretici profilinin TKDK/KOSGEB şartnameleriyle (NLP/Kurallar) eşleşmesi |
| `forecast` | Gelecek 6 aylık üretim tahmini. | Tahmin Grafiği. | Sürdürülebilir nakit akışını gösterir. | Algoritmik | Geçmiş `monthlyMilkLiters` verisinin Laktasyon eğrisiyle projekte edilmesi |
| `scenarios` | Stres testi (ör: "Süt %10 düşerse"). | Kurum Portföy / Senaryolar. | Dayanıklılığı ve DSCR kırılganlığını ölçer. | Algoritmik | Gelir/Gider formüllerinde dinamik değişiklik simülasyonu |

## Veri Kaynağı Objeleri (Documents & DataSources)

| Alan Adı | Açıklama | Kullanıldığı Yer | Skora/Tahmine Etkisi | Demo Veri mi? | Gerçek Sürümde Doğrulama Kaynağı |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `dataSources` | İşletmeye ait belgelerin ve verilerin meta dataları (Tür, Durum, Etki). | Veri Güven Merkezi. | Doğrulanmış her belge `reliabilityScore` oranını artırır. Eksik veya geçersiz belge "risk" flag'i üretir. | Evet | OCR Sistemleri, Kurum API Entegrasyonları (ÇKS, E-Devlet, TARSİM) |
| `documents` | Fiziksel/PDF belgelerin sisteme yüklendiğini varsayan dizin. | Başvuruya Hazırlık Skoru. | Başvuru hazırlığını kanıtlar. | Evet | Üretici Portalı (Belge Yükleme) |
