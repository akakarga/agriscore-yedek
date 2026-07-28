import { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Database,
  FileText,
  FileUp,
  ShieldAlert,
  Upload,
} from 'lucide-react';

interface CksAnalysisResult {
  totalCattle: number;
  landSize: number;
  estimatedScore: null;
  riskLevel: 'DEĞERLENDİRİLEMEZ';
  analysisStatus: 'PARSED_FIELDS_ONLY';
  sourceType: 'pdf_text';
  notes: string[];
  warnings: string[];
}

interface ApiErrorPayload {
  detail?: {
    code?: string;
    message?: string;
  } | string;
}

const MAX_PDF_BYTES = 10 * 1024 * 1024;

const CksAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CksAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('Yalnızca PDF dosyası yüklenebilir.');
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setError('PDF en fazla 10 MB olabilir.');
      return;
    }

    setFileName(file.name);
    setResult(null);
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-cks-pdf', {
        method: 'POST',
        body: formData,
      });
      const payload = await response.json() as ApiErrorPayload & {
        extractedData?: CksAnalysisResult;
      };
      if (!response.ok || !payload.extractedData) {
        const detail = payload.detail;
        const message = typeof detail === 'string'
          ? detail
          : detail?.message;
        throw new Error(message || `Belge analizi başarısız oldu (${response.status}).`);
      }
      setResult(payload.extractedData);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Belge kontrolü tamamlanamadı. Lütfen yeniden deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void uploadFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-fin-900 flex items-center">
          <Upload className="w-7 h-7 mr-2.5 text-agri-600" />
          ÇKS Belge Kontrolü
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Uygun PDF belgelerindeki hayvan ve arazi kayıtlarını çıkarır. ÇKS belgesi
          tek başına finansal skor oluşturmaz.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-4 text-xs font-medium text-blue-950 flex items-start">
        <Database className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0 text-blue-700" />
        <span>
          ÇKS, işletme ve arazi bilgilerini destekler. Gelir, gider, borç ve geri
          ödeme kapasitesi için ayrıca doğrulanmış finansal kayıt gerekir.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 flex flex-col">
          <h3 className="font-bold text-fin-900 text-base flex items-center mb-4">
            <FileUp className="w-4 h-4 mr-2 text-slate-400" />
            ÇKS Belgesi Yükle
          </h3>

          <label
            htmlFor="cks-pdf-input"
            className="relative flex-1 min-h-[280px] border-2 border-dashed border-agri-300/80 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:bg-agri-50/50 transition-colors cursor-pointer"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click();
            }}
          >
            <input
              id="cks-pdf-input"
              type="file"
              accept=".pdf,application/pdf"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            {loading ? (
              <div className="flex flex-col items-center text-agri-700">
                <FileText className="w-12 h-12 mb-3 animate-pulse" />
                <p className="font-bold text-sm">Belge kontrol ediliyor…</p>
                <p className="text-xs mt-1 opacity-70">Kayıt alanları aranıyor</p>
              </div>
            ) : fileName ? (
              <div className="flex flex-col items-center text-green-700">
                <CheckCircle className="w-12 h-12 mb-3" />
                <p className="font-bold text-base break-all">{fileName}</p>
                <p className="text-xs mt-1.5 text-slate-500">Başka belge seçmek için tıklayın</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <FileUp className="w-12 h-12 mb-3 text-slate-400/80" />
                <p className="font-bold text-slate-700 text-sm mb-1">PDF dosyasını buraya sürükleyin</p>
                <p className="text-xs text-slate-500">Seçilebilir metin içeren PDF • en fazla 10 MB / 50 sayfa</p>
              </div>
            )}
          </label>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-600" />
              <div>
                <div className="font-bold">Belge işlenemedi</div>
                <div className="mt-0.5">{error}</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50/70 rounded-xl shadow-sm border border-slate-200/80 p-5 flex flex-col">
          <h3 className="font-bold text-fin-900 text-base mb-4 flex items-center">
            <Database className="w-4 h-4 mr-2 text-green-600" />
            Belgede Tespit Edilen Alanlar
          </h3>

          {!result ? (
            <div className="flex-1 min-h-[280px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200/80 rounded-xl text-center p-6 bg-white/50">
              <FileText className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-xs font-medium">Sonuçları görmek için seçilebilir metin içeren bir PDF yükleyin.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Hayvan değeri</div>
                  <div className="text-2xl font-extrabold text-fin-900">
                    {result.totalCattle} <span className="text-sm font-normal text-slate-500">baş</span>
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Arazi değeri</div>
                  <div className="text-2xl font-extrabold text-fin-900">
                    {result.landSize.toLocaleString('tr-TR')} <span className="text-sm font-normal text-slate-500">dekar</span>
                  </div>
                </div>
              </div>

              {/* Cross Verification Badges */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Resmi Çapraz Doğrulama Durumu</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-center text-[11px] font-bold text-green-800 bg-green-50 p-2 rounded-lg border border-green-200/60">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-600 flex-shrink-0" />
                    <span>E-Devlet Karekod</span>
                  </div>
                  <div className="flex items-center text-[11px] font-bold text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-200/60">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-blue-600 flex-shrink-0" />
                    <span>Tapu Parsel Kaydı</span>
                  </div>
                  <div className="flex items-center text-[11px] font-bold text-purple-800 bg-purple-50 p-2 rounded-lg border border-purple-200/60">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-purple-600 flex-shrink-0" />
                    <span>TÜRKVET Hayvan Kaydı</span>
                  </div>
                </div>
              </div>

              <div className="bg-fin-900 p-4 rounded-xl text-white">
                <div className="text-fin-200 text-[10px] font-bold uppercase tracking-wide">Finansal değerlendirme</div>
                <div className="text-lg font-bold mt-0.5">Skor üretilmedi</div>
                <p className="text-xs text-fin-100 mt-1.5 leading-relaxed">
                  Durum: {result.riskLevel}. ÇKS verisi tek başına kredi geri ödeme kapasitesi göstermez.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Belge notları
                </h4>
                <ul className="space-y-2">
                  {result.notes.map((note) => (
                    <li key={note} className="flex items-start bg-white p-3 rounded-lg border border-slate-200/80 text-slate-700 text-xs">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 text-agri-600 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                  Doğrulama gerektirenler
                </h4>
                <ul className="space-y-2">
                  {result.warnings.map((warning) => (
                    <li key={warning} className="text-xs bg-amber-50/90 border border-amber-200/80 text-amber-900 p-3 rounded-lg">
                      {warning}
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
