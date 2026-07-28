# YZTA 2026 Puanlama Kanıt Matrisi

Tarih: 28 Temmuz 2026  
Birincil kaynak: repodaki `YZTA Bootcamp 2026.pdf`, sayfa 24-26  
Amaç: puan tahmini yapmak değil, her kriter için jüriye gösterilecek somut kanıtı ve açık kalan kapıyı belirtmek.

## Durum etiketleri

- `VERIFIED_LOCAL`: kod ve yerel çalıştırma/test kanıtı mevcut.
- `PARTIALLY_VERIFIED`: çalışan bölüm var; dış ortam veya gerçek pilot kanıtı eksik.
- `EXTERNAL_GATE`: takımın GitHub, YouTube, form veya dağıtım hesabında tamamlaması gerekiyor.
- `UNVERIFIED`: iddia için yeterli kanıt yok.

## Sayfa 24 — zorunlu teslimler

| Gereksinim | Son tarih / şart | Mevcut kanıt | Durum | Kapanış eylemi |
|---|---|---|---|---|
| Ürün teslimi | 2 Ağustos Pazar, 23.59 | Yerel aday hazırlanıyor | `EXTERNAL_GATE` | Başvuru formunu son saatten önce gönder |
| Public GitHub repo | Her takım için public | Yerel Git deposu var; public görünürlük bu çalışmada doğrulanmadı | `EXTERNAL_GATE` | Repo görünürlüğünü ve erişimsiz tarayıcıdan açılabildiğini doğrula |
| Sprint ilerleme ve kanıtları | Her sprint GitHub’a eklenmeli | Repo geçmişi/proje yönetimi bu çalışmada dışarıdan doğrulanmadı | `EXTERNAL_GATE` | Sprint notları, issue/project panosu ve kanıt bağlantılarını public hale getir |
| Bootcamp sonu GitHub kayıtları | Tamamlanmalı | Kod ve dokümanlar yerelde mevcut | `PARTIALLY_VERIFIED` | Son revizyonu push et ve README bağlantılarını kontrol et |
| Canlı ürün URL’si | Opsiyonel | README’de eski olabilecek Vercel URL’si var; bu revizyon doğrulanmadı | `EXTERNAL_GATE` | Yeni revizyonu deploy et, gizli sekmede smoke test yap |
| 3 dakikalık proje videosu | YouTube’a yüklenmeli | Senaryo `DEMO_SCRIPT_3_MINUTES.md` içinde hazır | `EXTERNAL_GATE` | Videoyu kaydet, süreyi 03:00 altında tut, liste dışı/public erişimi doğrula |
| Form soruları | Eksiksiz doldurulmalı | Form içeriği repoda yok | `EXTERNAL_GATE` | Bütün zorunlu alanları ve bağlantıları ikinci kişiyle çapraz kontrol et |

## Sayfa 25 — ön değerlendirme

| Kriter | Maksimum | Gösterilecek kanıt | Doğrulama | Dürüst sınır |
|---|---:|---|---|---|
| Yarışmaya hazır, çalışan proje | 10 | Kurumsal panel → Kanıt Konseyi → üretici kanıtı → stres → ÇKS → Co-Pilot akışı | `VERIFIED_LOCAL` | Public deploy bu revizyonda henüz doğrulanmadı |
| Özgünlük | 10 | Beş kanıt-bağımlı ajan, çelişki yakalama, insan kapısı, karşı-olgusal düzeltme yolu ve SHA-256 karar makbuzu | `VERIFIED_LOCAL` | Patent/benzeri ürün taraması yapılmadı; “dünyada tek” iddiası yok |
| Ürün tamamlanma puanı | 10 | Skor, güvenilirlik, stres, fırsat, PDF alan çıkarımı, iki modlu Co-Pilot ve mobil akış birlikte çalışıyor | `PARTIALLY_VERIFIED` | Gerçek auth, OCR ve üretici entegrasyonu yok |
| Pazara uygun, talep görebilecek uygulama | 10 | Tarımsal kredi dosyasındaki veri eksikliği ve uzman inceleme süresine odaklı kurum ürünü | `PARTIALLY_VERIFIED` | İmzalı pilot, müşteri görüşmesi veya ödeme istekliliği kanıtı henüz yok |
| AI modeli seçimi, kullanımı, geliştirmesi | 20 | `rules-v2.0`, güvenilirlik motoru, deterministik stres, sınırlı karşı-olgusal arama ve isteğe bağlı düşük sıcaklıklı LLM açıklaması | `PARTIALLY_VERIFIED` | Skor gerçek temerrüt etiketiyle kalibre edilmiş ML modeli değildir; yerel ortamda `GROQ_API_KEY` yok ve canlı LLM doğrulanmadı |
| AI ajanları, hafıza, orkestrasyon | 15 | `council-v1.0`: 5 ajan, 3 bağımlı aşama, son 5 özet makbuzluk sürümlü yerel hafıza | `VERIFIED_LOCAL` | Hafıza sunucu audit log’u değildir; ham belge saklamaz |
| Mimari yapı ve temiz kod | 15 | Kanonik FastAPI kaynağı, ayrılmış servis motorları, typed sözleşmeler, lazy route’lar ve otomatik testler | `VERIFIED_LOCAL` | Tam güvenlik/penetrasyon denetimi yapılmadı |
| Canlıya alınmış / alınabilir ürün | 10 | Vite production build ve Vercel yapılandırması başarılı | `PARTIALLY_VERIFIED` | Güncel revizyonun public deployment’ı doğrulanmadı |

## Sayfa 26 — final değerlendirme

| Kriter | Maksimum | Jüri anlatısı ve ürün kanıtı | Durum |
|---|---:|---|---|
| İhtiyaç ve çözüm eşleşmesi | 20 | Eksik/dağınık tarımsal veriyi görünür kanıt, açıklanabilir risk ve uzman inceleme sırasına dönüştürmek | `PARTIALLY_VERIFIED` |
| Kullanıcı değeri ve deneyimi | 10 | Üç dakikalık yönlendirilmiş akış, mobil menü, açık hata/degraded durumları ve “sonraki doğru adım” | `VERIFIED_LOCAL` |
| Pazar potansiyeli | 10 | Banka/kooperatif/Tarım Kredi benzeri kurumlarda dosya ön inceleme ve pilot ölçümleri | `UNVERIFIED` |
| Fonksiyonel yeterlilik | 15 | Ana hesap motorları, PDF, stres, fırsat, Co-Pilot ve Kanıt Konseyi uçtan uca çalışıyor | `VERIFIED_LOCAL` |
| Ürün bütünlüğü | 10 | Bütün modüller aynı üretici kanıt zinciri ve uzman kararı sınırına hizmet ediyor | `VERIFIED_LOCAL` |
| Yapay zekâ öğeleri | 35 | Çok ajanlı kanıt konseyi + orkestrasyon izi + bounded recourse + sınırlı hafıza + LLM açıklama katmanı | `VERIFIED_LOCAL` |

## Jüri karşısında kullanılmaması gereken iddialar

- “Gerçek banka/ÇKS entegrasyonu var.”
- “Kredi onayı veya reddi veriyoruz.”
- “Model temerrüdü tahmin ediyor” veya “yüzde X doğrulukta.”
- “Fırsat kayıtları aktif resmi programlardır.”
- “OCR var” ya da görüntü PDF’lerini okuyoruz.
- “Canlı ürün güncel” — ancak dağıtım revizyonu doğrulandıktan sonra söylenebilir.
- “Derece garanti” veya “tüm puanlar kesin.”

## En kritik kalan kanıt

Pazar kriteri için en zayıf halka gerçek kullanıcı doğrulamasıdır. Yarışma öncesi en değerli dış iş, kişisel veri toplamadan 3-5 kredi uzmanına aynı demo görevini yaptırıp şu ölçümleri kaydetmektir:

1. Dosyada inceleme önceliğini bulma süresi.
2. Eksik kanıtı tespit doğruluğu.
3. Karar gerekçesini anlama puanı.
4. Ürünü pilotta kullanma isteği ve açık itirazlar.

Bu görüşmeler yapılmadan “pazar doğrulandı” denmemelidir.
