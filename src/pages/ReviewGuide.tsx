import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Sprout, ShieldCheck, Activity } from 'lucide-react';

const ReviewGuide = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Hero Section */}
      <div className="bg-fin-900 text-white pt-20 pb-24 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Tarım Finansmanında <span className="text-agri-400">Yapay Zeka</span> Dönemi
        </h1>
        <p className="text-xl md:text-2xl text-fin-100 max-w-3xl mx-auto mb-10 font-light">
          AgriScore AI; bankalar ve üreticiler arasında şeffaf, veri odaklı ve güvenilir bir köprü kurar. 
          Kredi değerlendirme sürecinde üretim ve nakit akışı sinyallerini görünür hale getirir.
        </p>
        <Link 
          to="/login" 
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg bg-agri-600 hover:bg-agri-500 text-white transition-all shadow-lg hover:shadow-xl"
        >
          İnceleme Moduna Geç <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-16 px-6">
        
        {/* Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-fin-900 mb-4 border-b border-slate-100 pb-4">Problem</h2>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-start">
                <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-sm">1</span>
                <span>Bankalar tarımsal veriyi (süt verimi, sürü sağlığı, dönemsellik) finansal dile çevirmekte zorlanıyor.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-sm">2</span>
                <span>Üreticiler finansal başvuru süreçlerinde gerekli belge ve veri bütünlüğünü sağlamakta zorlanabiliyor.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-sm">3</span>
                <span>Veri eksikliği ve güven problemi nedeniyle kredi süreçleri çok yavaş işliyor.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-agri-100 rounded-bl-full -z-10 opacity-50"></div>
            <h2 className="text-2xl font-bold text-agri-700 mb-4 border-b border-slate-100 pb-4">Çözüm: AgriScore AI</h2>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-start">
                <span className="bg-agri-100 text-agri-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-sm">✓</span>
                <span>Tarımsal veriyi alır, deterministik finansal modellere ve 0-100 arası standart bir risk skoruna çevirir.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-agri-100 text-agri-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-sm">✓</span>
                <span>"Nihai Karar Verici" değil, "Açıklanabilir Karar Destekçisi" olarak çalışır.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-agri-100 text-agri-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-sm">✓</span>
                <span>Senaryo analizleri ile olası piyasa şoklarında üreticinin dayanıklılığını test eder.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Pillars */}
        <h2 className="text-3xl font-bold text-center text-fin-900 mb-12">Sistemin Üç Ana Sütunu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <Activity className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-fin-900 mb-3">Deterministik Skorlama</h3>
            <p className="text-slate-600 text-sm">
              Süt üretim istikrarı, nakit akışı, sürü gücü ve borç yükünü analiz ederek şeffaf, açıklanabilir bir risk skoru üretir.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-fin-900 mb-3">AI Risk Ajanı</h3>
            <p className="text-slate-600 text-sm">
              Karmaşık finansal ve tarımsal veriyi, bankacının 30 saniyede anlayabileceği doğal dilde risk özetlerine dönüştürür.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-fin-900 mb-3">Veri Güvenilirliği</h3>
            <p className="text-slate-600 text-sm">
              Eksik veya doğrulanmamış veri tespit edildiğinde skoru baskılar ve güvenilirlik yüzdesini şeffafça gösterir.
            </p>
          </div>

        </div>

        {/* Why Safe? */}
        <div className="bg-slate-900 text-white rounded-2xl p-10 md:p-14 relative overflow-hidden">
           <Sprout className="absolute -right-10 -bottom-10 h-64 w-64 text-slate-800 opacity-50" />
           <div className="relative z-10 max-w-2xl">
             <h2 className="text-3xl font-bold mb-6">Neden Finansal Açıdan Güvenli?</h2>
             <ul className="space-y-4">
               <li className="flex items-start">
                 <span className="mr-3 text-agri-400">➔</span>
                 <p><strong>Karar Vermez, Destekler:</strong> "Kredi ver" demez. Mevcut durumu analiz eder, senaryolarla test eder ve bankacının önüne net veri koyar.</p>
               </li>
               <li className="flex items-start">
                 <span className="mr-3 text-agri-400">➔</span>
                 <p><strong>Açıklanabilirlik (XAI):</strong> Skorun neden düştüğü veya yükseldiği, şeffaf matematiksel modellerle gösterilir. Kara kutu (black-box) değildir.</p>
               </li>
               <li className="flex items-start">
                 <span className="mr-3 text-agri-400">➔</span>
                 <p><strong>Stres Testi (Senaryolar):</strong> Süt fiyatı düşerse veya yem maliyeti artarsa üreticinin borç ödeme kapasitesinin (DSCR) nasıl etkileneceği anında görülür.</p>
               </li>
             </ul>
           </div>
        </div>

        {/* Araştırma ve Pazar Dayanağı */}
        <div className="bg-white border border-slate-200 rounded-2xl p-10 md:p-14 mt-12 shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-fin-900 border-b border-slate-100 pb-4">Araştırma ve Pazar Dayanağı</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600">
            <div>
              <h3 className="text-xl font-semibold text-agri-700 mb-3">Hangi Probleme Dayanıyor?</h3>
              <p className="mb-4">
                Süt üreticilerinin üretim istikrarı, geleneksel kredi skorlama modellerinde eksik temsil edilir. Bu platform, <strong>alternatif veri (üretim hacmi, nakit akışı, sürü varlığı)</strong> kullanarak bu boşluğu doldurmayı ve finans kurumlarının değerlendirme sürecinde üretim sinyallerini görünür hale getirmeyi amaçlar.
              </p>
              <h3 className="text-xl font-semibold text-agri-700 mb-3">Hangi Kaynaklardan İlham Aldı?</h3>
              <p>
                TÜİK üretim istatistikleri, FAO/World Bank küçük üretici dijital skorlama yaklaşımları ve TARSİM risk değerlendirme mantığı gibi resmi ve akademik kaynakların felsefesi temel alınmıştır.
              </p>
            </div>
            <div>
              <div className="bg-fin-50 p-6 rounded-xl border border-fin-100">
                <h3 className="text-lg font-semibold text-fin-900 mb-2 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2 text-agri-600" />
                  Önemli Yarışma Notu
                </h3>
                <p className="text-sm mb-3">
                  Mevcut demo sürümündeki üretici verileri, üretim hacimleri ve banka skorları tamamen senaryolaştırılmıştır.
                </p>
                <p className="text-sm">
                  Gerçek üretim sürümünde, entegrasyonlar ve destek uygunluk durumlarının resmi kaynaklardan doğrulanması gerekmektedir. Detaylar için projedeki <strong>MARKET_RESEARCH.md</strong> ve <strong>COMPETITOR_ANALYSIS.md</strong> dokümanlarını inceleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-slate-200 py-12 text-center">
        <h2 className="text-2xl font-bold text-fin-900 mb-6">İncelemeye Hazır mısınız?</h2>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/login" 
            className="px-6 py-3 bg-fin-900 hover:bg-fin-800 text-white font-medium rounded-lg transition-colors flex items-center"
          >
            Giriş Yap
          </Link>
          <Link 
            to="/" 
            className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ReviewGuide;
