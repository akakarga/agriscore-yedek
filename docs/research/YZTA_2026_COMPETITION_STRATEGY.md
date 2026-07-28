# YZTA Bootcamp 2026 Yarışma Stratejisi

Tarih: 28 Temmuz 2026  
Karar: **DO CONDITIONALLY**

## Yönetici özeti

AgriScore’un derece alma şansı, “çok özellik” göstermekten değil üç kanıtı aynı anda sunmaktan gelir:

1. Tarımsal finans problemine net ihtiyaç-çözüm uyumu.
2. Açıklanabilir ve uçtan uca çalışan karar destek akışı.
3. Veri kaynağı, belirsizlik ve AI sınırlarını dürüstçe gösteren güven mimarisi.

Gerçek kişi bazlı üretici verisi; yetki, açık hukuki dayanak, aydınlatma ve doğrulama olmadan ürüne eklenmemelidir. En güçlü yarışma yaklaşımı, açıkça etiketlenmiş sentetik senaryo profilleri ile doğrulanmış resmi makro bağlamı birlikte kullanmaktır.

## Yarışma kriteriyle eşleşme

Yerel `YZTA Bootcamp 2026.pdf` sayfa 25-26’ya göre ön değerlendirmede çalışan/yarışmaya hazır ürün, özgünlük, tamamlanma ve pazar uyumu; ayrıca model kullanımı, AI ajanları, temiz mimari ve deploy edilebilirlik puanlanıyor. Finalde ihtiyaç-çözüm uyumu 20, kullanıcı deneyimi 10, pazar 10, fonksiyonel yeterlilik 15, ürün bütünlüğü 10 ve AI unsurları 35 puan.

Bu nedenle öncelik sırası:

1. Gerçekten çalışan demo akışı ve hata durumları.
2. Açıklanabilir skor + veri güvenilirliği + insan kararı sınırı.
3. Co-Pilot’un aynı gerçek hesap bağlamını açıklaması.
4. Kanıt Konseyi’nin ajan bağımlılıklarını, çelişkileri ve insan kapısını görünür kılması.
5. Pazar bağlamının resmi ve kaynaklı olması.
6. Mobil ve jüri tarafından hızlı anlaşılır sunum.

Puan için eklenmiş ama ürün amacına hizmet etmeyen ajan, RAG, vektör veritabanı veya “ML” etiketi eklenmemelidir.

## Resmi veri araştırması

### Kullanılabilir açık/resmi bağlam

- Ulusal Süt Konseyi, 1 Mayıs 2026’dan itibaren çiğ inek sütü tavsiye fiyatını 24,30 TL/L olarak yayımladı:  
  https://ulusalsutkonseyi.org.tr/ulusal-sut-konseyi-cig-sut-tavsiye-fiyati-13-5140/
- TÜİK Veri Portalı güncel süt üretim bültenlerini ve Haziran 2026’dan itibaren SDMX web servisini yayımlıyor:  
  https://veriportali.tuik.gov.tr/Home/
- TKDK, IPARD III 2026 çağrı takviminde toplam 241 milyon avroluk bütçe açıkladı:  
  https://www.tkdk.gov.tr/Haber/bakan-yumakli-241-milyon-avro-butceli-2026-cagri-takvimimiz-hayirli-olsun-13038?lang=tr

Bu veriler makro piyasa ve güncel program bağlamı sağlar. Tek bir üreticinin geliri, sürüsü veya destek uygunluğu olarak kullanılamaz.

### Açık olmayan/kimlik doğrulamalı üretici verisi

ÇKS belgesi sorgulama ve doğrulama hizmetleri e-Devlet altyapısında kimlik doğrulamalı sunuluyor:

https://www.turkiye.gov.tr/tarim-ve-orman-bakanligi

Bu, halka açık bir üretici portföy API’si olduğu anlamına gelmez. Yarışma demosunda gerçek kişilerin ÇKS veya finans verisini toplamak yerine kullanıcı kontrollü belge yükleme ve alan çıkarımı gösterilmelidir.

### KVKK ve finansal karar riski

KVKK’nın bankacılık/ödeme sektörü rehberleri; finansal geçmiş ve işlem kayıtlarının yoğun kişisel veri işleme doğurduğunu, veri işleme şartları, aktarım, aydınlatma ve güvenlik yükümlülüklerini vurguluyor:

- https://www.kvkk.gov.tr/Icerik/8148/Kisisel-Verilerin-Korunmasina-Iliskin-Bankacilik-Sektoru-Iyi-Uygulamalar-Rehberi-Guncellendi
- https://www.kvkk.gov.tr/Icerik/8286/Odeme-ve-Elektronik-Para-Sektorunde-Kisisel-Verilerin-Korunmasina-Iliskin-Iyi-Uygulamalar-Rehberi

Sonuç: gerçek kişi verisi olmadan “gerçek portföy” iddiası yapılmamalı; gerçek pilot için kurum anlaşması, açık veri sorumluluğu ve güvenli altyapı gerekir.

## Kazandıracak ürün anlatısı

“Bankanın yerine karar veren AI” zayıf ve riskli bir anlatıdır.

Daha güçlü anlatı:

> AgriScore, üretim ve finans kayıtlarını açıklanabilir sinyallere dönüştürür; eksik veriyi görünür kılar; stres senaryolarını yeniden hesaplar; uzman kararını hızlandırır.

Jüri demosu:

1. Sentetik veri etiketi ve resmi pazar kartını göster.
2. P008 profiliyle Kanıt Konseyi’ni aç; beş ajanı ve üç aşamalı orkestrasyonu göster.
3. Ajan görüş ayrılığını ve insan incelemesi kapısını göster.
4. Karşı-olgusal eylem yolunu ve varsayım sınırlarını göster.
5. SHA-256 parmak izli karar makbuzu üret.
6. Co-Pilot’a konsey sonucunu açıklat.
7. Kalan sürede ÇKS’nin skor üretmediğini veya hardcoded olmayan stres sonucunu göster.

## Neden sentetik senaryo verisini tamamen kaldırmıyoruz?

`DO NOT`: Açık kaynaktan bulunmuş gerçek kişileri veya doğrulanmamış kayıtları portföy verisi yapmak.

`DO`: Sentetik senaryo verisini açıkça etiketlemek, motor testlerini bu fixture’larla yapmak ve resmi makro veriyi kaynak/tarih damgasıyla ayrı katman olarak göstermek.

`DO CONDITIONALLY`: Gerçek üretici verisine yalnızca kurum/üretici izni, güvenli kimlik doğrulama, veri minimizasyonu, kayıtlı aydınlatma ve silme/düzeltme süreçleri hazır olduğunda geçmek.

## Sonraki en değerli işler

1. 3-5 kredi uzmanıyla ölçümlü görev testi ve yazılı pilot niyeti.
2. Gerçek auth + server-side RBAC.
3. Kaynak snapshot’larını SDMX/TKDK değişiklik takibiyle güncelleyen provenance servisi.
4. Skor modelinin kooperatif/banka tarafından anonimleştirilmiş geri ödeme verisiyle kalibrasyonu.
5. Eşitlik, sapma, yanlış pozitif/negatif ve manuel override değerlendirmesi.
6. Düşük hızlı mobil ağ testi.

## Başarı ölçütü

Yarışma demosu başarılı sayılırsa:

- Her sayı kaynak veya formülle açıklanabilir.
- API kapalıyken sahte başarı oluşmaz.
- Aynı girdi frontend ve backend’de aynı karar destek sonucunu verir.
- Ajanlar kanıt, yöntem, güven ve sınırlama olmadan görüş üretmez.
- Değiştirilemez üretici alanları karşı-olgusal planda manipüle edilmez.
- Jüri üç dakika içinde problemi, kullanıcıyı, AI katkısını ve güven sınırını anlayabilir.
