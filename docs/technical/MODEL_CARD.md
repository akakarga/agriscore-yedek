# AgriScore rules-v2.0 Model Kartı

AgriScore AI bünyesinde çalışan risk, veri güvenilirliği ve fırsat uygunluğu motorlarının (algoritmalarının) şeffaflık, sınır ve kullanım amacını açıklayan model kartıdır.

## 1. Modelin Amacı
AgriScore Motoru, süt ve hayvancılık üreticilerinin mevcut finansal, operasyonel ve sürü verilerini analiz ederek, finans kurumları için **açıklanabilir bir karar destek sinyali** üretmeyi amaçlar. Sistem kredi kararı vermez.

## 2. Model Çıktıları
*   **AgriScore Risk Score (0-100):** Üreticinin genel ödeme kapasitesi ve üretim direncini gösteren ana gösterge.
*   **Veri Güvenilirliği Skoru (0-100):** Üreticinin beyan ettiği verilerin belgelere/resmi kaynaklara dayanma oranını gösteren güven filtresi.
*   **Gelecek Verim Projeksiyonu (Trend Analizi):** Önümüzdeki 6 ay için kural tabanlı süt üretimi senaryosu (litre); kalibre edilmiş ML tahmini değildir.
*   **Fırsat Uygunluk Skoru (0-100):** Üretici profilinin belirli bir devlet desteği/hibe şartnamesine olan teorik uygunluk derecesi.

## 3. Üretilmeyen Çıktılar (Anti-Use Cases)
*   Otomatik Kredi Onay/Ret kararı.
*   Kesin hibe hak kazanım bildirimi.
*   Kesin veya garantili üretim hacmi garantisi.
*   Canlı hayvan sağlık teşhisi.

## 4. Kullanılan Veri Kategorileri
Model deterministik bir kural motoru (rule-based engine) ve zaman serisi (time-series) trend ağırlıklandırmasıyla çalışır. Girdiler:
*   **Sürü Varlığı:** Sağmal, kurudaki, gebe ve genç hayvan sayıları.
*   **Nakit Akışı:** Aylık süt döküm gelirleri, yem ve veterinerlik giderleri, mevcut borç ödemeleri.
*   **Operasyonel İstikrar:** Geçmiş aylardaki verim standart sapması.
*   **Veri Kaynakları:** Belge türleri (Sürü Kayıt Örneği, Süt Faturası, TARSİM Poliçesi vb.).

## 5. Kullanılmayan Veri Kategorileri
*   Kişisel sağlık verileri.
*   Irk, etnik köken veya cinsiyet bilgisi.
*   Tarımsal üretimle ilgisi olmayan kişisel harcama dökümleri.

## 6. Veri Güvenilirliğinin Etkisi (Discount Factor)
Modelin en güçlü özelliği "ihtiyat" (discount) mekanizmasıdır. Eğer bir üreticinin üretim verileri iyi olsa da belgeleri eksikse, sistem **AgriScore Risk Skorunu düşürür**.
*   *Eksik veri durumunda davranış:* Güvenilirlik `%50` altındaysa toplam skor `0,60`, `%80` altındaysa `0,90` ile çarpılır; aksi halde güvenilirlik cezası uygulanmaz.
*   Böylece sahte beyanlarla yüksek kredi skoru elde edilmesi zorlaştırılır.

## 7. Fırsat Uygunluk ve Tahmin Sınırları
*   **Projeksiyon sınırı:** Gelecek verim çıktısı son dönem trendi, sürü oranı ve deterministik mevsim katsayılarından üretilir. İstatistiksel güven aralığı veya doğruluk yüzdesi değildir; salgın ve iklim şokları kapsam dışıdır.
*   **Fırsat uygunluğu:** İşletme tipi, bölge, yalnızca doğrulanmış belgeler, DSCR, risk seviyesi, veri güvenilirliği, yem/gelir oranı ve hariç tutulan risk terimleri gibi yapılandırılmış kuralları değerlendirir. Program kayıtları sentetik senaryodur; resmi uygunluk veya hak kazanımı göstermez.

## 8. İnsan ve Kurum Denetimi Gerekliliği (Human-in-the-loop)
AgriScore AI hiçbir zaman tamamen otonom karar alacak şekilde kurgulanmamıştır.
*   Sistem bir **Analiz Raporu** ve **Uyarı Sinyalleri** listesi üretir.
*   Kurum yetkilisi (Risk analizcisi veya Kredi komitesi) bu şeffaf raporu (Nakit Akışı Gücü, DSCR vs.) inceler ve kendi bankacılık sistemindeki diğer verilerle birleştirerek **nihai kararı insan inisiyatifi ile** verir.
*   Olası hatalı sinyallerde veya itirazlarda, kurumun "Veri Düzeltme" (Data Correction) süreci üzerinden üreticiyi dinlemesi önerilir.
