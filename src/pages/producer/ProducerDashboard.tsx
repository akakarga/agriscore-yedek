import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { producers, opportunities } from '../../data/seedData';
import { calculateAgriScore } from '../../services/scoreEngine';
import { calculateForecast } from '../../services/forecastEngine';
import { calculateScenario } from '../../services/scenarioEngine';
import type { ScenarioType } from '../../services/scenarioEngine';
import { calculateOpportunityMatch } from '../../services/opportunityEngine';
import { sessionService } from '../../auth/session';
import { Activity, LineChart as LineChartIcon, PieChart as PieChartIcon, FileText, GraduationCap, AlertTriangle, CheckCircle, Brain, Target, ShieldAlert } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ProducerDashboard = () => {
  const location = useLocation();
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('Mevcut Durum');

  const data = useMemo(() => {
    const user = sessionService.getCurrentUser();
    if (!user || !user.linkedProducerId) return null;

    const producer = producers.find(p => p.id === user.linkedProducerId);
    if (!producer) return null;

    const score = calculateAgriScore(producer);
    const forecast = calculateForecast(producer);
    const scenarioResult = calculateScenario(producer, activeScenario);

    const opportunityMatches = opportunities
      .map(opt => calculateOpportunityMatch(producer, opt))
      .sort((a, b) => b.matchScore - a.matchScore);

    return { producer, score, forecast, scenarioResult, opportunityMatches };
  }, [activeScenario]);

  if (!data) {
    return <div className="p-8 text-center text-slate-500">Üretici verisi bulunamadı veya yetkisiz erişim.</div>;
  }

  const { producer, score, forecast, scenarioResult, opportunityMatches } = data;
  const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);

  const getActiveTab = () => {
    if (location.pathname.includes('/home')) return 'overview';
    if (location.pathname.includes('/production')) return 'production';
    if (location.pathname.includes('/finance')) return 'finance';
    if (location.pathname.includes('/documents')) return 'documents';
    if (location.pathname.includes('/opportunities')) return 'opportunities';
    if (location.pathname.includes('/readiness')) return 'readiness';
    return 'overview';
  };

  const activeTab = getActiveTab();

  return (
    <div className="space-y-6">
      {/* Top Banner specific to Producer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Hoş Geldiniz, {producer.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{producer.location} • {producer.businessType} • Veri Güvenilirliği Skoru: %{score.reliabilityResult.score}</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
             <div className="text-xs text-slate-500">Sağmal Hayvan</div>
             <div className="font-bold text-slate-700">{producer.herd.milkingCows} Baş</div>
           </div>
           <div className="w-px bg-slate-200"></div>
           <div className="text-right">
             <div className="text-xs text-slate-500">Aylık Tahmini Üretim</div>
             <div className="font-bold text-slate-700">{formatCurrency(producer.financials.monthlyMilkRevenue)}</div>
           </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-agri-600" />
              Çiftlik Genel Performansı
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Bu tablo, işletmenizin üretim, finansal ve operasyonel verilerine dayanarak oluşturulan deterministik risk ve kapasite özetidir.
            </p>
            <div className="space-y-4">
                {[
                  { label: 'Üretim İstikrarı', value: score.subScores.productionStability },
                  { label: 'Nakit Akışı Gücü', value: score.subScores.cashflowStrength },
                  { label: 'Sürü Gücü', value: score.subScores.herdStrength },
                  { label: 'Borç Yükü Kapasitesi', value: score.subScores.debtBurden },
                  { label: 'Gelir Düzenliliği', value: score.subScores.incomeRegularity },
                  { label: 'Operasyonel Hazırlık', value: score.subScores.operationalRisk },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium">{item.label}</span>
                      <span className="text-slate-800 font-bold">{item.value.toFixed(1)} / 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.value >= 75 ? 'bg-green-500' : item.value >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">ŞEFFAFLIK</div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-orange-500" />
              Veri Güven Merkezi
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Veri güvenilirliğiniz: <strong>%{score.reliabilityResult.score}</strong>. Finansman başvurularında belgelerinizin tam ve güncel olması karar sürecini hızlandırır.
            </p>
            <div className="space-y-3">
              {score.reliabilityResult.missingData.length > 0 ? (
                score.reliabilityResult.missingData.map((missing, idx) => (
                  <div key={idx} className="flex items-start text-sm text-orange-700 bg-orange-50 p-3 rounded border border-orange-100">
                    <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{missing}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-start text-sm text-green-700 bg-green-50 p-3 rounded border border-green-100">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Kayıtlı veri eksiğiniz bulunmamaktadır.</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button className="text-sm font-medium text-slate-600 hover:text-fin-700 underline flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Verilerimde Hata Var / İtiraz Et (Veri Düzeltme Akışı)
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'production' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <LineChartIcon className="w-5 h-5 mr-2 text-agri-600" />
              Süt Üretim Geçmişi ve Verim Tahmini
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Önümüzdeki 6 ay için deterministik kapasite ve trend odaklı üretim tahminleri.
            </p>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast.predictions}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(val: number) => `${val / 1000}k L`} />
                  <RechartsTooltip 
                    formatter={(value: any) => [`${Number(value).toLocaleString()} Litre`, 'Tahmini Üretim']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="predictedLiters" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2 text-agri-600" />
                  Nakit Akışı ve Stres Testi
                </h3>
                <p className="text-sm text-slate-500 mt-1">Borç ödeme kapasitesi (DSCR) ve senaryo simülasyonları.</p>
              </div>
              <select 
                className="mt-4 md:mt-0 p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-agri-500"
                value={activeScenario}
                onChange={(e) => setActiveScenario(e.target.value as ScenarioType)}
              >
                <option value="Mevcut Durum">Mevcut Durum</option>
                <option value="Süt Fiyatı %10 Düşerse">Senaryo: Süt Fiyatı %10 Düşerse</option>
                <option value="Yem Maliyeti %15 Artarsa">Senaryo: Yem Maliyeti %15 Artarsa</option>
                <option value="Yeni Kredi Taksiti Eklenirse">Senaryo: Yeni Kredi Taksiti Eklenirse</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border-b border-slate-100">
                  <span className="text-slate-500">Tahmini Gelir (Aylık)</span>
                  <span className="font-bold text-slate-700">{formatCurrency(scenarioResult.newMonthlyRevenue)}</span>
                </div>
                <div className="flex justify-between items-center p-3 border-b border-slate-100">
                  <span className="text-slate-500">Aylık Giderler</span>
                  <span className="font-bold text-red-600">-{formatCurrency(scenarioResult.newMonthlyExpenses)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800">Net Nakit Akışı</span>
                  <span className={`font-bold text-lg ${scenarioResult.newNetCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(scenarioResult.newNetCashFlow)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 text-center">Borç Ödeme Kapasitesi (DSCR) Etkisi</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Mevcut', dscr: score.subScores.debtBurden / 100 * 2.5 }, // approx calculation for baseline dscr visually
                      { name: 'Senaryo', dscr: scenarioResult.newDscr }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{fontSize: 12}} />
                      <YAxis tick={{fontSize: 12}} />
                      <RechartsTooltip />
                      <Bar dataKey="dscr" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600 text-center">
                  DSCR oranınız 1.25'in üzerindeyse işletmeniz borç ödeme konusunda dirençli kabul edilir. (Mevcut Skor: {score.subScores.debtBurden.toFixed(2)} | Senaryo DSCR: {scenarioResult.newDscr.toFixed(2)})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">ŞEFFAFLIK</div>
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-agri-600" />
            Veri Güven Merkezi & Kayıtlı Belgeler
          </h3>
          <div className="space-y-4">
            {producer.dataSources.map((ds, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50">
                <div className="flex items-start mb-2 md:mb-0">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{ds.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{ds.description}</p>
                    <p className="text-xs text-slate-600 mt-2">Etki: {ds.impact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {ds.status}
                  </span>
                  <div className="text-xs text-slate-400 mt-1">{ds.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-agri-600" />
            İşletmenize Uygun Destek ve Hibeler
          </h3>
          <p className="text-sm text-slate-500 mb-6">İşletmenizin profiline göre otomatik eşleştirilen fırsatlar. Kesin hibe garantisi içermez, bilgi amaçlıdır.</p>
          
          <div className="space-y-4">
            {opportunityMatches.map((match, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-md font-bold text-slate-800 flex items-center">
                    {match.opportunity.title}
                    <span className="ml-2 text-xs px-2 py-0.5 bg-fin-100 text-fin-800 rounded-full">{match.opportunity.type}</span>
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">{match.opportunity.region.join(', ')} • {match.opportunity.eligibilityRules}</p>
                  <p className="text-sm text-slate-500 mt-2">{match.opportunity.sourceNote}</p>
                </div>
                <div className="text-right md:min-w-[120px]">
                  <div className="text-sm font-medium text-slate-500">Uygunluk Skoru</div>
                  <div className={`text-2xl font-bold ${match.matchScore >= 75 ? 'text-green-600' : match.matchScore >= 50 ? 'text-yellow-600' : 'text-slate-400'}`}>
                    {match.matchScore}/100
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'readiness' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-agri-600" />
            Finansman Başvurusu Hazırlık Rehberi
          </h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Kurumlarla yapacağınız finansman görüşmelerine hazırlık yapabilmeniz için sistem tarafından üretilen durum özetiniz.
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Güçlü Yönleriniz
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                {producer.riskNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2 text-slate-600" />
                Gelişime Açık Alanlar ve Belge İhtiyaçları
              </h4>
              {score.reliabilityResult.missingData.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {score.reliabilityResult.missingData.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                  <li className="mt-2 text-orange-600 italic">Eksik veri kaynaklarınızı tamamlamanız değerlendirme skorunuzu güçlendirecektir.</li>
                </ul>
              ) : (
                <p className="text-sm text-slate-700">Veri güvenilirliğiniz yüksek. Mevcut belgelerinizi finans kurumuyla görüşmeye giderken hazır bulundurun.</p>
              )}
            </div>

            <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
              <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2" />
                Sigorta Hazırlık Durumu
              </h4>
              <p className="text-sm text-purple-800">
                {producer.dataSources.some(ds => ds.name.includes('TARSİM')) 
                  ? 'Aktif poliçe kaydınız tespit edilmiştir. Bu durum olası afet risklerine karşı işletmenizin dayanıklılığını artırarak karar destek skoru üzerinde pozitif etki sağlar.'
                  : 'Sistemde aktif bir tarım/hayvan hayat sigortası (TARSİM vb.) poliçeniz bulunamamıştır. Poliçe eklemek risk değerlendirmesinde avantaj sağlayabilir.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProducerDashboard;
