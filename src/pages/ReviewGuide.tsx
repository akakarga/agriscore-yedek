import { Link } from 'react-router';
import { ArrowRight, Brain, BrainCircuit, Fingerprint, GitBranch, Sprout, ShieldCheck, Activity } from 'lucide-react';

const ReviewGuide = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Hero Section */}
      <div className="bg-fin-900 text-white pt-20 pb-24 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Tarımsal Finansmanda <span className="text-agri-400">Net Bir Görünüm</span>
        </h1>
        <p className="text-xl md:text-2xl text-fin-100 max-w-3xl mx-auto mb-10 font-light">
          AgriScore, üretim kayıtlarıyla finansal görünümü aynı dosyada buluşturur.
          Kurumların daha anlaşılır, üreticilerin daha hazırlıklı ilerlemesine yardımcı olur.
        </p>
        <Link 
          to="/login" 
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg bg-agri-600 hover:bg-agri-500 text-white transition-all shadow-lg hover:shadow-xl"
        >
          Platformu Kullanmaya Başla <ArrowRight className="ml-2 h-5 w-5" />
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
            <h2 className="text-2xl font-bold text-agri-700 mb-4 border-b border-slate-100 pb-4">Çözüm: AgriScore</h2>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-start">
                <span className="bg-agri-100 text-agri-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-sm">✓</span>
                <span>Üretim, nakit akışı, sürü ve belge durumunu 0-100 arası anlaşılır bir risk görünümünde toplar.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-agri-100 text-agri-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-sm">✓</span>
                <span>Nihai kararı vermez; hangi verinin sonucu nasıl etkilediğini açıkça gösterir.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-agri-100 text-agri-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-sm">✓</span>
                <span>Süt geliri veya yem gideri değiştiğinde işletmenin dayanıklılığını karşılaştırır.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Pillars */}
        <h2 className="text-3xl font-bold text-center text-fin-900 mb-12">Üç Temel Görünüm</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <Activity className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-fin-900 mb-3">Risk Görünümü</h3>
            <p className="text-slate-600 text-sm">
              Üretim istikrarı, nakit akışı, sürü gücü ve borç yükünü tek bir anlaşılır özette birleştirir.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-fin-900 mb-3">Dosya Özeti</h3>
            <p className="text-slate-600 text-sm">
              Finansal ve tarımsal kayıtları kısa, sade ve eyleme dönük bir açıklamaya dönüştürür.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-fin-900 mb-3">Veri Güvenilirliği</h3>
            <p className="text-slate-600 text-sm">
              Eksik veya doğrulanmamış kayıtları görünür tutar ve güvenilirlik seviyesini açıkça gösterir.
            </p>
          </div>

        </div>

        <div className="bg-gradient-to-br from-fin-900 to-slate-900 text-white rounded-2xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <BrainCircuit className="absolute -right-8 -bottom-10 w-64 h-64 text-white/5" />
          <div className="relative z-10">
            <div className="text-xs font-bold text-agri-400 uppercase tracking-widest">
              Risk ve Analiz
            </div>
            <h2 className="text-3xl font-extrabold mt-2">
              Tek dosya, beş net değerlendirme alanı
            </h2>
            <p className="text-fin-100 mt-4 max-w-3xl leading-relaxed">
              Belge güveni, finansal görünüm, dayanıklılık, destek hazırlığı ve
              sonraki adımlar aynı işletme dosyasında birlikte değerlendirilir.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="rounded-xl bg-white/10 border border-white/10 p-5">
                <BrainCircuit className="w-6 h-6 text-agri-400 mb-3" />
                <h3 className="font-bold">5 Değerlendirme Alanı</h3>
                <p className="text-sm text-fin-200 mt-2">
                  Her alan kendi bulgularını, dayanaklarını ve uyarılarını ayrı gösterir.
                </p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-5">
                <GitBranch className="w-6 h-6 text-agri-400 mb-3" />
                <h3 className="font-bold">İyileştirme Yolu</h3>
                <p className="text-sm text-fin-200 mt-2">
                  Hedef riske ulaşmak için pratik ve doğrulanabilir adımları önerir.
                </p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-5">
                <Fingerprint className="w-6 h-6 text-agri-400 mb-3" />
                <h3 className="font-bold">Kayıtlı Özet</h3>
                <p className="text-sm text-fin-200 mt-2">
                  Son değerlendirmeleri aynı işletme için karşılaştırmayı kolaylaştırır.
                </p>
              </div>
            </div>

            {/* Step-by-step How AgriScore Works details */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold text-agri-300 mb-4">Platfomun Temel Araçları Nasıl Çalışır?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-xs font-bold text-agri-400 uppercase">1. Stres Testi Simülatörü</div>
                  <p className="text-xs text-fin-100 mt-1 leading-relaxed">
                    Yem fiyat artışı (+%20) veya süt verim düşüşü (%15) senaryolarında işletmenin kredi taksit ödeme gücünü anında test eder.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-xs font-bold text-agri-400 uppercase">2. Üretici Skor Rehberi</div>
                  <p className="text-xs text-fin-100 mt-1 leading-relaxed">
                    Çiftçiye skorunu yükseltecek 3 somut eylem sunar: ÇKS yenileme (+10), Süt makbuzu ekleme (+8) ve TARSİM sigortası (+7).
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-xs font-bold text-agri-400 uppercase">3. Çapraz Doğrulama Rozetleri</div>
                  <p className="text-xs text-fin-100 mt-1 leading-relaxed">
                    ÇKS belgelerini E-Devlet Karekod, Tapu Kadastro Parsel ve TÜRKVET hayvan varlığı kayıtlarıyla eşleştirerek onaylar.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-xs font-bold text-agri-400 uppercase">4. Mevsimsel Akış & Komite Raporu</div>
                  <p className="text-xs text-fin-100 mt-1 leading-relaxed">
                    12 aylık süt geliri ve yem gideri dengesini haritalandırır; tek tıkla resmi Kredi Komitesi onay raporu üretir.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/login"
              className="mt-8 inline-flex items-center rounded-lg bg-agri-500 hover:bg-agri-400 text-fin-900 px-5 py-3 font-bold"
            >
              Kurumsal Çalışma Alanını Aç
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Why Safe? */}
        <div className="bg-slate-900 text-white rounded-2xl p-10 md:p-14 relative overflow-hidden">
           <Sprout className="absolute -right-10 -bottom-10 h-64 w-64 text-slate-800 opacity-50" />
           <div className="relative z-10 max-w-2xl">
             <h2 className="text-3xl font-bold mb-6">Neden Güvenilir Bir Değerlendirme Sunar?</h2>
             <ul className="space-y-4">
               <li className="flex items-start">
                 <span className="mr-3 text-agri-400">➔</span>
                 <p><strong>Karar Vermez, Destekler:</strong> Kredi onayı üretmez. Mevcut durumu, olası değişimleri ve eksikleri görünür kılar.</p>
               </li>
               <li className="flex items-start">
                 <span className="mr-3 text-agri-400">➔</span>
                 <p><strong>Açık Gerekçeler:</strong> Skoru güçlendiren ve zayıflatan kayıtlar kullanıcıya doğrudan gösterilir.</p>
               </li>
               <li className="flex items-start">
                 <span className="mr-3 text-agri-400">➔</span>
                 <p><strong>Değişen Koşullar:</strong> Süt geliri düşerse veya yem gideri artarsa ödeme gücünün nasıl etkileneceği görülür.</p>
               </li>
             </ul>
           </div>
        </div>

        {/* Data coverage */}
        <div className="bg-white border border-slate-200 rounded-2xl p-10 md:p-14 mt-12 shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-fin-900 border-b border-slate-100 pb-4">Veri Kapsamı ve Sınırlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600">
            <div>
              <h3 className="text-xl font-semibold text-agri-700 mb-3">Neleri Birlikte Değerlendirir?</h3>
              <p className="mb-4">
                Süt üretimi, nakit akışı, sürü varlığı, borç bilgisi ve belge
                durumunu aynı işletme dosyasında bir araya getirir.
              </p>
              <h3 className="text-xl font-semibold text-agri-700 mb-3">Neleri Kesinleştirmez?</h3>
              <p>
                Kredi onayı, resmi destek uygunluğu veya saha doğrulaması yerine
                geçmez. Eksik bilgiler tamamlanmadan olumlu sonuç varsaymaz.
              </p>
            </div>
            <div>
              <div className="bg-fin-50 p-6 rounded-xl border border-fin-100">
                <h3 className="text-lg font-semibold text-fin-900 mb-2 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2 text-agri-600" />
                  Örnek Çalışma Alanı
                </h3>
                <p className="text-sm mb-3">
                  Bu sürümdeki işletme, finansman ve destek programı kayıtları örnek amaçlıdır.
                </p>
                <p className="text-sm">
                  Gerçek kullanımda bilgiler yetkili kaynaklardan doğrulanmalı ve güncel tutulmalıdır.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-slate-200 py-12 text-center">
        <h2 className="text-2xl font-bold text-fin-900 mb-6">Platformu Deneyimlemeye Hazır mısınız?</h2>
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
