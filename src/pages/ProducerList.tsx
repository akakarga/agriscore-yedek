import { useState } from 'react';
import { Link } from 'react-router';
import { producers } from '../data/seedData';
import { calculateAgriScore } from '../services/scoreEngine';
import { calculateForecast } from '../services/forecastEngine';
import { Search, Filter, ChevronRight, ShieldAlert } from 'lucide-react';
import type { RiskLevel } from '../types';

const ProducerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'Eksik Bilgi' | 'Tümü'>('Tümü');
  const [reliabilityFilter, setReliabilityFilter] = useState<'Tümü' | 'Yüksek' | 'Düşük'>('Tümü');

  const processedProducers = producers.map(p => {
    const score = calculateAgriScore(p);
    const forecast = calculateForecast(p);
    const latestMilk = p.productionHistory.length ? p.productionHistory[p.productionHistory.length - 1].totalLiters : 0;
    const nextMonthProjected = forecast.predictions.length ? forecast.predictions[0].predictedLiters : 0;
    
    return {
      ...p,
      score,
      latestMilk,
      nextMonthProjected
    };
  });

  const filteredProducers = processedProducers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'Tümü'
      || (riskFilter === 'Eksik Bilgi'
        ? p.score.riskLevel === null
        : p.score.riskLevel === riskFilter);
    
    let matchesReliability = true;
    if (reliabilityFilter === 'Yüksek') matchesReliability = p.score.reliabilityResult.score >= 80;
    if (reliabilityFilter === 'Düşük') matchesReliability = p.score.reliabilityResult.score < 80;

    return matchesSearch && matchesRisk && matchesReliability;
  });

  const getRiskBadgeColor = (risk: RiskLevel | null) => {
    switch(risk) {
      case 'Düşük': return 'bg-green-100 text-green-800';
      case 'Orta': return 'bg-yellow-100 text-yellow-800';
      case 'Yüksek': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getReliabilityBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-slate-100 text-slate-700';
    if (score >= 50) return 'bg-orange-100 text-orange-800 border border-orange-200';
    return 'bg-red-100 text-red-800 border border-red-200';
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('tr-TR').format(Math.round(val));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-fin-900">Üreticiler</h2>
          <p className="text-slate-500">Portföydeki işletmelerin risk, belge ve finansman görünümü.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Üretici veya bölge ara..." 
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select 
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-500 appearance-none bg-white"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'Eksik Bilgi' | 'Tümü')}
            >
              <option value="Tümü">Tüm Risk Seviyeleri</option>
              <option value="Düşük">Düşük Risk</option>
              <option value="Orta">Orta Risk</option>
              <option value="Yüksek">Yüksek Risk</option>
              <option value="Eksik Bilgi">Eksik Bilgi</option>
            </select>
          </div>

          <div className="relative">
            <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select 
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-500 appearance-none bg-white"
              value={reliabilityFilter}
              onChange={(e) => setReliabilityFilter(e.target.value as 'Tümü' | 'Yüksek' | 'Düşük')}
            >
              <option value="Tümü">Tüm Veri Güvenilirliği</option>
              <option value="Yüksek">Yüksek Güvenilirlik (≥80)</option>
              <option value="Düşük">Eksik/Düşük Veri (&lt;80)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3.5">Üretici / İşletme</th>
                <th className="px-5 py-3.5">Bölge</th>
                <th className="px-5 py-3.5">Sürü (Sağmal / Toplam)</th>
                <th className="px-5 py-3.5">Aylık Süt / Öngörü</th>
                <th className="px-5 py-3.5">Kredi Talebi</th>
                <th className="px-5 py-3.5">AgriScore</th>
                <th className="px-5 py-3.5">Veri Güvenilirliği</th>
                <th className="px-5 py-3.5">Risk Seviyesi</th>
                <th className="px-5 py-3.5 text-right">Detay</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {filteredProducers.length > 0 ? (
                filteredProducers.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-fin-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.businessType}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{p.location}</td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">
                      {p.herd.milkingCows} / {p.herd.totalCattle}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-900 font-bold">{formatNumber(p.latestMilk)} L</div>
                      <div className="text-[11px] text-blue-600 font-medium flex items-center mt-0.5" title="Önümüzdeki Ay Beklenen">
                         &rarr; {formatNumber(p.nextMonthProjected)} L
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-fin-900">
                      {formatCurrency(p.financials.requestedLoanAmount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-base font-extrabold text-fin-900">
                        {p.score.overallScore ?? '—'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${getReliabilityBadgeColor(p.score.reliabilityResult.score)}`}>
                        %{p.score.reliabilityResult.score}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getRiskBadgeColor(p.score.riskLevel)}`}>
                        {p.score.riskLevel ?? 'Eksik Bilgi'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link to={`/institution/producers/${p.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold">
                        İncele <ChevronRight className="h-4 w-4 ml-0.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-slate-500">
                    Arama kriterlerine uygun üretici bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProducerList;
