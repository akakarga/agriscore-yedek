import { useState, useMemo } from 'react';
import { opportunities, producers } from '../data/seedData';
import { calculateOpportunityMatch } from '../services/opportunityEngine';
import { Search, Filter, ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          <p className="text-slate-500">Portföyünüzdeki üreticiler için yapay zeka destekli hibe ve teşvik eşleştirmeleri.</p>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-orange-800 font-medium">
          ⚠️ Destek ve başvuru şartları resmi kaynaklardan doğrulanmalıdır. Bu ekran karar destek amaçlıdır.
          Bu fırsatlar yarışma teslim sürümü için senaryolaştırılmış örnek fırsatlardır.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Destek programı ara..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-agri-500 focus:border-agri-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg appearance-none bg-white focus:ring-agri-500 focus:border-agri-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Hepsi">Tüm Tipler</option>
            <option value="Hibe">Hibe</option>
            <option value="Sübvansiyonlu Kredi">Sübvansiyonlu Kredi</option>
            <option value="Faiz İndirimi">Faiz İndirimi</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredMatches.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start">
                <div className="bg-agri-100 p-3 rounded-lg mr-4 mt-1">
                  <GraduationCap className="w-6 h-6 text-agri-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-fin-900">{item.opportunity.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-agri-100 text-agri-800 px-2 py-0.5 rounded text-xs font-medium">{item.opportunity.type}</span>
                    <span className="text-xs text-slate-500">{item.opportunity.sourceNote}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-center">
                <div className="text-sm text-slate-500 font-medium mb-1">Uygun Üretici</div>
                <div className="text-2xl font-bold text-fin-900">{item.producers.length}</div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Eşleşen Üreticiler (Skora Göre)</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {item.producers.map((pMatch: any, pIdx: number) => (
                  <div key={pIdx} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0 w-full mb-3 sm:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-fin-900 truncate pr-4">{pMatch.producer.name}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                          pMatch.matchResult.matchScore >= 75 ? 'bg-green-100 text-green-800' :
                          pMatch.matchResult.matchScore >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          %{pMatch.matchResult.matchScore} Uyum
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {pMatch.matchResult.reasonForRecommendation}
                      </div>
                    </div>
                    <Link to={`/institution/producers/${pMatch.producer.id}`} className="flex-shrink-0 ml-0 sm:ml-4 bg-white border border-slate-200 hover:bg-slate-50 text-agri-700 p-2 rounded-lg transition-colors">
                       <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredMatches.length === 0 && (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-fin-900 mb-2">Fırsat Bulunamadı</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Arama kriterlerinize uygun bir destek veya teşvik programı portföyünüzle eşleşmedi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
