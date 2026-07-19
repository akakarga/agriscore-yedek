# Veri Güveni ve Güvenlik Sınırları (Data Trust & Safety)

AgriScore AI platformu, tarımsal verinin hassasiyetini ve finansal risk değerlendirme süreçlerindeki sorumluluğu temel alarak inşa edilmiştir. Bu doküman, platformun veriyi nasıl ele aldığını, KVKK prensiplerini ve karar destek sisteminin sorumluluk sınırlarını detaylandırır.

## 1. Veri Kaynakları Sınıflandırması
Sisteme entegre edilen veya analiz edilen veriler, güvenilirlik açısından üç ana sınıfa ayrılır:

*   **Resmi / Dijital Doğrulanabilir Veriler (Yüksek Güven):**
    *   TÜRKVET / ÇKS kayıtları, e-Devlet destek dokümanları, entegre banka hesap hareketleri.
    *   *Sistem Etkisi:* Veri Güvenilirliği Skorunu en üst düzeye çıkarır, Risk Skorunda doğrudan pozitif sinyal olarak işlenir.
*   **Kurumsal Onaylı Veriler (Orta-Yüksek Güven):**
    *   Süt işleme tesisi dökümleri, yem kooperatifi faturaları, TARSİM poliçe özetleri.
    *   *Sistem Etkisi:* Operasyonel sürekliliği kanıtlar, güven skorunu yükseltir.
*   **Üretici Beyanı (Düşük Güven):**
    *   Sisteme manuel girilen sağmal hayvan sayısı, elde olmayan geçmiş nakit kayıtları.
    *   *Sistem Etkisi:* Beyan üzerinden analiz yapılır ancak Veri Güvenilirliği Skoru düşük tutularak, kurum tarafındaki Risk Skoruna bir "ihtiyat payı" (discount) yansıtılır.

## 2. Veri Güvenilirliği Skoru Nasıl Yorumlanır?
Veri Güvenilirliği Skoru (Reliability Score), üreticinin sunduğu finansal ve operasyonel belgelerin güncelliğini ve sağlamlığını ölçer.
*   Bir üreticinin üretim verimi çok yüksek olabilir, ancak bunu kanıtlayan resmi/kurumsal belge yoksa Güvenilirlik Skoru düşer.
*   Bu durum bankaya şu mesajı verir: *"Bu üreticinin potansiyeli yüksek görünüyor, ancak saha ziyareti veya belge doğrulaması yapmanız gerekiyor."*
*   Sistem, eksik verinin yarattığı riski gizlemez, tam tersine **Veri Güven Merkezi** aracılığıyla şeffaflaştırır.

## 3. Demo Veriler Neden Gerçek Değildir?
*   Mevcut sistemde gösterilen isimler, skorlar, üretim rakamları, destek fırsatları ve portföy bilgileri **tamamen yarışma ve konsept gösterim amaçlı senaryolaştırılmış (seed) verilerdir**.
*   Bu sürümde gerçek bankalara, resmi devlet kurumlarına, LLM'lere veya veri tabanlarına canlı bir entegrasyon **yoktur**. Platform, gerçek entegrasyonlar yapıldığında sistemin nasıl davranacağını gösteren deterministik bir simülasyon sunar.

## 4. Gerçek Entegrasyonlar Nasıl Yapılmalıdır?
Üretim aşamasında (Production) gerçek veri akışı sağlanırken şu adımlar zorunludur:
*   e-Devlet kapısı, TKDK veya Tarım Bakanlığı API'leri üzerinden resmi izinlerle entegrasyon kurulması.
*   Banka API'leri ile nakit akışı verisinin PSD2 veya yerel Açık Bankacılık (Open Banking) standartlarında çekilmesi.
*   Elde edilen verilerin KVKK'ya uygun şifrelenmiş ortamlarda saklanması.

## 5. KVKK ve Açık Rıza
Tarımsal veri, üreticinin ekonomik sağlığını ve kapasitesini yansıtan hassas bir kişisel veridir.
*   **Açık Rıza:** Üretici, verisinin finans kurumları tarafından analiz edilmesi için açık ve şeffaf bir rıza vermek zorundadır.
*   **Hassas Veriler:** Kredi kartı borçları, TCKN, adres, aile bilgisi gibi veriler.
*   AgriScore AI prensip olarak "sadece risk skorlaması için gerekli olan veriyi" toplar ve kurumlarla paylaşır (Data Minimization).

## 6. Üretici Veri Düzeltme / İtiraz Akışı
Şeffaf bir yapay zeka modelinin ve adil veri politikasının en önemli kuralı, kullanıcının veri üzerindeki kontrolüdür.
*   Eğer bir veri (örneğin aylık süt dökümü) eksik veya hatalı görünüyorsa, üretici **Veri Düzeltme Talebi** (Data Correction Flow) oluşturabilir.
*   Bu sistem, üreticiye karşı haksız değerlendirme yapılmasını önler ve modelin adaletsizlik yaratma riskini minimize eder.

## 7. AI Karar Vermez, Karar Destek Üretir
**En Kritik Güvenlik Sınırı:** AgriScore AI bir kredi kuruluşu veya banka değildir. Algoritmalarımız "kredi onaylandı" veya "kredi reddedildi" kararı üretmez.
*   Platform, karmaşık tarım verilerini finans uzmanının hızlıca okuyabileceği bir "Risk Raporuna" dönüştürür.
*   Nihai risk alma, finansman kullandırma veya hibe onaylama yetkisi ve sorumluluğu tamamen ilgili kurumlara aittir.

## 8. Model Açıklanabilirliği (Explainability) Neden Önemlidir?
Karar destek sistemlerinde "black-box" (kapalı kutu) algoritmalar tehlikelidir. Finans kurumu, bir üreticinin skorunun neden 65 olduğunu bilmek zorundadır.
*   Bu nedenle AgriScore AI bünyesinde **Explainability Panel (Bu skor neden böyle?)** bulunur.
*   Sistem, skoru hangi faktörlerin (pozitif veya negatif) etkilediğini açıkça belirtir. Bu sayede hem yanlış yorumlama riski azalır hem de veri kalitesinden doğan sorunlar izole edilir.
