# AgriScore — 3 Dakikalık Jüri Demo Senaryosu

Hedef süre: 02:50-02:58  
Ana profil: `P008 — Hasan Erdoğan`  
Ana rota: `/institution/decision-room/P008`

## 00:00-00:20 — Problem

**Söyle:**

> Tarımsal kredi dosyalarında üretim, nakit akışı ve resmi belgeler farklı yerlerde duruyor. Uzman yalnızca bir skor değil, hangi kanıtın eksik olduğunu, işletmenin şoka dayanıp dayanmadığını ve hangi adımın sonucu değiştireceğini bilmek istiyor. AgriScore bu dosyayı açıklanabilir bir uzman inceleme paketine dönüştürüyor; kredi kararı vermiyor.

**Göster:** Kurumsal dashboard’daki üç adımlı jüri akışı ve `SYNTHETIC_SCENARIO_DATA` etiketi.

## 00:20-00:42 — Veri güveni

**Söyle:**

> Kişisel veya uydurma gerçek veri kullanmıyoruz. Sekiz üretici açıkça sentetik senaryo; USK, TÜİK ve TKDK bağlamı ise kaynak ve tarih damgasıyla ayrı. Resmi makro veri tek bir üreticinin skorunu gizlice değiştirmiyor.

**Göster:** Resmi kaynak kartları ve Kanıt Konseyi bağlantısı.

## 00:42-01:22 — Beş ajan ve orkestrasyon

**Söyle:**

> P008 dosyasında Kanıt Ajanı önce veri güvenilirliği kapısını çalıştırıyor. Ardından Risk, Dayanıklılık ve Destek ajanları aynı kanıt bağlamını bağımsız inceliyor. Son aşamada Karşı-Olgusal Planlayıcı yalnızca doğrulanabilir ve değiştirilebilir alanları tarıyor. Burada beş ajan, üç orkestrasyon aşaması ve her ajan için yöntem, kanıt, güven ve sınırlama görüyoruz.

**Göster:** Orkestrasyon izi, beş ajan kartı ve “Uzman gerekli” durumları.

## 01:22-01:48 — Çelişki ve insan kapısı

**Söyle:**

> Sistem ajanları yapay bir uzlaşmaya zorlamıyor. Baz skor ile veri kalitesi veya stres sonucu çelişirse bunu görünür kılıyor ve insan incelemesini bloke edilemez bir kapı olarak tutuyor. Bu nedenle çıktı onay/ret değil; inceleme önceliği ve kanıtlı gerekçe.

**Göster:** Görüş ayrılıkları, konsensüs metni ve insan incelemesi durumu.

## 01:48-02:16 — Eyleme dönük karşı-olgusal yol

**Söyle:**

> Özgün katmanımız yalnızca “riskli” demiyor. Kimlik, konum ve sürü gibi değiştirilemez alanlara dokunmadan; belge doğrulama, gider verimliliği ve ancak kurum onaylı borç yapılandırması seçenekleri içinde hedef banda götüren en düşük maliyetli senaryoyu arıyor. Varsayımlar açık; bu bir kredi önerisi değil.

**Göster:** Önce/sonra skor, güvenilirlik ve eylem varsayımları.

## 02:16-02:34 — İzlenebilir karar makbuzu ve hafıza

**Söyle:**

> Tek tuşla yöntemi, orkestrasyon sürümünü ve girdinin SHA-256 parmak izini taşıyan karar makbuzu üretiyoruz. Yalnızca son beş özet kayıt tarayıcıda tutuluyor; ham belge ve serbest metin saklanmıyor, kullanıcı hafızayı silebiliyor.

**Göster:** “Konseyi Çalıştır ve Makbuz Üret”, makbuz ve sınırlı hafıza.

## 02:34-02:48 — Dürüst AI sınırı

**Söyle:**

> LLM varsa sonucu doğal dille açıklıyor; yoksa bütün karar destek akışı deterministik olarak çalışıyor. ÇKS PDF yalnızca alan çıkarıyor, skor üretmiyor; görüntü PDF’inde OCR varmış gibi davranmıyor.

**Göster:** Co-Pilot açıklaması veya ÇKS güven sınırı.

## 02:48-02:58 — Kapanış

**Söyle:**

> AgriScore’un farkı daha çok özellik değil: her sayıyı kaynağa, her AI görüşünü yönteme ve her sonraki adımı doğrulanabilir kanıta bağlıyoruz. Hedefimiz kredi uzmanının daha hızlı değil, daha izlenebilir ve daha güvenli karar hazırlaması.

## Video çekim kuralları

- Fareyi gereksiz dolaştırma; tek rota kullan.
- Bir ekranda iki saniyeden az kalma.
- “Gerçek entegrasyon”, “kredi kararı” veya model doğruluğu iddiası kullanma.
- Ağ/LLM başarısına bağımlı olma; yerel deterministik Co-Pilot hazır olsun.
- Çekimden önce tarayıcı hafızasını temizle ve P008’e dön.
- 03:00’ı aşan açıklamayı kes; jüri kriterlerini ek özellik listesiyle boğma.
