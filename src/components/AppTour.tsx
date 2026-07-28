import { useState } from 'react';
import { Joyride } from 'react-joyride';
import type { Step } from 'react-joyride';
import { HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router';

const AppTour = () => {
  const [run, setRun] = useState(false);
  const location = useLocation();

  const isInstitution = location.pathname.includes('/institution');
  const isProducer = location.pathname.includes('/producer');
  
  const steps: Step[] = [
    {
      target: 'body',
      content: 'AgriScore’a hoş geldiniz. Çalışma alanlarını kısaca birlikte inceleyelim.',
      placement: 'center',
    },
    // Institution Sidebar
    ...(isInstitution ? [
      {
        target: '.tour-menu-dashboard',
        content: 'Portföy Özeti: Risk dağılımını, değişen koşulları ve genel finansal durumu tek bakışta gösterir.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-producers',
        content: 'Üreticiler: Çalışma alanındaki işletmeleri listeler. Her üreticinin finansal ve tarımsal ayrıntılarına buradan ulaşabilirsiniz.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-decision-room',
        content: 'Risk ve Analiz: Belge durumu, finansal görünüm, değişen koşullara dayanıklılık ve sonraki adımları birlikte gösterir.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-opportunities',
        content: 'Fırsatlar: Üreticilerin verilerine göre onlara uygun devlet destekleri ve finansal fırsatları eşleştirir.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-cks-analiz',
        content: 'ÇKS Belgesi: Uygun PDF belgelerindeki temel kayıt alanlarını çıkarır. Belge tek başına finansal değerlendirme oluşturmaz.',
        placement: 'auto',
      }
    ] as Step[] : []),
    
    // Institution Dashboard Content (scrolls down)
    ...(location.pathname === '/institution/dashboard' || location.pathname === '/institution' ? [
      {
        target: '.tour-kpi-cards',
        content: 'Burada kurumunuzun anlık kredi taleplerini, ortalama veri güvenilirliğini ve güncel üretici istatistiklerini izleyebilirsiniz.',
        placement: 'bottom',
      },
      {
        target: '.tour-risk-chart',
        content: 'Risk Dağılımı: Portföyünüzdeki üreticilerin risk seviyelerine göre nasıl dağıldığını anında analiz edin.',
        placement: 'right',
      },
      {
        target: '.tour-simulation',
        content: 'Değerlendirme Simülasyonu: Skor eşiğini değiştirerek hangi profillerin inceleme listesine gireceğini simüle edin.',
        placement: 'top',
      }
    ] as Step[] : []),

    ...(location.pathname.startsWith('/institution/decision-room') ? [
      {
        target: '.tour-decision-room',
        content: 'Risk ve Analiz ekranı kredi kararı vermez. Dosyayı beş anlaşılır başlıkta toplar ve incelemeyi kolaylaştırır.',
        placement: 'bottom',
      },
      {
        target: '.tour-council-agents',
        content: 'Her değerlendirme alanı kendi bulgularını, dayanaklarını ve uyarılarını ayrı gösterir.',
        placement: 'top',
      },
      {
        target: '.tour-counterfactual',
        content: 'Sonraki adımlar bölümü, işletme dosyasını güçlendirecek doğrulanabilir işleri sıralar.',
        placement: 'top',
      },
    ] as Step[] : []),

    // Producer Sidebar
    ...(isProducer ? [
      {
        target: '.tour-menu-home',
        content: 'Ana Sayfa: Genel finansal ve üretim durumunuzun özetini burada bulabilirsiniz.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-production',
        content: 'Üretim: Tarla ve mahsul verilerinizi görebilir, üretim performansınızı değerlendirebilirsiniz.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-finance',
        content: 'Finansman: Kredi kullanımlarınızı, geri ödemelerinizi ve genel finansal sağlığınızı takip edebilirsiniz.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-documents',
        content: 'Belgeler: Çalışma alanına eklenen belgeleri ve durumlarını buradan görebilirsiniz.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-opportunities',
        content: 'Fırsatlar: Size özel devlet destekleri ve finansal fırsatları görebilirsiniz.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-readiness',
        content: 'Kredi Hazırlık: Kredi çekmeden önce eksiklerinizi ve hazır olma durumunuzu analiz eder.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-cks-analiz',
        content: 'ÇKS Analizi: Uygun PDF belgelerindeki temel kayıt alanlarını çıkarır; finansal uygunluk kararı vermez.',
        placement: 'auto',
      }
    ] as Step[] : []),

    // Producer Dashboard Content (scrolls down)
    ...(location.pathname === '/producer/home' || location.pathname === '/producer' ? [
      {
        target: '.tour-producer-overview',
        content: 'Çiftlik Performansı: Üretim, nakit akışı ve operasyonel risklerinizi 100 üzerinden şeffaf şekilde görün.',
        placement: 'bottom',
      },
      {
        target: '.tour-producer-trust',
        content: 'Veri Güven Merkezi: Belgelerinizin eksiksiz olması güvenilirliğinizi artırır ve kredi şansınızı yükseltir.',
        placement: 'left',
      }
    ] as Step[] : []),

    // Common End Steps
    {
      target: 'body',
      content: 'Çalışma Alanı: Seçtiğiniz bölüme ait özetleri ve ayrıntıları burada görürsünüz.',
      placement: 'center',
    },
    {
      target: '.tour-copilot',
      content: 'AgriScore Yardımcısı, bulunduğunuz ekrandaki kayıtları sade bir dille açıklar.',
      placement: 'left',
    }
  ];

  const handleStartTour = () => {
    setRun(true);
  };

  const isDashboard = location.pathname.includes('/institution') || location.pathname.includes('/producer');
  if (!isDashboard) return null;

  return (
    <>
      <button 
        onClick={handleStartTour}
        aria-label="Uygulamayı Keşfet"
        className="fixed bottom-4 left-4 lg:bottom-24 lg:left-auto lg:right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        title="Uygulamayı Keşfet"
      >
        <HelpCircle className="w-6 h-6 lg:mr-2" />
        <span className="hidden lg:inline font-bold pr-2">Uygulamayı Keşfet</span>
      </button>

      {/* @ts-ignore - react-joyride types are slightly inconsistent across versions */}
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        locale={{
          back: 'Geri',
          close: 'Kapat',
          last: 'Turu Bitir',
        }}
        // @ts-ignore
        callback={(data: any) => {
          if (data.status === 'finished' || data.status === 'skipped') {
            setRun(false);
          }
        }}
      />
    </>
  );
};

export default AppTour;
