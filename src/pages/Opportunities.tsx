import { useState, useMemo } from 'react';
import { opportunities, producers } from '../data/seedData';
import { calculateOpportunityMatch } from '../services/opportunityEngine';
import { Search, Filter, ArrowRight, GraduationCap, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router';

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Hepsi');

  const portfolioMatches = useMemo(() => {
    const matches: any[] = [];
    
    opportunities.forEach(opportunity => {
      // Find all producers that match this opportunity
      const matchedProducers = producers.map(p => {
        return {
          producer: p,
          matchResult: calculateOpportunityMatch(p, opportunity)
        };
      }).filter(m => m.matchResult.matchScore >= 50) // Only show potential matches
        .sort((a, b) => b.matchResult.matchScore - a.matchResult.matchScore);

      if (matchedProducers.length > 0) {
        matches.push({
          opportunity,
          producers: matchedProducers
        });
      }
    });
    
    return matches;
  }, []);

  const filteredMatches = portfolioMatches.filter(m => {
    const matchesSearch = m.opportunity.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Hepsi' || m.opportunity.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-fin-900">Destek & Fırsatlar Merkezi</h2>
          <p className="text-slate-500 text-sm mt-1">Portföyünüzdeki işletme kayıtlarıyla eşleşen örnek destek ve finansman programları.</p>
        </div>
      </div>

      <div className="bg-orange-50/80 border border-orange-200/70 rounded-xl p-4 mb-5">
        <p className="text-xs text-orange-900 font-medium flex items-start leading-relaxed">
          <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-orange-600" />
          <span>Bu programlar örnek çalışma alanına aittir. Güncel destekler ve başvuru şartları ilgili resmi kurumların duyurularından doğrulanmalıdır.
          </span>
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Destek programı ara..." 
            className="w-full pl-9 pr-4 py-2 border border-slate-300/80 rounded-lg text-xs focus:ring-agri-500 focus:border-agri-500 text-fin-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select 
            className="w-full pl-9 pr-4 py-2 border border-slate-300/80 rounded-lg text-xs appearance-none bg-white focus:ring-agri-500 focus:border-agri-500 text-fin-900"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Hepsi">Tüm Tipler</option>
            <option value="Hibe">Hibe</option>
            <option value="Kredi">Kredi</option>
            <option value="Teşvik">Teşvik</option>
            <option value="Faiz Desteği">Faiz Desteği</option>
          </select>
        </div>
      </div>

      <div className="space-y-5">
        {filteredMatches.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 border-b border-slate-200/80 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start">
                <div className="bg-agri-100/80 p-2.5 rounded-lg mr-3.5 mt-0.5 flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-agri-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-fin-900">{item.opportunity.title}</h3>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <span className="bg-agri-100/80 text-agri-800 border border-agri-200/60 px-2 py-0.5 rounded text-[11px] font-bold">{item.opportunity.type}</span>
                    <span className="text-xs text-slate-500">{item.opportunity.sourceNote}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white px-3.5 py-1.5 rounded-lg border border-slate-200/80 text-center shadow-xs">
                <div className="text-[11px] text-slate-500 font-medium">Uygun Üretici</div>
                <div className="text-xl font-extrabold text-fin-900">{item.producers.length}</div>
              </div>
            </div>

            <div className="p-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Eşleşen Üreticiler</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                {item.producers.map((pMatch: any, pIdx: number) => (
                  <div key={pIdx} className="flex flex-col sm:flex-row items-center justify-between p-3.5 border border-slate-200/80 rounded-lg hover:bg-slate-50/80 transition-colors">
                    <div className="flex-1 min-w-0 w-full mb-2.5 sm:mb-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-fin-900 text-xs truncate pr-3">{pMatch.producer.name}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap ${
                          pMatch.matchResult.matchScore >= 75 ? 'bg-green-100/80 text-green-800 border border-green-200/60' :
                          pMatch.matchResult.matchScore >= 50 ? 'bg-amber-100/80 text-amber-900 border border-amber-200/60' : 'bg-red-100/80 text-red-800'
                        }`}>
                          %{pMatch.matchResult.matchScore} Uyum
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {pMatch.matchResult.reasonForRecommendation}
                      </div>
                    </div>
                    <Link to={`/institution/producers/${pMatch.producer.id}`} className="flex-shrink-0 ml-0 sm:ml-3 bg-white border border-slate-200/80 hover:bg-slate-50 text-agri-700 p-1.5 rounded-lg transition-colors shadow-xs">
                       <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredMatches.length === 0 && (
          <div className="bg-white p-10 rounded-xl border border-slate-200/80 text-center">
            <div className="bg-slate-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-fin-900 mb-1">Fırsat Bulunamadı</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Arama kriterlerinize uygun bir destek veya teşvik programı portföyünüzle eşleşmedi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
