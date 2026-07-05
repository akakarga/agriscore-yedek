import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { producers } from '../data/seedData';
import { calculateAgriScore } from '../services/scoreEngine';
import { calculateForecast } from '../services/forecastEngine';
import { generateAINarrative } from '../services/aiAgentService';
import { Printer, ArrowLeft, Wheat, Brain } from 'lucide-react';

const Report = () => {
  const { id } = useParams<{ id: string }>();

  const data = useMemo(() => {
    const producer = producers.find(p => p.id === id);
    if (!producer) return null;
    
    const score = calculateAgriScore(producer);
    const forecast = calculateForecast(producer);
    const aiReport = generateAINarrative(producer, score, forecast);

    return { producer, score, forecast, aiReport };
  }, [id]);

  useEffect(() => {
    // Optionally auto-print after a small delay
    // const timer = setTimeout(() => window.print(), 500);
    // return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-slate-500">Üretici bulunamadı.</div>;
  }

  const { producer, score, aiReport } = data;
  const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Non-printable header controls */}
      <div className="print:hidden bg-slate-50 border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to={`/institution/producers/${id}`} className="text-slate-500 hover:text-fin-900 flex items-center transition-colors">
            <ArrowLeft className="w-5 h-5 mr-1" /> Geri Dön
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-600">Önizleme Modu</span>
        </div>
        <button onClick={() => window.print()} className="bg-fin-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-fin-800 transition-colors flex items-center shadow-sm">
          <Printer className="w-4 h-4 mr-2" /> PDF / Yazdır
        </button>
      </div>

      {/* A4 Printable Area */}
      <div className="max-w-[210mm] mx-auto bg-white p-12 print:p-0 print:max-w-none">
        
        {/* Report Header */}
        <div className="flex justify-between items-start border-b-2 border-fin-900 pb-6 mb-8">
          <div className="flex items-center">
            <Wheat className="w-10 h-10 text-fin-900 mr-3" />
            <div>
              <h1 className="text-2xl font-black text-fin-900 tracking-tight">AgriScore Kurumsal Rapor</h1>
              <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">AI Destekli Finansal Analiz</p>
            </div>
          </div>
          <div className="text-right text-sm text-slate-600">
            <p><strong>Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
            <p><strong>Rapor No:</strong> AS-{producer.id}-{new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8 flex gap-8">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-1">Üretici Bilgileri</h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-slate-500">Ad Soyad / Unvan:</span>
              <span className="font-bold text-fin-900">{producer.name}</span>
              <span className="text-slate-500">Faaliyet Bölgesi:</span>
              <span className="font-medium text-slate-800">{producer.location}</span>
              <span className="text-slate-500">İşletme Tipi:</span>
              <span className="font-medium text-slate-800">{producer.businessType}</span>
              <span className="text-slate-500">Talep Edilen Kredi:</span>
              <span className="font-bold text-fin-900">{formatCurrency(producer.financials.requestedLoanAmount)}</span>
            </div>
          </div>
          <div className="w-64 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Risk Skoru</div>
            <div className={`text-5xl font-black ${score.overallScore >= 75 ? 'text-green-600' : score.overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {score.overallScore}
            </div>
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${
              score.riskLevel === 'Düşük' ? 'bg-green-100 text-green-800' :
              score.riskLevel === 'Orta' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {score.riskLevel} RİSK
            </div>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-1">Alt Faktörler ve Değerlendirme</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {[
              { label: 'Üretim İstikrarı', value: score.subScores.productionStability },
              { label: 'Nakit Akışı Gücü', value: score.subScores.cashflowStrength },
              { label: 'Sürü Gücü', value: score.subScores.herdStrength },
              { label: 'Borç Yükü (Ters Orantılı)', value: score.subScores.debtBurden },
              { label: 'Gelir Düzenliliği', value: score.subScores.incomeRegularity },
              { label: 'Operasyonel Risk (Ters Orantılı)', value: score.subScores.operationalRisk },
            ].map(item => (
              <div key={item.label} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <span className="font-bold text-fin-900">{item.value}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${item.value >= 75 ? 'bg-green-500' : item.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="mb-8 bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-fin-900 mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2" /> AI Karar Destek Özeti
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{aiReport.summary}</p>
          
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Pozitif Etkenler</h3>
              <ul className="text-sm text-slate-700 space-y-1 list-disc pl-4">
                {aiReport.positiveFactors.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Risk Etkenleri</h3>
              <ul className="text-sm text-slate-700 space-y-1 list-disc pl-4">
                {aiReport.negativeFactors.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Financial Capacity */}
        <div className="mb-8">
           <h2 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-1">Kapasite ve Projeksiyon</h2>
           <div className="grid grid-cols-3 gap-4">
              <div className="border border-slate-200 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 font-medium mb-1">Mevcut Net Nakit Akışı (Aylık)</div>
                 <div className="text-lg font-bold text-fin-900">
                   {formatCurrency(producer.financials.monthlyMilkRevenue - producer.financials.monthlyFeedCost - producer.financials.monthlyOtherCosts - producer.financials.currentLoanInstallments)}
                 </div>
              </div>
              <div className="border border-slate-200 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 font-medium mb-1">Güvenli Taksit Aralığı</div>
                 <div className="text-lg font-bold text-agri-700">
                   {formatCurrency(score.safeInstallmentRange.min)} - {formatCurrency(score.safeInstallmentRange.max)}
                 </div>
              </div>
              <div className="border border-slate-200 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 font-medium mb-1">Veri Güvenilirliği Skoru</div>
                 <div className="text-lg font-bold text-slate-700">
                   %{score.reliabilityResult.score}
                 </div>
              </div>
           </div>
        </div>

        {/* Footer / Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-300 text-xs text-slate-500 text-center print:break-inside-avoid">
          <p className="font-bold mb-1">YASAL UYARI</p>
          <p>AgriScore AI bir karar destek aracıdır ve bu rapor nihai bir kredi onayı veya yatırım tavsiyesi niteliği taşımaz. Rapor içerisindeki veriler sağlanan dökümanlar ve bölgesel istatistikler kullanılarak matematiksel modellerle üretilmiştir. Kesin kararlar için yerinde tespit ve yetkili merci onayı gereklidir.</p>
        </div>
        
      </div>
    </div>
  );
};

export default Report;
