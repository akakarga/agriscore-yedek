import { useState } from 'react';
import { Brain, FileText, CheckCircle, AlertTriangle, ChevronRight, Activity } from 'lucide-react';

const AiParser = () => {
  const [inputText, setInputText] = useState("Dün akşam çiftlikteki 3 ineğim hastalandı ve mastitis teşhisi kondu. Bu yüzden bu haftaki sütüm 200 litre düştü. Ayrıca yem fiyatları çok arttı, acil 15000 lira masraf etmem gerekti nakitim kalmadı.");
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleParse = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });
      const data = await res.json();
      setParsedData(data.parsedData);
    } catch (error) {
      alert("AI Sunucusuna bağlanılamadı. Python sunucusunun çalıştığından emin olun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-fin-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-600" />
            AI Veri Çıkarım Asistanı (NLP)
          </h2>
          <p className="text-slate-500 mt-1">Çiftçinin WhatsApp mesajını veya karmaşık veteriner notlarını akıllıca analiz edip sistem verisine dönüştürün.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Panel: Giriş */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-slate-400" />
              Serbest Metin / Mesaj Girişi
            </h3>
            <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">Simülasyon</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">Gerçek senaryoda bu veri WhatsApp entegrasyonu, Sesli Asistan veya belge fotoğrafı (OCR) ile otomatik gelecektir.</p>
          
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow text-slate-700"
            placeholder="Çiftçiden gelen mesajı buraya yapıştırın..."
          />
          
          <button 
            onClick={handleParse}
            disabled={loading || !inputText}
            className="mt-4 w-full flex items-center justify-center py-3 bg-fin-900 text-white rounded-lg hover:bg-fin-800 font-bold transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Yapay Zeka Analiz Ediyor...</span>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Sisteme Çevir ve Analiz Et
              </>
            )}
          </button>
        </div>

        {/* Sağ Panel: Çıktı */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute -right-10 -top-10 text-slate-200 opacity-50 pointer-events-none">
            <Activity className="w-48 h-48" />
          </div>

          <h3 className="font-bold text-slate-800 mb-6 flex items-center relative z-10">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Otomatik Çıkarılan Sistem Verisi (JSON)
          </h3>

          {!parsedData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Brain className="w-16 h-16 mb-4 opacity-50" />
              <p>Analiz için sol taraftaki butona basın.</p>
            </div>
          ) : (
            <div className="space-y-6 relative z-10 animate-fade-in">
              {/* Tespit Edilen Riskler */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Tespit Edilen Kredi Riskleri</h4>
                <ul className="space-y-2">
                  {parsedData.riskNotes.map((note: string, idx: number) => (
                    <li key={idx} className="flex items-start bg-white p-3 rounded-lg border border-red-100 text-red-800 shadow-sm">
                      <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 text-red-500" />
                      <span className="text-sm">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Acil Aksiyonlar */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Sistem Aksiyon Etiketleri</h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.detectedIssues.map((issue: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 bg-orange-100 text-orange-800 font-bold text-xs rounded-full border border-orange-200">
                      {issue}
                    </span>
                  ))}
                  {parsedData.detectedIssues.length === 0 && <span className="text-sm text-slate-500">Aksiyon gerektiren durum yok.</span>}
                </div>
              </div>

              {/* Finansal Etki */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Mali Tabloya Otomatik İşlenen Rakamlar</h4>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  {parsedData.financialImpact.detectedNumbers ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Saptanan Maliyet / Hacim Değerleri:</span>
                      <div className="flex gap-2">
                        {parsedData.financialImpact.detectedNumbers.map((num: string, idx: number) => (
                          <span key={idx} className="font-mono font-bold text-fin-900 bg-slate-100 px-2 py-1 rounded">{num}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">Metin içinde net bir rakam tespit edilmedi.</span>
                  )}
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">AI Güven Skoru: {parsedData.confidence}</span>
                <button className="text-sm font-bold text-purple-600 flex items-center hover:text-purple-800">
                  Kredi Skoruna Yansıt <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiParser;
