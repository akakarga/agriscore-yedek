# AgriScore Jüri Hazırlık Uygulama Planı

Tarih: 28 Temmuz 2026  
Kaynak: `YZTA Bootcamp 2026.pdf`, sayfa 24-26

## Karar

En yüksek puan açığı, finaldeki 35 puanlık yapay zekâ öğeleri ile ön değerlendirmedeki 15 puanlık ajan/hafıza/orkestrasyon kanıtıdır.

Ürünün çekirdeğini dağıtmadan `AgriScore Kanıt Konseyi` eklenecek:

1. **Veri Kanıt Ajanı:** doğrulanmış, bekleyen ve eksik kaynakları değerlendirir.
2. **Finansal Risk Ajanı:** `rules-v2.0`, DSCR ve taksit kapasitesini açıklar.
3. **Dayanıklılık Ajanı:** yem, süt, üretim ve yeni taksit şoklarını karşılaştırır.
4. **Destek Bekçisi:** yapılandırılmış fırsat kuralları ve doğrulanmış belgeleri kontrol eder.
5. **Karşı-Olgusal Planlayıcı:** değiştirilemez kimlik alanlarına dokunmadan, daha güvenli banda götüren en düşük maliyetli doğrulanabilir eylem bileşimini arar.

Orkestratör; ajan çıktılarından insan incelemesi gereksinimi, görüş birliği, açık kanıtlar, çelişkiler ve izlenebilir bir karar makbuzu üretir.

## Hafıza sınırı

- Yalnızca son beş sentetik karar makbuzu tarayıcıda saklanır.
- Ham belge, finans hareketi veya serbest metin saklanmaz.
- Kayıt şeması sürümlüdür ve kullanıcı tarafından temizlenebilir.

## Kabul kriterleri

- Aynı girdi aynı ajan sonucunu üretir.
- Karşı-olgusal plan orijinal üretici nesnesini değiştirmez.
- Eksik/doğrulanmamış belge olumlu kanıt sayılmaz.
- Düşük veri güvenilirliğinde insan incelemesi zorunlu görünür.
- Karar makbuzu yöntem sürümü ve girdi parmak izi taşır.
- Canlı LLM yokken tüm karar destek akışı çalışır; LLM yalnızca açıklama katmanıdır.
- Jüri üç dakika içinde problem, ajan katkısı, özgünlük, güven sınırı ve pazar değerini görebilir.

## Dış teslim kapıları

- Public GitHub repo
- Sprint kanıtları
- 3 dakikalık YouTube videosu
- Teslim formunun eksiksiz doldurulması
- Opsiyonel canlı URL

Bu dış işlemler yerel kod tamamlanması olarak gösterilmeyecektir.
