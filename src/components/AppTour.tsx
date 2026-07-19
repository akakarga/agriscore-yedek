import { useState } from 'react';
import { Joyride } from 'react-joyride';
import type { Step } from 'react-joyride';
import { HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AppTour = () => {
  const [run, setRun] = useState(false);
  const location = useLocation();

  const isInstitution = location.pathname.includes('/institution');
  const isProducer = location.pathname.includes('/producer');
  
  const steps: Step[] = [
    {
      target: 'body',
      content: 'AgriScore Yapay Zeka destekli tarımsal finans karar sistemine hoş geldiniz! Sizi proje içerisindeki yeteneklerimizle tanıştıralım.',
      placement: 'center',
    },
    // Institution Sidebar
    ...(isInstitution ? [
      {
        target: '.tour-menu-dashboard',
        content: 'Dashboard: Portföyünüzün risk dağılımını, şok senaryolarını ve genel finansal durumunu özetler.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-producers',
        content: 'Üreticiler: Sistemdeki tüm çiftçileri listeler. Buradan her bir üreticinin derinlemesine finansal/tarımsal karnesine ulaşabilirsiniz.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-opportunities',
        content: 'Fırsatlar: Üreticilerin verilerine göre onlara uygun devlet destekleri ve finansal fırsatları eşleştirir.',
        placement: 'auto',
      },
      {
        target: '.tour-menu-cks-analiz',
        content: 'Dinamik ÇKS: Çiftçi Kayıt Sistemi vb. belgelerin OCR ile anında okunup dijital verilere çevrildiği ve risk skorunun güncellendiği alandır.',
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
        content: 'Değerlendirme Simülasyonu: Kredi onaylama stratejinizi değiştirerek, anlık olarak onaylanacak/reddedilecek adayları görün!',
        placement: 'top',
      }
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
        content: 'Belgeler: Sisteme yüklediğiniz tüm evrakları ve durumlarını buradan görebilirsiniz.',
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
        content: 'ÇKS Analizi: ÇKS belgenizi yükleyerek yapay zeka ile anında analiz edilmesini sağlayabilirsiniz.',
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
      content: 'Orta alanımız (Çalışma Alanı): Seçtiğiniz modüle göre ilgili analizleri bu alanda dinamik olarak görselleştiriyoruz.',
      placement: 'center',
    },
    {
      target: '.tour-copilot',
      content: 'Ve son olarak AgriScore Co-Pilot! Hangi sayfada olursanız olun bağlamı anlayarak size anında asistanlık yapar.',
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
        className="fixed bottom-24 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        title="Projeyi Keşfet"
      >
        <HelpCircle className="w-6 h-6 mr-2" />
        <span className="font-bold pr-2">Projeyi Keşfet</span>
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
