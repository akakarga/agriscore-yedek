import { ExternalLink, Landmark } from 'lucide-react';
import { OFFICIAL_MARKET_CONTEXT } from '../data/officialMarketContext';

const OfficialMarketContext = () => (
  <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-4">
      <div>
        <h3 className="font-bold text-fin-900 flex items-center">
          <Landmark className="w-5 h-5 mr-2 text-agri-600" />
          Güncel Resmî Pazar Göstergeleri
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Son doğrulama {OFFICIAL_MARKET_CONTEXT.verifiedAt}
        </p>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 self-start">
        Risk skoruna doğrudan eklenmez
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {OFFICIAL_MARKET_CONTEXT.records.map((record) => (
        <a
          key={record.id}
          href={record.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="group border border-slate-200 rounded-lg p-4 hover:border-agri-300 hover:bg-agri-50/40 transition-colors"
        >
          <div className="text-xs text-slate-500">{record.label}</div>
          <div className="text-xl font-extrabold text-fin-900 mt-1">{record.value}</div>
          <div className="text-xs text-slate-500 mt-2">{record.period}</div>
          <div className="text-xs font-bold text-agri-700 mt-3 flex items-center">
            {record.sourceName}
            <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      ))}
    </div>

    <p className="text-xs text-slate-500 mt-4">
      Bu göstergeler piyasa bağlamıdır; üretici geliri veya resmi destek uygunluğu yerine geçmez.
    </p>
  </section>
);

export default OfficialMarketContext;
