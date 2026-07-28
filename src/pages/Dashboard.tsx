import { useMemo, useState } from 'react';
import { producers } from '../data/seedData';
import { calculateAgriScore } from '../services/scoreEngine';
import { calculateForecast } from '../services/forecastEngine';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, AlertTriangle, TrendingUp, DollarSign, ShieldAlert, MapPin, Milk, ChevronRight, Activity, X, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router';
import OfficialMarketContext from '../components/OfficialMarketContext';
import { DATASET_PROVENANCE } from '../data/seedData';
import { calculatePortfolioStress } from '../services/portfolioStressEngine';
import type { PortfolioStressType } from '../services/portfolioStressEngine';

const Dashboard = () => {
  const [policyLevel, setPolicyLevel] = useState(2);
  const [shockScenario, setShockScenario] = useState<{title: string, desc: string, impacts: string[]} | null>(null);

  const stats = useMemo(() => {
    let totalMilk = 0;
    let projectedTotalMilk3Months = 0;
    let totalLoanReq = 0;
    let riskCounts = { Düşük: 0, Orta: 0, Yüksek: 0, Hesaplanamadı: 0 };
    let scoreSum = 0;
    let scoreCount = 0;
    let reliabilitySum = 0;

    const regionalData: Record<string, number> = {};

    const scoredProducers = producers.map(p => {
      const score = calculateAgriScore(p);
      const forecast = calculateForecast(p);
      const latestMilk = p.productionHistory.length ? p.productionHistory[p.productionHistory.length - 1].totalLiters : 0;
      
      let projected3m = 0;
      if (forecast.predictions.length >= 3) {
        projected3m = forecast.predictions[0].predictedLiters + forecast.predictions[1].predictedLiters + forecast.predictions[2].predictedLiters;
      }

      totalMilk += latestMilk;
      projectedTotalMilk3Months += projected3m;
      totalLoanReq += p.financials.requestedLoanAmount;
      if (score.riskLevel === null) {
        riskCounts.Hesaplanamadı++;
      } else {
        riskCounts[score.riskLevel]++;
      }
      if (score.overallScore !== null) {
        scoreSum += score.overallScore;
        scoreCount++;
      }
      reliabilitySum += score.reliabilityResult.score;

      // Regional grouping (e.g., "Bursa / Karacabey" -> "Bursa")
      const province = p.location.split(' / ')[0];
      if (regionalData[province]) {
         regionalData[province]++;
      } else {
         regionalData[province] = 1;
      }

      return { ...p, score, forecast };
    });

    // Sort by risk (highest risk first -> lowest score)
    const riskyProducers = [...scoredProducers]
      .sort(
        (a, b) =>
          (a.score.overallScore ?? Number.NEGATIVE_INFINITY)
          - (b.score.overallScore ?? Number.NEGATIVE_INFINITY)
      )
      .slice(0, 3);

    // Low reliability
    const lowReliabilityProducers = [...scoredProducers]
      .filter(p => p.score.reliabilityResult.score < 80)
      .sort((a, b) => a.score.reliabilityResult.score - b.score.reliabilityResult.score)
      .slice(0, 3);

    const priorityCandidates = [...scoredProducers]
      .filter(p =>
        p.score.riskLevel !== null
        && p.score.riskLevel !== 'Yüksek'
        && p.score.reliabilityResult.score >= 80
        && p.financials.requestedLoanAmount >= 500000
      )
      .sort((a, b) => b.financials.requestedLoanAmount - a.financials.requestedLoanAmount)
      .slice(0, 3);

    const regionChartData = Object.keys(regionalData).map(key => ({
      name: key,
      count: regionalData[key]
    })).sort((a, b) => b.count - a.count);

    return {
      totalProducers: producers.length,
      avgScore: scoreCount ? Math.round(scoreSum / scoreCount) : null,
      avgReliability: Math.round(reliabilitySum / producers.length),
      totalMilk,
      projectedTotalMilk3Months,
      totalLoanReq,
      riskCounts,
      riskyProducers,
      lowReliabilityProducers,
      scoredProducers,
      priorityCandidates,
      regionChartData
    };
  }, []);

  const priorityCandidates = useMemo(() => {
    let minScore = 65; // Dengeli
    if (policyLevel === 1) minScore = 80; // Temkinli
    if (policyLevel === 3) minScore = 50; // Büyüme

    return [...stats.scoredProducers]
      .filter(p =>
        p.score.overallScore !== null
        && p.score.overallScore >= minScore
        && p.financials.requestedLoanAmount >= 500000
      )
      .sort((a, b) => b.financials.requestedLoanAmount - a.financials.requestedLoanAmount);
  }, [stats.scoredProducers, policyLevel]);

  const getPolicyLabel = (level: number) => {
    if (level === 1) return "Temkinli (Düşük Risk)";
    if (level === 2) return "Dengeli (Standart)";
    return "Büyüme (Yüksek Risk)";
  };

  const openScenario = (type: PortfolioStressType) => {
    setShockScenario(calculatePortfolioStress(producers, type));
  };

  const pieData = [
    { name: 'Düşük Risk', value: stats.riskCounts['Düşük'], color: '#22c55e' },
    { name: 'Orta Risk', value: stats.riskCounts['Orta'], color: '#eab308' },  
    { name: 'Yüksek Risk', value: stats.riskCounts['Yüksek'], color: '#ef4444' },
    { name: 'Eksik Bilgi', value: stats.riskCounts.Hesaplanamadı, color: '#94a3b8' },
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('tr-TR').format(Math.round(val));

  return (
    <div className="tour-dashboard space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-fin-900">Kurumsal Portföy Özeti</h2>
          <p className="text-slate-500">Üretim, finansman, risk ve belge durumunun tek bakışta özeti.</p>
          <p className="text-xs font-medium text-amber-700 mt-2">
            {DATASET_PROVENANCE.label}: {DATASET_PROVENANCE.description}
          </p>
        </div>
        <Link to="/review-guide" className="bg-agri-600 hover:bg-agri-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm flex items-center transition-colors">
          Kullanım Rehberi <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <OfficialMarketContext />

      {/* Risk and analysis flow */}
      <div className="bg-gradient-to-r from-slate-900 to-fin-900 rounded-xl p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-[10px] font-bold text-agri-400 uppercase tracking-widest">Risk ve Analiz</div>
            <h3 className="text-lg font-bold mt-1 flex items-center">
              <BrainCircuit className="w-5 h-5 mr-2 text-agri-400"/>
              Dosya Değerlendirmelerini İnceleyin
            </h3>
          </div>
          <Link
            to="/institution/decision-room/P008"
            className="inline-flex items-center justify-center rounded-lg bg-agri-500 hover:bg-agri-400 text-fin-900 px-4 py-2.5 font-bold"
          >
            Risk ve Analizi Aç
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 border border-white/10">
            <div className="text-agri-400 font-bold mb-1">1 — İşletme Kayıtları</div>
            <p className="text-sm text-slate-300">Üretim, finansman, sürü ve belge kayıtlarını güncel pazar göstergeleriyle birlikte görün.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-white/10">
            <div className="text-agri-400 font-bold mb-1">2 — Değerlendirme Alanları</div>
            <p className="text-sm text-slate-300">Belge güveni, finansal görünüm, değişen koşullara dayanıklılık ve destek hazırlığını birlikte inceleyin.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-white/10">
            <div className="text-agri-400 font-bold mb-1">3 — Kayıtlı Özet</div>
            <p className="text-sm text-slate-300">Son değerlendirmeyi kaydedin ve aynı işletmenin önceki sonucuyla karşılaştırın.</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="tour-kpi-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center">
          <div className="w-11 h-11 rounded-xl bg-blue-50/80 flex items-center justify-center text-blue-600 mr-3.5 flex-shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Toplam Üretici</p>
            <p className="text-xl font-bold text-fin-900 mt-0.5">{stats.totalProducers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center">
          <div className="w-11 h-11 rounded-xl bg-purple-50/80 flex items-center justify-center text-purple-600 mr-3.5 flex-shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Ortalama Skor</p>
            <p className="text-xl font-bold text-fin-900 mt-0.5">
              {stats.avgScore ?? '—'} {stats.avgScore !== null && <span className="text-xs font-normal text-slate-400">/ 100</span>}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center">
          <div className="w-11 h-11 rounded-xl bg-green-50/80 flex items-center justify-center text-green-600 mr-3.5 flex-shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Toplam Kredi Talebi</p>
            <p className="text-xl font-bold text-fin-900 mt-0.5">{formatCurrency(stats.totalLoanReq)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center">
          <div className="w-11 h-11 rounded-xl bg-slate-100/80 flex items-center justify-center text-slate-600 mr-3.5 flex-shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Ortalama Veri Güvenilirliği</p>
            <p className="text-xl font-bold text-fin-900 mt-0.5">%{stats.avgReliability}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 2 - Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-agri-50/60 rounded-xl p-5 border border-agri-200/60 shadow-sm flex items-center">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-agri-600 mr-3.5 shadow-xs flex-shrink-0">
            <Milk className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-agri-800 font-medium">Güncel Aylık Toplam Üretim</p>
            <p className="text-xl font-bold text-agri-950 mt-0.5">{formatNumber(stats.totalMilk)} Litre</p>
          </div>
        </div>

        <div className="bg-blue-50/60 rounded-xl p-5 border border-blue-200/60 shadow-sm flex items-center">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-blue-600 mr-3.5 shadow-xs flex-shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-blue-800 font-medium">Öngörülen Üretim (Gelecek 3 Ay)</p>
            <p className="text-xl font-bold text-blue-950 mt-0.5">{formatNumber(stats.projectedTotalMilk3Months)} Litre</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Distribution Chart */}
        <div className="tour-risk-chart bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-fin-900 mb-3 flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-orange-500"/> Risk Dağılımı</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center text-xs">
                <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-600 font-medium">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Portfolio Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm lg:col-span-2">
          <h3 className="text-base font-bold text-fin-900 mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2 text-agri-600"/> Bölgesel Portföy Görünümü</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={stats.regionChartData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} name="Üretici Sayısı" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Policy Simulator */}
        <div className="tour-simulation bg-gradient-to-br from-fin-900 to-slate-800 rounded-xl p-5 text-white shadow-sm border border-fin-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">KARŞILAŞTIRMA</div>
          <h3 className="text-base font-bold mb-1.5 flex items-center"><ShieldAlert className="w-4 h-4 mr-2 text-agri-400"/> İnceleme Önceliği</h3>
          <p className="text-xs text-slate-300 mb-5">Temkinli, dengeli veya büyüme odaklı yaklaşıma göre öncelikli dosyaları görün.</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-200">Mevcut Politika: {getPolicyLabel(policyLevel)}</span>
                <span className="text-agri-400 font-bold">Öncelikli: {priorityCandidates.length} Aday</span>
              </div>
              <input type="range" min="1" max="3" value={policyLevel} onChange={(e) => setPolicyLevel(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-agri-500" />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Temkinli (Düşük Risk)</span>
                <span>Büyüme (Yüksek Risk)</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg border border-white/10 text-xs text-slate-200 leading-relaxed">
              * Bu bir simülasyondur. Gerçek kredi onay süreçleri kurum politikalarına ve BDDK kurallarına tabidir.
            </div>
          </div>
        </div>

        {/* Portfolio Stress Test */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">DEĞİŞEN KOŞULLAR</div>
          <h3 className="text-base font-bold text-fin-900 mb-1.5 flex items-center"><Activity className="w-4 h-4 mr-2 text-orange-500"/> Portföy Dayanıklılığı</h3>
          <p className="text-xs text-slate-500 mb-4">Süt geliri, yem gideri veya sürü sağlığı değiştiğinde portföyün görünümü.</p>
          
          <div className="space-y-2.5">
            <button onClick={() => openScenario('feed20')} className="w-full flex items-center justify-between p-3 border border-slate-200/80 rounded-lg hover:bg-slate-50 transition-colors text-left">
              <span className="text-xs font-medium text-slate-700">Yem Maliyetleri %20 Artarsa</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button onClick={() => openScenario('milk10')} className="w-full flex items-center justify-between p-3 border border-slate-200/80 rounded-lg hover:bg-slate-50 transition-colors text-left">
              <span className="text-xs font-medium text-slate-700">Çiğ Süt Fiyatı %10 Düşerse</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button onClick={() => openScenario('disease15')} className="w-full flex items-center justify-between p-3 border border-slate-200/80 rounded-lg hover:bg-slate-50 transition-colors text-left">
              <span className="text-xs font-medium text-slate-700">Sürü Sağlığı Şoku Varsayımı</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {shockScenario && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
                <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-start">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-orange-600 mr-2" />
                    <h4 className="font-bold text-orange-900 text-base">{shockScenario.title}</h4>
                  </div>
                  <button onClick={() => setShockScenario(null)} className="text-orange-400 hover:text-orange-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-600 mb-4 pb-3 border-b border-slate-100 leading-relaxed">{shockScenario.desc}</p>
                  <h5 className="font-bold text-slate-800 mb-2.5 text-xs uppercase tracking-wider">Karşılaştırma Sonuçları:</h5>
                  <ul className="space-y-2.5">
                    {shockScenario.impacts.map((impact, idx) => (
                      <li key={idx} className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-700">{impact}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setShockScenario(null)} className="mt-5 w-full py-2.5 bg-fin-900 text-white rounded-lg hover:bg-fin-800 transition-colors text-xs font-bold">
                    Anladım, Kapat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Priority Candidates Table */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-1.5">
             <h3 className="text-base font-bold text-fin-900">Öncelikli İncelenebilecek Adaylar</h3>
             <Link to="/institution/producers" className="text-xs text-agri-600 hover:text-agri-700 font-bold">Tümünü Gör</Link>
          </div>
          <p className="text-xs text-slate-500 mb-4">Yüksek kredi talebi, güvenilir veri ve düşük/orta riskli profiller.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="pb-2.5 font-bold">Üretici</th>
                  <th className="pb-2.5 font-bold">Talep / Skor</th>
                  <th className="pb-2.5 font-bold text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {priorityCandidates.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-semibold text-fin-900">{p.name}</td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="text-fin-900 font-bold">{formatCurrency(p.financials.requestedLoanAmount)}</span>
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 w-max border border-blue-100">
                          Skor: {p.score.overallScore} ({p.score.riskLevel})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/institution/producers/${p.id}`} className="text-blue-600 hover:text-blue-800 font-bold">
                        İncele
                      </Link>
                    </td>
                  </tr>
                ))}
                {priorityCandidates.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-slate-500">
                      Şu an için öncelikli inceleme adayı bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Reliability Table */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-1.5">
             <h3 className="text-base font-bold text-fin-900">Veri Güvenilirliği Düşük Profiller</h3>
             <Link to="/institution/producers" className="text-xs text-agri-600 hover:text-agri-700 font-bold">Tümünü Gör</Link>
          </div>
          <p className="text-xs text-slate-500 mb-4">Eksik doğrulama veya güncelleme gerektiren dosyalar.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="pb-2.5 font-bold">Üretici</th>
                  <th className="pb-2.5 font-bold">Güvenilirlik</th>
                  <th className="pb-2.5 font-bold text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {stats.lowReliabilityProducers.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-semibold text-fin-900">{p.name}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                        %{p.score.reliabilityResult.score}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/institution/producers/${p.id}`} className="text-blue-600 hover:text-blue-800 font-bold">
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
                {stats.lowReliabilityProducers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-slate-500">
                      Tüm üreticilerin veri güvenilirliği yüksek seviyede.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Opportunities Banner */}
      <div className="bg-gradient-to-r from-agri-50/80 to-white rounded-xl p-5 border border-agri-200/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-agri-950 mb-0.5">Destek & Fırsatlar Merkezi</h3>
          <p className="text-xs text-slate-600">Üretici kayıtlarını örnek hibe, teşvik ve faiz desteği koşullarıyla karşılaştırın.</p>
        </div>
        <Link to="/institution/opportunities" className="bg-white border border-agri-200 text-agri-700 hover:bg-agri-50 px-4 py-2 rounded-lg font-bold text-xs shadow-xs flex items-center transition-colors whitespace-nowrap">
          Fırsatları Görüntüle <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;
