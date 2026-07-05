import { useMemo } from 'react';
import { producers } from '../data/seedData';
import { calculateAgriScore } from '../services/scoreEngine';
import { calculateForecast } from '../services/forecastEngine';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, AlertTriangle, TrendingUp, DollarSign, ShieldAlert, MapPin, Milk, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = useMemo(() => {
    let totalMilk = 0;
    let projectedTotalMilk3Months = 0;
    let totalLoanReq = 0;
    let riskCounts = { Düşük: 0, Orta: 0, Yüksek: 0 };
    let scoreSum = 0;
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
      riskCounts[score.riskLevel]++;
      scoreSum += score.overallScore;
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
      .sort((a, b) => a.score.overallScore - b.score.overallScore)
      .slice(0, 3);

    // Low reliability
    const lowReliabilityProducers = [...scoredProducers]
      .filter(p => p.score.reliabilityResult.score < 80)
      .sort((a, b) => a.score.reliabilityResult.score - b.score.reliabilityResult.score)
      .slice(0, 3);

    // Priority candidates: High loan, low/mid risk, high reliability
    const priorityCandidates = [...scoredProducers]
      .filter(p => p.score.riskLevel !== 'Yüksek' && p.score.reliabilityResult.score >= 80 && p.financials.requestedLoanAmount >= 500000)
      .sort((a, b) => b.financials.requestedLoanAmount - a.financials.requestedLoanAmount)
      .slice(0, 3);

    const regionChartData = Object.keys(regionalData).map(key => ({
      name: key,
      count: regionalData[key]
    })).sort((a, b) => b.count - a.count);

    return {
      totalProducers: producers.length,
      avgScore: Math.round(scoreSum / producers.length),
      avgReliability: Math.round(reliabilitySum / producers.length),
      totalMilk,
      projectedTotalMilk3Months,
      totalLoanReq,
      riskCounts,
      riskyProducers,
      lowReliabilityProducers,
      priorityCandidates,
      regionChartData
    };
  }, []);

  const pieData = [
    { name: 'Düşük Risk', value: stats.riskCounts['Düşük'], color: '#22c55e' },
    { name: 'Orta Risk', value: stats.riskCounts['Orta'], color: '#eab308' },  
    { name: 'Yüksek Risk', value: stats.riskCounts['Yüksek'], color: '#ef4444' }
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('tr-TR').format(Math.round(val));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-fin-900">Kurumsal Portföy Özeti</h2>
          <p className="text-slate-500">AgriScore Yapay Zeka destekli finansal karar destek paneli.</p>
        </div>
        <Link to="/review-guide" className="bg-agri-600 hover:bg-agri-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm flex items-center transition-colors">
          Platform İnceleme Rehberi <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Review Guide Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-fin-900 rounded-xl p-6 text-white shadow-md">
        <h3 className="text-lg font-bold mb-3 flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-agri-400"/> Sistemi 3 Adımda İnceleyin</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 border border-white/10">
            <div className="text-agri-400 font-bold mb-1">Adım 1: Portföyü Görün</div>
            <p className="text-sm text-slate-300">Şu an bulunduğunuz sayfada örnek portföy özetini inceleyin.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-white/10">
            <div className="text-agri-400 font-bold mb-1">Adım 2: Detayları ve Senaryoları Test Edin</div>
            <p className="text-sm text-slate-300">Aşağıdaki üreticilerden birine tıklayarak risk ve simülasyon hesaplamalarını görün.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-white/10">
            <div className="text-agri-400 font-bold mb-1">Adım 3: Kurumsal Rapor Alın</div>
            <p className="text-sm text-slate-300">Detay sayfasından veya menüden "Kurumsal Rapor" formatını test edin.</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Toplam Üretici</p>
            <p className="text-2xl font-bold text-fin-900">{stats.totalProducers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mr-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Ortalama Skor</p>
            <p className="text-2xl font-bold text-fin-900">{stats.avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Toplam Kredi Talebi</p>
            <p className="text-2xl font-bold text-fin-900">{formatCurrency(stats.totalLoanReq)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 mr-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Ortalama Veri Güvenilirliği</p>
            <p className="text-2xl font-bold text-fin-900">{stats.avgReliability}%</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 2 - Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-agri-50 rounded-xl p-6 border border-agri-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-agri-600 mr-4 shadow-sm">
            <Milk className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-agri-700 font-medium">Güncel Aylık Toplam Üretim</p>
            <p className="text-2xl font-bold text-agri-900">{formatNumber(stats.totalMilk)} Litre</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 mr-4 shadow-sm">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Öngörülen Üretim (Gelecek 3 Ay)</p>
            <p className="text-2xl font-bold text-blue-900">{formatNumber(stats.projectedTotalMilk3Months)} Litre</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-fin-900 mb-4 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-orange-500"/> Risk Dağılımı</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
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
          <div className="flex justify-center space-x-4 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-600">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Portfolio Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-fin-900 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-agri-600"/> Bölgesel Portföy Görünümü</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.regionChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} name="Üretici Sayısı" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Simulator */}
        <div className="bg-gradient-to-br from-fin-900 to-slate-800 rounded-xl p-6 text-white shadow-sm border border-fin-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">SİMÜLASYON</div>
          <h3 className="text-lg font-bold mb-2 flex items-center"><ShieldAlert className="w-5 h-5 mr-2 text-agri-400"/> Değerlendirme Politikası Simülatörü</h3>
          <p className="text-sm text-slate-300 mb-6">Risk iştahınıza göre portföy etkisini test edin. (Karar Destek)</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Mevcut Politika: Dengeli</span>
                <span className="text-agri-400 font-bold">Öncelikli: {stats.priorityCandidates.length} Aday</span>
              </div>
              <input type="range" min="1" max="3" defaultValue="2" className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer" disabled />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Temkinli (Düşük Risk)</span>
                <span>Büyüme (Yüksek Risk)</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg border border-white/10 text-sm text-slate-200">
              * Bu bir simülasyondur. Gerçek kredi onay süreçleri kurum politikalarına ve BDDK kurallarına tabidir.
            </div>
          </div>
        </div>

        {/* Portfolio Stress Test */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">STRES TESTİ</div>
          <h3 className="text-lg font-bold text-fin-900 mb-2 flex items-center"><Activity className="w-5 h-5 mr-2 text-orange-500"/> Makro Şok Senaryoları</h3>
          <p className="text-sm text-slate-500 mb-4">Süt/Yem fiyat dalgalanmalarının mevcut portföye etkisi.</p>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700">Yem Maliyetleri %20 Artarsa</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700">Çiğ Süt Fiyatı %10 Düşerse</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700">Ulusal Hastalık (Şap) Senaryosu</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Candidates Table */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-fin-900">Finans Kurumu Tarafından Öncelikli İncelenebilecek Adaylar</h3>
             <Link to="/institution/producers" className="text-sm text-agri-600 hover:text-agri-700 font-medium">Tümünü Gör</Link>
          </div>
          <p className="text-xs text-slate-500 mb-4">Yüksek kredi talebi, güvenilir veri ve düşük/orta riskli profiller.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Üretici</th>
                  <th className="pb-3 font-medium">Talep / Skor</th>
                  <th className="pb-3 font-medium text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.priorityCandidates.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 font-medium text-fin-900">{p.name}</td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="text-fin-900 font-medium">{formatCurrency(p.financials.requestedLoanAmount)}</span>
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 w-max">
                          Skor: {p.score.overallScore} ({p.score.riskLevel})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/institution/producers/${p.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        İncele
                      </Link>
                    </td>
                  </tr>
                ))}
                {stats.priorityCandidates.length === 0 && (
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
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-fin-900">Veri Güvenilirliği Düşük</h3>
             <Link to="/institution/producers" className="text-sm text-agri-600 hover:text-agri-700 font-medium">Tümünü Gör</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Üretici</th>
                  <th className="pb-3 font-medium">Güvenilirlik</th>
                  <th className="pb-3 font-medium text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.lowReliabilityProducers.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 font-medium text-fin-900">{p.name}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        {p.score.reliabilityResult.score}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/institution/producers/${p.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
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
      <div className="bg-gradient-to-r from-agri-50 to-white rounded-xl p-6 border border-agri-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-agri-900 mb-1">Destek & Fırsatlar Merkezi</h3>
          <p className="text-sm text-slate-600">Üreticilerinize uygun hibe, teşvik ve faiz desteklerini yapay zeka ile eşleştirin.</p>
        </div>
        <Link to="/institution/opportunities" className="bg-white border border-agri-200 text-agri-700 hover:bg-agri-50 px-5 py-2 rounded-lg font-medium shadow-sm flex items-center transition-colors whitespace-nowrap">
          Fırsatları Görüntüle <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;
