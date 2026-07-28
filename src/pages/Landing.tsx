import { Link } from 'react-router';
import { Wheat, ShieldCheck, TrendingUp, ClipboardCheck, Presentation } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Wheat className="h-8 w-8 text-agri-600 mr-2" />
          <span className="text-2xl font-bold text-fin-900">AgriScore</span>
        </Link>
        <div className="space-x-4">
          <Link to="/review-guide" className="text-fin-700 hover:text-agri-600 font-medium transition-colors mr-4">
            Nasıl Çalışır?
          </Link>
          <Link to="/login" className="bg-agri-600 hover:bg-agri-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
            Giriş Yap
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-fin-900 max-w-4xl tracking-tight mb-6">
          Tarım ve Hayvancılık Finansmanında <br className="hidden md:block"/> 
          <span className="text-agri-600">Net ve Güvenilir Bir Görünüm</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Geleneksel kredi skoru, sahadaki üretim gerçeğini tek başına göstermez.
          AgriScore; üretim ve nakit akışı kayıtlarını birlikte değerlendirerek
          riskleri ve fırsatları anlaşılır bir rapor halinde sunar.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/login" className="bg-fin-900 hover:bg-fin-800 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg">
            Platformu İncele
          </Link>
          <Link to="/review-guide" className="bg-white border border-fin-200 hover:bg-fin-50 text-fin-900 px-8 py-3 rounded-lg text-lg font-medium transition-colors flex items-center justify-center">
            <Presentation className="w-5 h-5 mr-2" />
            AgriScore’u Tanıyın
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500 flex items-center">
          <ShieldCheck className="h-4 w-4 mr-1 text-agri-600"/>
          Akıllı Tarım Finansmanı ve Risk Değerlendirme Platformu
        </p>
      </section>

      {/* Features */}
      <section className="bg-white py-20 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="text-center">
            <div className="w-16 h-16 bg-agri-50 text-agri-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-fin-900 mb-3">Gelecek Verim Tahmini</h3>
            <p className="text-slate-600 leading-relaxed">
              Geçmiş süt üretim verilerinden ve sürü büyüklüğünden hareketle önümüzdeki aylar için tahmini üretim hacmi ve nakit akışı öngörüsü.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ClipboardCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-fin-900 mb-3">Bütüncül Dosya Değerlendirmesi</h3>
            <p className="text-slate-600 leading-relaxed">
              Belge durumu, finansal görünüm, değişen koşullara dayanıklılık ve
              destek hazırlığını tek bir anlaşılır akışta birleştirir.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-fin-900 mb-3">Açıklanabilir Risk Skoru</h3>
            <p className="text-slate-600 leading-relaxed">
              0-100 arası risk skorunun bileşenlerini, olumlu ve olumsuz sinyalleri
              şeffaf ve net bir şekilde açıklar.
            </p>
          </div>

        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-fin-900 py-8 text-center border-t border-fin-800">
        <p className="text-slate-400">
          © 2026 AgriScore. Tüm hakları saklıdır.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
