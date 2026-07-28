# Üretim Projeksiyon Motoru

## Mevcut yöntem

Motor makine öğrenmesi veya Prophet değildir. En az üç aylık üretim geçmişinden deterministik kısa dönem trend kuralı üretir.

1. Son üç ay ortalaması ilk üç ay ortalamasıyla karşılaştırılır.
2. `%5` üzeri artışta aylık `1,02`, `%5` üzeri düşüşte `0,97`, aksi halde `1,00` trend katsayısı kullanılır.
3. Düve oranı `%25` üzerindeyse kapasite varsayımı olarak katsayıya `0,01` eklenir.
4. Sağlık/dalgalanma risk notları güven seviyesini düşürür.

Frontend motorunda görünümü ayırt etmek için küçük deterministik mevsim faktörü bulunur. Backend rastgele değer üretmez.

## Çıktı sınırı

`confidenceLevel`, istatistiksel olarak kalibre edilmiş güven aralığı değildir. Üründe “kural tabanlı projeksiyon” olarak sunulmalıdır.

## Gerçek model için gerekenler

- En az 24-36 ay doğrulanmış üretim serisi
- Sürü giriş/çıkışları, laktasyon evresi ve hastalık kayıtları
- Bölgesel sıcaklık/nem ve yem rasyonu
- Backtest, MAE/MAPE ve baseline karşılaştırması
- Veri sızıntısı ve mevsimsel sapma kontrolleri

Bu kanıtlar olmadan Prophet/ML tahmini veya doğruluk yüzdesi iddiası yapılmamalıdır.
