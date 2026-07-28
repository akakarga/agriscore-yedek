# AgriScore AI Product Blueprint

## Kullanıcı problemi

Süt üreticisinin gerçek operasyon kapasitesi yalnızca klasik finansal tablolarda görünmeyebilir. Finans uzmanı da dağınık üretim, sürü, belge ve nakit akışı kayıtlarını hızlı ve tutarlı biçimde incelemekte zorlanır.

## Ürün vaadi

AgriScore:

1. Üretim, sürü, nakit ve belge sinyallerini tek profilde toplar.
2. Açıklanabilir `rules-v2.0` skorunu ve veri güvenilirliğini ayrı gösterir.
3. Stres varsayımlarını aynı motorla yeniden hesaplar.
4. Eksik veriyi ve resmi doğrulama ihtiyacını görünür kılar.
5. Co-Pilot ile mevcut sayıların ne anlama geldiğini açıklar.

## Ürün sınırı

AgriScore banka, kredi kuruluşu veya resmi destek portalı değildir. Kredi onayı/ret, faiz teklifi, garanti veya resmi uygunluk üretmez.

## Veri katmanları

- Sentetik senaryo profilleri: yarışma akışı ve test fixture’ları.
- Doğrulanmış resmi snapshot: USK, TÜİK, TKDK makro bağlamı.
- Kullanıcı yüklemeli belge: yalnızca metin çıkarımı; finansal skor için tek başına yeterli değil.

## Ana kullanıcı yolculuğu

Kurumsal kullanıcı:

```text
Portföy özeti → risk/veri güvenilirliği → üretici detayı → stres testi → belge/fırsat kontrolü → rapor
```

Üretici:

```text
Çiftlik özeti → üretim/finans → belge eksikleri → uygunluk senaryosu → başvuru hazırlığı
```

## Başarı metrikleri

Pilot aşamasında:

- İnceleme süresinde azalma
- Eksik veri yakalama oranı
- Manuel değerlendirmeyle skor uyumu
- Yanlış pozitif/yanlış negatif analizi
- Kullanıcının skoru açıklayabilme oranı
- Kaynak güncelliği ve hata durumu görünürlüğü

Gerçek veri pilotu olmadan temerrüt doğruluğu veya finansmana erişim artışı iddia edilmez.
