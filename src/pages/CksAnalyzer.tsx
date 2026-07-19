import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Brain, Target, ShieldAlert, FileUp } from 'lucide-react';

const CksAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("Lütfen sadece PDF formatında bir dosya yükleyin.");
      return;
    }

    setFileName(file.name);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-cks-pdf', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        throw new Error('Sunucu hatası');
      }

      const data = await res.json();
      setResult(data.extractedData);
    } catch (err) {
      alert("PDF Okuma Hatası. Python sunucusunun çalıştığından ve pypdf kütüphanesinin kurulu olduğundan emin olun.");
      setFileName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf' && fileInputRef.current) {
      // Create a DataTransfer object to assign the file to the input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      // Manually trigger the upload
      handleFileUpload({ target: { files: dataTransfer.files } } as any);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-fin-900 flex items-center">
          <Upload className="w-8 h-8 mr-3 text-agri-600" />
          Gerçek PDF ÇKS Belge Analizi
        </h2>
        <p className="text-slate-500 mt-1">Elindeki gerçek PDF ÇKS belgesini yükle. Sistem PDF'i metne çevirip otomatik okusun ve profili çıkarsın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sol: PDF Yükleme */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center">
              <FileUp className="w-5 h-5 mr-2 text-slate-400" />
              PDF Belge Yükle
            </h3>
          </div>
          
          <div 
            className="flex-1 min-h-[300px] border-2 border-dashed border-agri-300 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:bg-agri-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            
            {loading ? (
              <div className="flex flex-col items-center text-agri-600">
                <Brain className="w-16 h-16 mb-4 animate-pulse" />
                <p className="font-bold">Yapay Zeka PDF'i Okuyor...</p>
                <p className="text-sm mt-2 opacity-70">Lütfen bekleyin</p>
              </div>
            ) : fileName ? (
              <div className="flex flex-col items-center text-green-600">
                <CheckCircle className="w-16 h-16 mb-4" />
                <p className="font-bold text-lg">{fileName}</p>
                <p className="text-sm mt-2 opacity-70 text-slate-500">Yeni belge yüklemek için tıklayın</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <FileUp className="w-16 h-16 mb-4" />
                <p className="font-bold text-slate-600 mb-1">PDF Dosyasını Buraya Sürükleyin</p>
                <p className="text-sm">Veya bilgisayardan seçmek için tıklayın</p>
              </div>
            )}
          </div>
        </div>

        {/* Sağ: Analiz Sonucu */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Otomatik Oluşturulan Çiftçi Profili
           </h3>

           {!result ? (
             <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                <FileText className="w-16 h-16 mb-4 opacity-30" />
                <p>Analiz için sol taraftan PDF belgesi yükleyin.</p>
             </div>
           ) : (
             <div className="space-y-6 animate-fade-in">
               
               {/* Bulunan Veriler */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <div className="text-xs text-slate-500 uppercase font-bold mb-1">Tespit Edilen Hayvan</div>
                   <div className="text-3xl font-extrabold text-fin-900">{result.totalCattle} <span className="text-lg font-normal text-slate-500">baş</span></div>
                 </div>
                 <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <div className="text-xs text-slate-500 uppercase font-bold mb-1">Tespit Edilen Arazi</div>
                   <div className="text-3xl font-extrabold text-fin-900">{result.landSize} <span className="text-lg font-normal text-slate-500">dekar</span></div>
                 </div>
               </div>

               {/* Skor ve Risk */}
               <div className="bg-gradient-to-r from-fin-900 to-fin-800 p-6 rounded-xl text-white shadow-md relative overflow-hidden">
                 <div className="flex justify-between items-end relative z-10">
                   <div>
                     <div className="text-fin-100 text-sm font-medium mb-1">Tahmini AgriScore Skoru</div>
                     <div className="text-5xl font-extrabold text-white">{result.estimatedScore}</div>
                   </div>
                   <div className="text-right">
                     <div className="text-fin-100 text-sm font-medium mb-1">Sistem Risk Seviyesi</div>
                     <div className={`text-xl font-bold px-3 py-1 rounded ${
                       result.estimatedScore >= 75 ? 'bg-green-500 text-white' : 
                       result.estimatedScore >= 50 ? 'bg-yellow-500 text-yellow-900' : 'bg-red-500 text-white'
                     }`}>
                       {result.riskLevel}
                     </div>
                   </div>
                 </div>
                 <Brain className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
               </div>

               {/* AI Notları */}
               <div>
                 <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                   <ShieldAlert className="w-4 h-4 mr-1" />
                   AI Çıkarım Notları
                 </h4>
                 <ul className="space-y-2">
                   {result.notes.map((note: string, idx: number) => (
                     <li key={idx} className="flex items-start bg-white p-3 rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                       <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 text-agri-500" />
                       <span className="text-sm">{note}</span>
                     </li>
                   ))}
                 </ul>
               </div>

             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default CksAnalyzer;
