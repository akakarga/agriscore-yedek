import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { producers } from '../data/seedData';
import { calculateAgriScore } from '../services/scoreEngine';
import { calculateForecast } from '../services/forecastEngine';
import { generateAINarrative } from '../services/aiAgentService';
import { calculateScenario } from '../services/scenarioEngine';
import type { ScenarioType } from '../services/scenarioEngine';
import { opportunities } from '../data/seedData';
import { calculateOpportunityMatch } from '../services/opportunityEngine';
import { ArrowLeft, Brain, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity, Printer, CheckCircle, XCircle, AlertTriangle, FileText, GitCompare, FileCheck, FileMinus, FileQuestion, GraduationCap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ProducerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('Mevcut Durum');

  const data = useMemo(() => {
    const producer = producers.find(p => p.id === id);
    if (!producer) return null;
    
    const score = calculateAgriScore(producer);
    const forecast = calculateForecast(producer);
    const aiReport = generateAINarrative(producer, score, forecast);
    const scenarioResult = calculateScenario(producer, activeScenario);

    const opportunityMatches = opportunities
      .map(opt => calculateOpportunityMatch(producer, opt))
      .sort((a, b) => b.matchScore - a.matchScore);

    return { producer, score, forecast, aiReport, scenarioResult, opportunityMatches };
  }, [id, activeScenario]);

  if (!data) {
    return <div className="p-8 text-center text-slate-500">Üretici bulunamadı.</div>;
  }

  const { producer, score, forecast, aiReport, scenarioResult, opportunityMatches } = data;
  const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:mb-2">
        <div className="flex items-center space-x-4">
          <Link to="/institution/producers" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 print:hidden">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-fin-900">{producer.name}</h2>
            <p className="text-slate-500">{producer.location} • {producer.businessType} • ID: {producer.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 print:hidden">
          <button className="flex items-center px-4 py-2 bg-fin-900 text-white rounded-lg hover:bg-fin-800 font-medium transition-colors shadow-sm">
            <Brain className="h-4 w-4 mr-2" />
            Canlı AI Analizi
          </button>
          <Link to={`/institution/producers/${id}/report`} className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-medium transition-colors">
            <Printer className="h-4 w-4 mr-2" />
            Kurumsal Rapor
          </Link>
        </div>
      </div>

      {/* Score Summary Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 print:border-slate-800 print:shadow-none">
        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center">
            <div className="text-sm font-medium text-slate-500 mb-1">AgriScore Risk Skoru</div>
            <div className={`text-4xl font-extrabold ${score.overallScore >= 75 ? 'text-green-600' : score.overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {score.overallScore}
            </div>
          </div>
          <div className="h-12 w-px bg-slate-200 hidden md:block"></div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">Risk Seviyesi</div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              score.riskLevel === 'Düşük' ? 'bg-green-100 text-green-800' :
              score.riskLevel === 'Orta' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {score.riskLevel}
            </span>
          </div>
          <div className="h-12 w-px bg-slate-200 hidden md:block"></div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">Veri Güvenilirliği</div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              score.reliabilityResult.score >= 80 ? 'bg-slate-100 text-slate-800' :
              score.reliabilityResult.score >= 50 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
            }`}>
              {score.reliabilityResult.score}%
            </span>
          </div>
          <div className="h-12 w-px bg-slate-200 hidden md:block"></div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">Başvuruya Hazırlık</div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              score.reliabilityResult.score >= 80 && producer.herd.totalCattle > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
            }`}>
              {score.reliabilityResult.score >= 80 ? 'Yüksek' : 'Eksik Belgeler Var'}
            </span>
          </div>
          <div className="h-12 w-px bg-slate-200 hidden md:block"></div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">Kredi Talebi</div>
            <div className="text-xl font-bold text-fin-900">{formatCurrency(producer.financials.requestedLoanAmount)}</div>
          </div>
        </div>
        
        {score.reliabilityResult.score < 80 && (
          <div className="flex items-center text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200 max-w-sm print:max-w-none">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-xs font-medium">Veri güvenilirliği düşük. Skor ihtiyatlı hesaplanmıştır.</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation (Hidden when printing) */}
      <div className="border-b border-slate-200 print:hidden overflow-x-auto">
        <nav className="flex space-x-6 min-w-max">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: Activity },
            { id: 'forecast', label: 'Verim Tahmini', icon: LineChartIcon },
            { id: 'financials', label: 'Nakit & Sürü', icon: PieChartIcon },
            { id: 'sources', label: 'Veri Güven Merkezi', icon: FileText },
            { id: 'scenario', label: 'Senaryo Analizi', icon: GitCompare },
            { id: 'opportunities', label: 'Uygun Destekler', icon: GraduationCap },
            { id: 'agent', label: 'AI Risk Raporu', icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-agri-600 text-agri-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className={`h-4 w-4 mr-2 ${activeTab === tab.id ? 'text-agri-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content (All visible when printing via print:block) */}
      <div className="min-h-[400px]">
        
        {/* OVERVIEW TAB */}
        <div className={`${activeTab === 'overview' ? 'block' : 'hidden'} print:block print:mb-8`}>
          <div className="print:block hidden mb-4 text-xl font-bold border-b border-slate-300 pb-2">1. Genel Bakış</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:break-inside-avoid">
              <h3 className="text-lg font-bold text-fin-900 mb-4">Alt Skorlar</h3>
              <div className="space-y-4">
                {[
                  { label: 'Üretim İstikrarı', value: score.subScores.productionStability },
                  { label: 'Nakit Akışı Gücü', value: score.subScores.cashflowStrength },
                  { label: 'Sürü Gücü', value: score.subScores.herdStrength },
                  { label: 'Borç Yükü (Ters Orantılı)', value: score.subScores.debtBurden },
                  { label: 'Gelir Düzenliliği', value: score.subScores.incomeRegularity },
                  { label: 'Operasyonel Risk (Ters Orantılı)', value: score.subScores.operationalRisk },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium">{item.label}</span>
                      <span className="text-fin-900 font-bold">{item.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${item.value >= 75 ? 'bg-green-500' : item.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-center print:break-inside-avoid relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">KARAR DESTEK</div>
              <h3 className="text-lg font-bold text-fin-900 mb-2">Güvenli Taksit Kapasitesi</h3>
              <p className="text-sm text-slate-500 mb-6">Mevcut net nakit akışına göre aylık önerilen maksimum taksit aralığı.</p>
              <div className="text-3xl font-extrabold text-agri-600">
                {formatCurrency(score.safeInstallmentRange.min)} - {formatCurrency(score.safeInstallmentRange.max)}
              </div>
              <p className="text-xs text-slate-400 mt-4">* Bu bir karar destek metriğidir. Kesin onay anlamına gelmez.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm print:break-inside-avoid">
              <h3 className="text-lg font-bold text-fin-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-agri-600" />
                Açıklanabilirlik Paneli
              </h3>
              <p className="text-sm text-slate-600 mb-4"><strong>Bu skor neden böyle hesaplandı?</strong></p>
              <ul className="text-sm text-slate-700 space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">↑</span>
                  <span><strong>Nakit Akışı Güçlü:</strong> Aylık süt geliri, giderleri istikrarlı bir şekilde karşılıyor.</span>
                </li>
                {score.reliabilityResult.score < 100 && (
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">↓</span>
                    <span><strong>İhtiyat Payı Uygulandı:</strong> Eksik/onaylanmamış veri kaynakları nedeniyle risk skoru {100 - score.reliabilityResult.score} puan baskılandı.</span>
                  </li>
                )}
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">ℹ</span>
                  <span><strong>Sigorta Hazırlık Durumu:</strong> {producer.dataSources.some(ds => ds.name.includes('TARSİM')) ? 'Aktif poliçe bulundu (Pozitif Etki)' : 'Poliçe kaydı tespit edilemedi (Nötr Etki)'}</span>
                </li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:break-inside-avoid">
               <h3 className="text-lg font-bold text-fin-900 mb-4">Geçmiş Süt Üretimi</h3>
               {producer.productionHistory.length > 0 ? (
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={producer.productionHistory}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                       <RechartsTooltip formatter={(value) => [`${value} Litre`, 'Toplam Üretim']} />
                       <Bar dataKey="totalLiters" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               ) : (
                 <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">Veri Yok</div>
               )}
            </div>
          </div>
        </div>

        {/* FORECAST TAB */}
        <div className={`${activeTab === 'forecast' ? 'block' : 'hidden'} print:block print:mb-8`}>
          <div className="print:block hidden mb-4 text-xl font-bold border-b border-slate-300 pb-2 mt-8">2. Gelecek Verim Tahmini</div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:break-inside-avoid">
               <h3 className="text-lg font-bold text-fin-900 mb-2">Gelecek Verim Tahmini (Projeksiyon)</h3>
               <p className="text-sm text-slate-500 mb-6">{forecast.trendExplanation}</p>
               
               {forecast.predictions.length > 0 ? (
                 <div className="h-72 mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={forecast.predictions}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                       <RechartsTooltip formatter={(value) => [`${value} Litre`, 'Tahmini Üretim']} />
                       <Line type="monotone" dataKey="predictedLiters" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
               ) : (
                 <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">Tahmin Üretilemedi</div>
               )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Tahmin Güven Seviyesi</h3>
                 <div className="flex items-end">
                   <span className="text-3xl font-bold text-fin-900">%{forecast.confidenceLevel}</span>
                 </div>
                 <p className="text-sm text-slate-600 mt-2">Bu tahmin, deterministik modellemeyle üretilmiştir. Kesin hacim taahhüdü değildir.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-purple-500">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Risk Notu (Projeksiyon)</h3>
                 <p className="text-fin-900 font-medium">{forecast.riskNote}</p>
               </div>
            </div>
          </div>
        </div>

        {/* FINANCIALS & HERD TAB */}
        <div className={`${activeTab === 'financials' ? 'block' : 'hidden'} print:block print:mb-8`}>
          <div className="print:block hidden mb-4 text-xl font-bold border-b border-slate-300 pb-2 mt-8">3. Nakit Akışı ve Sürü</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-fin-900 mb-6">Nakit Akışı (Aylık)</h3>
               <div className="space-y-4">
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-600">Süt Geliri</span>
                   <span className="font-medium text-green-600">{formatCurrency(producer.financials.monthlyMilkRevenue)}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-600">Yem Gideri</span>
                   <span className="font-medium text-red-600">-{formatCurrency(producer.financials.monthlyFeedCost)}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-600">Diğer Operasyonel Giderler</span>
                   <span className="font-medium text-red-600">-{formatCurrency(producer.financials.monthlyOtherCosts)}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-600">Mevcut Kredi Taksitleri</span>
                   <span className="font-medium text-red-600">-{formatCurrency(producer.financials.currentLoanInstallments)}</span>
                 </div>
                 <div className="flex justify-between pt-2 text-lg">
                   <span className="text-fin-900 font-bold">Net Nakit Akışı</span>
                   <span className={`font-bold ${producer.financials.monthlyMilkRevenue - producer.financials.monthlyFeedCost - producer.financials.monthlyOtherCosts - producer.financials.currentLoanInstallments > 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {formatCurrency(producer.financials.monthlyMilkRevenue - producer.financials.monthlyFeedCost - producer.financials.monthlyOtherCosts - producer.financials.currentLoanInstallments)}
                   </span>
                 </div>
               </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-fin-900 mb-6">Sürü Varlığı</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-100">
                   <div className="text-2xl font-bold text-fin-900">{producer.herd.totalCattle}</div>
                   <div className="text-sm text-slate-500">Toplam</div>
                 </div>
                 <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                   <div className="text-2xl font-bold text-blue-700">{producer.herd.milkingCows}</div>
                   <div className="text-sm text-blue-600 font-medium">Sağmal</div>
                 </div>
                 <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                   <div className="text-2xl font-bold text-green-700">{producer.herd.heifers}</div>
                   <div className="text-sm text-green-600 font-medium">Düve</div>
                 </div>
                 <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-100">
                   <div className="text-2xl font-bold text-orange-700">{producer.herd.calves} + {producer.herd.dryCows}</div>
                   <div className="text-sm text-orange-600 font-medium">Buzağı + Kuru</div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* SOURCES TAB */}
        <div className={`${activeTab === 'sources' ? 'block' : 'hidden'} print:block print:mb-8`}>
           <div className="print:block hidden mb-4 text-xl font-bold border-b border-slate-300 pb-2 mt-8">4. Veri Güven Merkezi</div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:break-inside-avoid">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-fin-900">Sistemdeki Veri Kaynakları</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold ${
                  score.reliabilityResult.score >= 80 ? 'bg-green-100 text-green-800' :
                  score.reliabilityResult.score >= 50 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                }`}>
                  Güvenilirlik Skoru: %{score.reliabilityResult.score}
                </span>
             </div>

             {score.reliabilityResult.warningMessage && (
               <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm">
                 <AlertTriangle className="inline w-4 h-4 mr-2" />
                 {score.reliabilityResult.warningMessage}
               </div>
             )}

             <div className="space-y-4">
               {producer.dataSources && producer.dataSources.length > 0 ? (
                 producer.dataSources.map((source, idx) => (
                   <div key={idx} className="flex items-start p-4 border border-slate-100 rounded-lg bg-slate-50">
                     <div className="mr-4 mt-1">
                       {source.status === 'doğrulandı' ? <FileCheck className="w-6 h-6 text-green-500" /> :
                        source.status === 'bekliyor' ? <FileQuestion className="w-6 h-6 text-yellow-500" /> :
                        <FileMinus className="w-6 h-6 text-red-500" />}
                     </div>
                     <div className="flex-1">
                       <div className="flex justify-between mb-1">
                         <h4 className="font-bold text-fin-900">{source.name}</h4>
                         <span className="text-xs text-slate-500">{source.date}</span>
                       </div>
                       <p className="text-sm text-slate-600 mb-1">{source.description}</p>
                       <p className="text-xs font-medium text-slate-500">Etki: {source.impact}</p>
                     </div>
                     <div className="ml-4">
                       <span className={`text-xs px-2 py-1 rounded font-medium ${
                         source.status === 'doğrulandı' ? 'bg-green-100 text-green-800' :
                         source.status === 'bekliyor' ? 'bg-yellow-100 text-yellow-800' :
                         'bg-red-100 text-red-800'
                       }`}>
                         {source.status.toUpperCase()}
                       </span>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="p-4 text-center text-slate-500 border border-dashed border-slate-300 rounded-lg">
                   Hiçbir veri kaynağı / belge tanımlanmamış.
                 </div>
               )}
             </div>

             {/* Missing Data List */}
             {score.reliabilityResult.missingData.length > 0 && (
               <div className="mt-6 border-t border-slate-100 pt-6">
                 <h4 className="font-bold text-red-800 mb-3 text-sm">Eksik Veriler / Riskler</h4>
                 <ul className="list-disc pl-5 text-sm text-red-600 space-y-1">
                   {score.reliabilityResult.missingData.map((err, i) => <li key={i}>{err}</li>)}
                 </ul>
               </div>
             )}
           </div>
        </div>

        {/* SCENARIO TAB */}
        <div className={`${activeTab === 'scenario' ? 'block' : 'hidden'} print:block print:mb-8`}>
           <div className="print:block hidden mb-4 text-xl font-bold border-b border-slate-300 pb-2 mt-8">5. Senaryo Analizi</div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:break-inside-avoid">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-fin-900">Senaryo Karşılaştırma</h3>
                <div className="mt-4 md:mt-0 print:hidden">
                  <select 
                    className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-agri-500 focus:border-agri-500"
                    value={activeScenario}
                    onChange={(e) => setActiveScenario(e.target.value as ScenarioType)}
                  >
                    <option value="Mevcut Durum">Mevcut Durum</option>
                    <option value="Yem Maliyeti %15 Artarsa">Yem Maliyeti %15 Artarsa</option>
                    <option value="Süt Fiyatı %10 Düşerse">Süt Fiyatı %10 Düşerse</option>
                    <option value="Üretim %10 Düşerse">Üretim %10 Düşerse</option>
                    <option value="Yeni Kredi Taksiti Eklenirse">Yeni Kredi Taksiti Eklenirse</option>
                  </select>
                </div>
             </div>

             <div className="print:block hidden mb-4 text-slate-600 text-sm">
                Seçilen Senaryo: <strong>{activeScenario}</strong>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="text-xs text-slate-500 mb-1">Aylık Gelir</div>
                 <div className="font-bold text-fin-900">{formatCurrency(scenarioResult.newMonthlyRevenue)}</div>
               </div>
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="text-xs text-slate-500 mb-1">Aylık Gider (Taksit Hariç)</div>
                 <div className="font-bold text-red-600">{formatCurrency(scenarioResult.newMonthlyExpenses)}</div>
               </div>
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="text-xs text-slate-500 mb-1">Net Nakit Akışı (Taksit Sonrası)</div>
                 <div className={`font-bold ${scenarioResult.newNetCashFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {formatCurrency(scenarioResult.newNetCashFlow)}
                 </div>
               </div>
               <div className={`p-4 rounded-lg border ${scenarioResult.newDscr < 1.25 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                 <div className="text-xs font-medium mb-1">Risk Etkisi</div>
                 <div className="font-bold text-slate-900">{scenarioResult.riskImpact}</div>
               </div>
             </div>

             <div className="text-sm text-slate-500">
               * DSCR (Borç Servis Karşılama Oranı): {scenarioResult.newDscr === 999 ? 'Limitsiz (Borçsuz)' : scenarioResult.newDscr.toFixed(2)}
               <br/>
               * Bu simülasyon deterministik matematik modeline dayanır.
             </div>
           </div>
        </div>

        {/* OPPORTUNITIES TAB */}
        <div className={`${activeTab === 'opportunities' ? 'block' : 'hidden'} print:block print:mb-8`}>
           <div className="print:block hidden mb-4 text-xl font-bold border-b border-slate-300 pb-2 mt-8">6. Uygun Destekler & Fırsatlar</div>
           <div className="space-y-4">
             {opportunityMatches.map((match, idx) => (
               <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:break-inside-avoid">
                 <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                   <div>
                     <h3 className="text-lg font-bold text-fin-900">{match.opportunity.title}</h3>
                     <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                       <span className="bg-agri-100 text-agri-800 px-2 py-0.5 rounded text-xs font-medium">{match.opportunity.type}</span>
                     </div>
                   </div>
                   <div className="flex flex-col items-end">
                     <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold ${
                        match.matchScore >= 75 ? 'bg-green-100 text-green-800' :
                        match.matchScore >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                     }`}>
                       Uygunluk Skoru: %{match.matchScore}
                     </span>
                     <span className="text-xs font-medium text-slate-500 mt-1">{match.verificationStatus}</span>
                   </div>
                 </div>

                 <p className="text-sm text-slate-600 mb-4">{match.reasonForRecommendation}</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Güçlü Yönler</h4>
                     <ul className="text-sm text-slate-700 space-y-1">
                       {match.strongPoints.map((sp, i) => (
                         <li key={i} className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span>{sp}</span></li>
                       ))}
                       {match.strongPoints.length === 0 && <li className="text-slate-400">Belirgin bir güçlü yön bulunamadı.</li>}
                     </ul>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Eksikler & Riskler</h4>
                     <ul className="text-sm text-slate-700 space-y-1">
                       {match.missingRequirements.map((mr, i) => (
                         <li key={i} className="flex items-start"><XCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" /> <span>{mr}</span></li>
                       ))}
                       {match.riskNote && <li className="flex items-start"><AlertTriangle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5" /> <span>{match.riskNote}</span></li>}
                       {match.missingRequirements.length === 0 && !match.riskNote && <li className="text-slate-400">Belirgin bir eksik veya risk bulunamadı.</li>}
                     </ul>
                   </div>
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                   {match.opportunity.sourceNote}
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* AI AGENT TAB */}
        <div className={`${activeTab === 'agent' ? 'block' : 'hidden'} print:block print:mb-8`}>
          <div className="print:block hidden mb-4 text-xl font-bold border-b border-slate-300 pb-2 mt-8">7. AI Destekli Risk Raporu</div>
          <div className="space-y-6 print:break-inside-avoid">
            <div className="bg-gradient-to-r from-fin-900 to-fin-800 p-8 rounded-xl text-white shadow-md relative overflow-hidden print:bg-white print:text-black print:border print:border-slate-300 print:shadow-none">
               <Brain className="absolute -right-4 -bottom-4 h-32 w-32 text-white opacity-10 print:hidden" />
               <h3 className="text-xl font-bold mb-4 flex items-center print:text-fin-900">
                 <Brain className="h-6 w-6 mr-2 print:text-fin-900" />
                 AI Destekli Risk Özeti
               </h3>
               <p className="text-lg leading-relaxed relative z-10 text-fin-50 whitespace-pre-wrap print:text-slate-800">{aiReport.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                   <CheckCircle className="h-5 w-5 mr-2 text-green-500" /> Pozitif Sinyaller
                 </h4>
                 <ul className="space-y-3">
                   {aiReport.positiveFactors.map((factor, idx) => (
                     <li key={idx} className="flex items-start">
                       <span className="h-2 w-2 mt-2 mr-2 bg-green-500 rounded-full flex-shrink-0"></span>
                       <span className="text-slate-700">{factor}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                   <XCircle className="h-5 w-5 mr-2 text-red-500" /> Negatif / Risk Sinyalleri
                 </h4>
                 <ul className="space-y-3">
                   {aiReport.negativeFactors.map((factor, idx) => (
                     <li key={idx} className="flex items-start">
                       <span className="h-2 w-2 mt-2 mr-2 bg-red-500 rounded-full flex-shrink-0"></span>
                       <span className="text-slate-700">{factor}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-blue-800 text-sm font-mono print:hidden">
               {aiReport.architecturalNote}
            </div>
          </div>
        </div>

      </div>

      {/* Global Warning / Disclaimer */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500 pb-12 print:pb-0">
         <p className="font-medium text-slate-600 mb-1">YASAL UYARI VE SINIRLAMA</p>
         <p>AgriScore AI yalnızca bir karar destek sistemidir. Hiçbir koşulda kredi onayı vermez veya kesin yatırım tavsiyesi niteliği taşımaz. Nihai kredi kararı finans kurumuna aittir.</p>
      </div>
    </div>
  );
};

export default ProducerDetail;
