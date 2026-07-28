# AgriScore AI Release Notes

## 2.0.0 — 28 Temmuz 2026 — Yerel aday

Durum: `COMPLETE BUT PARTIALLY UNVERIFIED`

Bu sürüm yerelde test edildi; mevcut public Vercel önizlemesine henüz bu çalışma kapsamında dağıtılmadı.

### Kritik düzeltmeler

- PDF/ÇKS hata durumlarında uydurma başarılı sonuçlar kaldırıldı.
- Görüntü tabanlı PDF için sahte OCR kaldırıldı; dürüst `TEXT_UNAVAILABLE` durumu eklendi.
- ÇKS belgesinden hayvan/arazi ölçeğine bakarak kredi skoru üretme kaldırıldı.
- Co-Pilot çevrimdışı modu gerçek `rules-v2.0` hesaplarını kullanacak şekilde değiştirildi.
- Groq hata ayrıntılarının kullanıcıya sızması önlendi.
- CORS wildcard kaldırıldı; izinli origin listesi ortam değişkenine bağlandı.
- Frontend/backend skor formülü ve yeni taksit kapasitesi eşlendi.
- Fırsat motoru yapılandırılmış uygunluk kurallarını ve yalnızca doğrulanmış belgeleri kullanıyor.
- Hardcoded portföy şok sonuçları gerçek deterministik yeniden hesaplamayla değiştirildi.
- Mobil sidebar ve Co-Pilot yerleşimi düzeltildi.
- Mobil tur düğmesinin içerik örtmesi ve ÇKS dosya seçicinin tıklanabilirliği düzeltildi.
- Co-Pilot “risk dağılımı” ve “inceleme önceliği” niyetleri ayrıştırıldı.
- Runtime’da kullanılmayan rastgele sentetik Random Forest eğitim dosyası ve route-dışı kırık AI parser ekranı kaldırıldı.
- Beş kanıt-bağımlı ajan ve üç aşamalı orkestrasyon içeren `council-v1.0` Kanıt Konseyi eklendi.
- Görüş ayrılıkları, inceleme önceliği ve insan karar kapısı görünür hale getirildi.
- Değiştirilemez alanları koruyan sınırlandırılmış karşı-olgusal eylem araması eklendi.
- SHA-256 girdi parmak izli karar makbuzu ve son beş özetle sınırlı yerel hafıza eklendi.
- Kanıt Konseyi dashboard, üretici detayı, Co-Pilot, navigasyon ve ürün turuna bağlandı.
- Rotalar lazy-load edildi; önceki yaklaşık 874 kB tek ana paket yerine en büyük başlangıç JS paketi yaklaşık 390 kB oldu.

### Veri ve ürün güveni

- Sentetik üretici profilleri tüm panellerde açıkça etiketlendi.
- USK, TÜİK ve TKDK için kaynak/tarih damgalı resmi bağlam kartı eklendi.
- Resmi bağlamın üretici skorunu otomatik değiştirmediği görünür hale getirildi.

### Doğrulama

- `npm test`: 17/17
- `python -m unittest discover -s tests -v`: 5/5
- `npm run build`: geçti
- `npm run lint`: geçti; uyarı yok
- `python -m compileall -q backend api`: geçti
- `python -m pip check`: kırık bağımlılık yok
- Gerçek tarayıcı: kurumsal giriş/dashboard, yerel Co-Pilot, ÇKS PDF ve 390x844 mobil menü geçti
- Gerçek tarayıcı: P008 beş ajan/üç aşama, 54→81 karşı-olgusal yol, SHA-256 makbuz, Co-Pilot ve hafıza temizleme geçti
- Gerçek tarayıcı: P001 güçlü profilde gereksiz müdahale üretilmedi; Kanıt Konseyi 390x844 görünümde taşmadı
- Tarayıcı konsolunda hata/uyarı yok

### Açık release riskleri

- Gerçek auth/RBAC yok; demo session client-side.
- API rate limit ve kalıcı audit log yok.
- Üretici bazlı resmi/banka entegrasyonu yok.
- Skor modeli gerçek geri ödeme etiketiyle kalibre edilmedi.
- Public önizleme bu revizyonla yeniden dağıtılmadı.
- Pazar kriteri için gerçek kredi uzmanı görüşmesi veya pilot kanıtı yok.
- Public GitHub, sprint kanıtları, 3 dakikalık YouTube videosu ve teslim formu bu çalışmada tamamlanmadı.
- Yerel ortamda `GROQ_API_KEY` yok; canlı LLM modu doğrulanmadı, deterministik Co-Pilot çalışıyor.
- `npm audit`, bu SPA’nın kullanmadığı React Router RSC modu için 2 yüksek önem dereceli advisory bildiriyor; audit temiz değil ve önerilen zorunlu downgrade daha fazla advisory oluşturduğu için uygulanmadı.
