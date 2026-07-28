# Delivery Notes — 28 Temmuz 2026

## Tamamlanan kritik paket

- Sahte PDF/OCR başarı fallback’leri kaldırıldı.
- ÇKS’den finansal skor çıkarımı kaldırıldı.
- Co-Pilot yerel modu gerçek hesap motoruna bağlandı.
- Backend hata ve CORS sınırları güçlendirildi.
- Skor formülü, DSCR ve taksit kapasitesi hizalandı.
- Fırsat motoru yapılandırılmış koşulları kullanıyor.
- Portföy stres testi hardcoded sonuçlardan kurtarıldı.
- Sentetik veri ve resmi kaynak snapshot’ı ayrıldı.
- Mobil navigasyon ve Co-Pilot yerleşimi düzeltildi.
- Mobil tur düğmesi ve ÇKS dosya seçici örtüşme/tıklanabilirlik sorunları düzeltildi.
- Co-Pilot risk dağılımı sorusundaki niyet eşleştirme regresyonu düzeltildi.
- Frontend/backend test altyapısı eklendi.
- Beş ajanlı Kanıt Konseyi, üç aşamalı orkestrasyon ve insan incelemesi kapısı eklendi.
- Sınırlandırılmış karşı-olgusal eylem yolu ve SHA-256 karar makbuzu eklendi.
- Son beş özetle sınırlı, kullanıcı tarafından silinebilir yerel hafıza eklendi.
- Rotalar lazy-load edildi; önceki tek büyük başlangıç paketi bölündü.

## Doğrulama

| Kontrol | Sonuç |
|---|---|
| `npm test` | 17/17 geçti |
| Python API testleri | 5/5 geçti |
| `npm run build` | Geçti |
| `npm run lint` | Geçti, uyarı yok |
| Python compile | Geçti |
| `python -m pip check` | Kırık bağımlılık yok |
| Gerçek tarayıcı | Dashboard, Co-Pilot, ÇKS, Kanıt Konseyi, makbuz/hafıza ve 390x844 mobil akış geçti; konsol temiz |

## Tamamlanmayanlar

- Public deployment bu revizyona güncellenmedi.
- Gerçek auth, rate limit ve audit log yok.
- Gerçek kurum/üretici veri entegrasyonu yok.
- Model saha verisiyle kalibre edilmedi.
- OCR motoru yok; görüntü tabanlı PDF açık hata verir.
- `npm audit` React Router RSC modu için 2 yüksek önem dereceli advisory bildiriyor; mevcut SPA RSC kullanmıyor fakat audit temiz değil.
- Public GitHub, sprint kanıtları, YouTube videosu ve teslim formu tamamlanmadı.
- Pazar kriteri için gerçek kredi uzmanı görüşmesi veya pilot kanıtı yok.

Bu maddeler release öncesi blocker veya koşullu gate olarak ele alınmalıdır; demo içinde varmış gibi gösterilmemelidir.
