# Proje Yol Haritası (Roadmap)

Mevcut AgriScore AI sürümü, tarımsal verinin alternatif skorlama ve karar destek raporuna nasıl dönüştürülebileceğini kanıtlayan bir **Değerlendirme Sürümüdür (MVP)**. Sistemin ticari kullanıma ve geniş ölçekli canlı sisteme geçişi için planlanan teknolojik ve operasyonel yol haritası aşağıda özetlenmiştir.

*Not: Aşağıda belirtilen entegrasyonlar mevcut sürümde yoktur, gelecekte geliştirilecek "Geliştirme Alanları" olarak planlanmıştır.*

## 1. Kısa Vadeli Geliştirmeler (MVP Sonrası İlk Faz)
*   **Açık Rıza ve Veri İzni Yönetimi (KVKK):** Üreticilerin verilerinin işlenmesi için dijital onay altyapısının (e-imza / SMS onay) kurulması.
*   **Kullanıcı Yetkilendirme (Real Auth):** Mevcut demo (mock) giriş sisteminin, gerçek bir kimlik doğrulama sağlayıcısı (Keycloak, Auth0 veya banka içi SSO) ile değiştirilmesi.
*   **Dinamik Fırsat Eşleştirme API'si:** Manuel tanımlı fırsatların (Opportunities) yerine, TKDK ve KOSGEB gibi kurumların açık RSS veya duyuru panolarından veri çeken (Web Scraping / API) bir servisin kurulması.

## 2. Orta Vadeli Geliştirmeler (Entegrasyon Fazı)
*   **Gerçek Banka Entegrasyonu (Açık Bankacılık / PSD2):** Üreticilerin banka dökümlerinin, onayları dahilinde Açık Bankacılık API'leri üzerinden otomatik çekilerek `monthlyRevenue` (Aylık Gelir) doğrulamasının yapılması.
*   **Devlet Kurumları (e-Devlet) Entegrasyonu:**
    *   TÜRKVET üzerinden gerçek hayvan varlığı teyidi.
    *   Çiftçi Kayıt Sistemi (ÇKS) üzerinden arazi ve bölge teyidi.
*   **TARSİM Poliçe Doğrulama Entegrasyonu:** Poliçenin var olup olmadığının, limitlerinin ve kapsamının doğrudan sigorta havuzundan sorgulanması.
*   **OCR (Optik Karakter Tanıma) ile Belge Okuma:** Kooperatif süt döküm makbuzlarının ve yem faturalarının sisteme fotoğraf olarak yüklenip otomatik veri yapılandırmasına (Data Extraction) dönüştürülmesi.

## 3. Uzun Vadeli Geliştirmeler (Gelişmiş Analitik Fazı)
*   **Uydu ve IoT Veri Entegrasyonu:** Süt sağım robotlarından (IoT) günlük verim verisi veya tarlalardan uydu görüntüleriyle (NDVI) yem/yonca üretim rekoltesi analizi eklenerek skorlamanın güçlendirilmesi.
*   **LLM ve Vector DB Tabanlı Bellek (RAG Sistemi):** Finans uzmanlarının "Bu üreticinin son 3 yıldaki destek başvuru geçmişini ve ödeme performansını özetle" gibi doğal dil sorgularına, üreticinin kurum içi belgelerini (Vector Database'de tutulan) baz alarak halüsinasyonsuz (LLM-RAG) yanıt veren akıllı asistan altyapısının kurulması.
*   **Pilot Kurum / Kooperatif Testleri:** Modelin bir tarım kredi kooperatifi veya yerel bir banka şubesiyle A/B testine sokularak, geleneksel skorlama yöntemi ile AgriScore AI arasındaki geri dönüş (NPL) oranlarının kıyaslanması.
