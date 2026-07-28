# AgriScore Project Context

Son güncelleme: 28 Temmuz 2026

## Hedef ve faz

AgriScore'u gerçek bir ürün gibi çalışan, anlaşılır ve güvenilir bir tarımsal
finans karar destek uygulaması olarak güçlendirmek. Mevcut görsel yön korunacak;
ürün ekranları sade, tutarlı ve kullanıcı odaklı kalacak.

## Tamamlanan

- Mevcut renk, tipografi, kart, yerleşim ve genel görsel kimlik korundu.
- Ürün ekranlarındaki teknik sunum dili kaldırıldı; metinler gerçek kullanım
  senaryolarına göre sadeleştirildi.
- Giriş ekranındaki çalışmayan kullanıcı adı/parola görünümü kaldırıldı; iki açık
  örnek çalışma alanı bırakıldı.
- Eksik finansal bilgi artık `0` kabul edilmiyor. Kritik veri eksikse skor, risk
  ve güvenli taksit aralığı üretilmiyor; kullanıcıya veri tamamlama gereği
  gösteriliyor.
- Belge güvenilirliği ile ekonomik risk skoru ayrıştırıldı.
- ÇKS belgesi tek başına finansal skor üretmiyor.
- Fırsatlar açık biçimde örnek program olarak etiketleniyor ve resmi kaynaktan
  doğrulama gerektiriyor.
- Resmi pazar göstergeleri kaynak, dönem ve doğrulama tarihiyle gösteriliyor;
  skora doğrudan katılmıyor.
- Gizli sekmelerdeki grafik boyut uyarıları giderildi.
- Kurumsal ve üretici navigasyonu masaüstü ve mobilde sadeleştirildi.
- Değerlendirme ekranındaki kullanıcıya gösterilen yardımcı mesajı doğal ürün
  diline çevrildi.
- Yönlendirme paketi güvenlik yaması içeren 8.3.0 sürümüne geçirildi.
- Canlı dış hizmet açıkça etkinleştirilmedikçe yardımcı yalnızca çalışma
  alanındaki hesaplanabilir verileri kullanıyor ve başarısız ağ isteği üretmiyor.

## Aktif kararlar

- Gerçek kişi verisi izinsiz eklenmeyecek.
- Örnek çalışma alanı ve örnek işletme verileri açık etiketle korunacak.
- Resmi göstergeler kaynak, dönem ve doğrulama tarihiyle gösterilecek.
- ÇKS tek başına finansal skor üretmeyecek.
- Uygulama kredi onayı veya ret kararı vermeyecek; değerlendirmeyi destekleyecek.
- Mevcut tasarım yönü yeniden tasarlanmayacak; yalnızca okunabilirlik, hiyerarşi
  ve tutarlılık iyileştirilecek.
- Eksik veya doğrulanamayan veri başarılı sonuç gibi gösterilmeyecek.

## Bilinen riskler

- Çalışma alanı seçimi istemci tarafında; gerçek kimlik doğrulama değil.
- İstek sınırlama ve denetim kaydı yok.
- Üretici bazlı resmi veri entegrasyonu yok.
- Skor gerçek geri ödeme verisiyle kalibre edilmedi.
- Taranmış belge okuma yok; ÇKS akışı seçilebilir metin içeren PDF gerektiriyor.
- Yayındaki sürümün bu yerel değişiklikleri taşıdığı doğrulanmadı.
- Gerçek uzmanlarla ölçümlü kullanılabilirlik ve kalibrasyon çalışması yok.
- Canlı dış hizmet bağlantısı ve üretim ortamı doğrulanmadı.

## Son kontroller

- `npm test`: 20/20
- `python -m pytest -q`: 7/7
- `npm run build`: geçti
- `npm run lint`: geçti, uyarı yok
- `npm audit --omit=dev`: açık güvenlik uyarısı yok
- `python -m compileall -q backend api`: geçti
- `python -m pip check`: kırık bağımlılık yok
- Üretim paketi yerel önizlemede masaüstü ve 390x844 mobil görünümde açıldı.
- Landing, giriş, portföy, üretici detayı, değerlendirme, fırsatlar, ÇKS,
  risk görünümü ve rapor akışlarında yatay taşma görülmedi.
- Kontrol edilen ekranlarda konsol hatası, sayfa hatası veya başarısız istek
  görülmedi.
- P008 eksik finansal bilgilerle skor üretmedi ve `Eksik Bilgi` gösterdi.
- Kurumsal ve üretici mobil menüleri açıldı; temel rotalar görünür kaldı.
- Ulusal Süt Konseyi, TÜİK ve TKDK göstergeleri 28 Temmuz 2026 tarihinde resmi
  kaynaklardan yeniden doğrulandı.

## Sonraki adımlar

1. Gerçek kimlik doğrulama, yetkilendirme, istek sınırlama ve denetim kaydı.
2. Üretici bazlı resmi/verifiye veri bağlantıları.
3. Gerçek geri ödeme sonuçlarıyla skor kalibrasyonu ve bağımsız doğrulama.
4. Taranmış PDF belgeleri için güvenli belge okuma akışı.
5. Yayındaki sürümün aynı kaynak kod revizyonuyla uçtan uca doğrulanması.
