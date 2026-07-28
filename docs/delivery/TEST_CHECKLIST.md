# Test Checklist

## Otomatik

- [x] Skor motoru DSCR korumalı taksit aralığı
- [x] Sıfır sürüde bölme hatası yok
- [x] Yerel Co-Pilot gerçek hesap değerini kullanıyor
- [x] Doğrulanmamış belge fırsat için kabul edilmiyor
- [x] Portföy stres testi deterministik
- [x] ÇKS metni alan çıkarıyor ama skor üretmiyor
- [x] Geçersiz PDF fake success yerine 422
- [x] OCR gerektiren PDF `TEXT_UNAVAILABLE`
- [x] Eksik canlı Co-Pilot 503 degraded state
- [x] Frontend production build
- [x] Python compile
- [x] Frontend Co-Pilot niyet ayrımı ve fırsat kural regresyonları
- [x] Python bağımlılık bütünlüğü (`pip check`)
- [x] Beş ajanlı konsey aynı girdide deterministik
- [x] Düşük veri güvenilirliği insan incelemesini zorluyor
- [x] Karşı-olgusal arama kaynak profili değiştirmiyor
- [x] SHA-256 karar makbuzu ve beş kayıtlık hafıza sınırı
- [x] Lazy route production build

## Tarayıcı

- [x] Kurumsal demo girişi ve dashboard
- [x] Resmi kaynak kartları ve kaynak URL’leri
- [ ] ÇKS geçersiz PDF hata görünümü
- [x] ÇKS metin tabanlı PDF fields-only sonucu ve “Skor üretilmedi” görünümü
- [x] Co-Pilot yerel mod etiketi ve hesap eşleşmesi
- [x] Üretici paneli 390x844 mobil menü ve yatay taşma kontrolü
- [x] Fırsat doğrulama dili ve sentetik program sınırı
- [x] Tarayıcı konsolunda error/warn yok
- [x] Kanıt Konseyi P008 orkestrasyon ve beş ajan görünümü
- [x] Karşı-olgusal yol ve insan incelemesi kapısı
- [x] SHA-256 makbuz oluşturma, geçmiş ve hafıza temizleme
- [x] Co-Pilot Kanıt Konseyi bağlamını gerçek hesap sonucu ile açıklıyor
- [x] P001 güçlü profilde gereksiz karşı-olgusal müdahale yok
- [x] Kanıt Konseyi 390x844 mobil taşma ve menü kontrolü

## Release gate

- [ ] Bu revizyon public önizlemeye dağıtıldı
- [ ] Dağıtılan asset hash’i yerel build ile eşleşti
- [ ] Gerçek auth/RBAC veya açık demo sınırı kabul edildi
- [ ] Rate limit/audit log kararı verildi
- [ ] Erişilebilirlik ve mobil cihaz testi tamamlandı
- [ ] `npm audit` temiz veya kabul edilmiş/yazılı RSC advisory risk kararı mevcut
- [ ] 3 dakikalık video gizli sekmede erişilebilir ve süre sınırında
- [ ] Public GitHub, sprint kanıtları ve başvuru formu tamamlandı
