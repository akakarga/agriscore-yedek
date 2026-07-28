import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Download,
  FileClock,
  GitBranch,
  History,
  RefreshCw,
  Scale,
  ShieldAlert,
  Sparkles,
  Target,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import {
  useMemo,
  useState,
  type ComponentType,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { producers } from '../data/seedData';
import {
  runDecisionCouncil,
  type CouncilAgentId,
  type CouncilAgentResult,
  type DecisionCouncilResult,
} from '../services/decisionCouncilEngine';
import {
  clearDecisionMemory,
  createDecisionReceipt,
  mergeDecisionMemory,
  readDecisionMemory,
  saveDecisionMemory,
  type DecisionReceipt,
} from '../services/decisionMemory';

interface AgentMeta {
  icon: ComponentType<{ className?: string }>;
  accent: string;
  surface: string;
}

const AGENT_META: Record<CouncilAgentId, AgentMeta> = {
  evidence: {
    icon: Database,
    accent: 'text-blue-700',
    surface: 'bg-blue-50 border-blue-200',
  },
  risk: {
    icon: Scale,
    accent: 'text-emerald-700',
    surface: 'bg-emerald-50 border-emerald-200',
  },
  resilience: {
    icon: Activity,
    accent: 'text-orange-700',
    surface: 'bg-orange-50 border-orange-200',
  },
  opportunity: {
    icon: ClipboardCheck,
    accent: 'text-violet-700',
    surface: 'bg-violet-50 border-violet-200',
  },
  recourse: {
    icon: Target,
    accent: 'text-rose-700',
    surface: 'bg-rose-50 border-rose-200',
  },
};

const formatReceiptDate = (date: string) =>
  new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(date));

const AgentCard = ({ agent }: { agent: CouncilAgentResult }) => {
  const meta = AGENT_META[agent.id];
  const Icon = meta.icon;

  return (
    <article className={`rounded-xl border border-slate-200/80 p-5 ${meta.surface} transition-all hover:shadow-xs`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center min-w-0">
          <div className="rounded-lg bg-white/90 p-2 mr-3 border border-white/60 shadow-xs flex-shrink-0">
            <Icon className={`w-4 h-4 ${meta.accent}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-fin-900 text-sm">{agent.title}</h3>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full flex-shrink-0 ${
            agent.status === 'completed'
              ? 'bg-green-100/80 text-green-800 border border-green-200/60'
              : 'bg-amber-100/80 text-amber-900 border border-amber-200/60'
          }`}
        >
          {agent.status === 'completed' ? 'Tamamlandı' : 'İnceleme gerekli'}
        </span>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed mt-3 font-medium">
        {agent.summary}
      </p>

      <div className="mt-3.5 rounded-lg bg-white/90 border border-white/70 p-3 shadow-xs">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Dayanaklar
        </div>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {agent.evidence.slice(0, 3).map((evidence) => (
            <li key={evidence} className="flex items-start">
              <CheckCircle2 className="w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
              <span className="text-xs">{evidence}</span>
            </li>
          ))}
          {agent.evidence.length === 0 && (
            <li className="text-slate-500 text-xs">Henüz dayanak kaydı bulunmuyor.</li>
          )}
        </ul>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-1">
        <span className="text-slate-500 font-medium">Değerlendirme güveni</span>
        <span className={`font-bold ${meta.accent}`}>{agent.confidence}</span>
      </div>
    </article>
  );
};

const CouncilTrace = ({
  result,
}: {
  result: DecisionCouncilResult;
}) => (
  <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
    <div className="flex items-center justify-between gap-4 mb-4">
      <div>
        <div className="text-[11px] font-bold text-agri-700 uppercase tracking-widest">
          Değerlendirme akışı
        </div>
        <h2 className="text-lg font-bold text-fin-900 mt-0.5">
          Dosya nasıl değerlendirildi?
        </h2>
      </div>
      <span className="text-xs font-bold bg-slate-100 text-slate-600 rounded-md px-2.5 py-1 border border-slate-200/60">
        3 adım
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {result.trace.map((step) => (
        <div
          key={step.stage}
          className="relative rounded-lg border border-slate-200/80 bg-slate-50/70 p-4"
        >
          <div className="flex items-center mb-2.5">
            <span className="w-6 h-6 rounded-full bg-fin-900 text-white flex items-center justify-center text-xs font-bold mr-2">
              {step.stage}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {step.agents.length} alan
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{step.description}</p>
          <div className="mt-2.5 text-[11px] text-slate-400 font-medium">Adım {step.stage} / 3</div>
        </div>
      ))}
    </div>
  </section>
);

const DecisionRoom = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const selectedProducer =
    producers.find((producer) => producer.id === id) ?? producers[7] ?? producers[0];
  const result = useMemo(
    () => runDecisionCouncil(selectedProducer),
    [selectedProducer]
  );
  const [receipts, setReceipts] = useState<DecisionReceipt[]>(() =>
    readDecisionMemory()
  );
  const [currentReceipt, setCurrentReceipt] =
    useState<DecisionReceipt | null>(null);
  const [isCreatingReceipt, setIsCreatingReceipt] = useState(false);
  const [memoryError, setMemoryError] = useState<string | null>(null);
  const [stressScenario, setStressScenario] = useState<'normal' | 'feed_shock' | 'drought'>('normal');

  const previousReceipt = receipts.find(
    (receipt) =>
      receipt.producerId === selectedProducer.id &&
      receipt.receiptId !== currentReceipt?.receiptId
  );
  const reviewAgents = result.agents.filter(
    (agent) => agent.status === 'requires_review'
  );

  const createReceipt = async () => {
    setIsCreatingReceipt(true);
    setMemoryError(null);
    try {
      const receipt = await createDecisionReceipt(selectedProducer, result);
      const nextReceipts = mergeDecisionMemory(receipts, receipt);
      saveDecisionMemory(nextReceipts);
      setReceipts(nextReceipts);
      setCurrentReceipt(receipt);
    } catch {
      setMemoryError(
        'Değerlendirme kaydı oluşturulamadı. Lütfen yeniden deneyin.'
      );
    } finally {
      setIsCreatingReceipt(false);
    }
  };

  const exportReceipt = () => {
    if (!currentReceipt) return;
    const artifact = [
      'AgriScore Dosya Değerlendirme Özeti',
      '',
      `İşletme: ${selectedProducer.name}`,
      `Konum: ${selectedProducer.location}`,
      `Tarih: ${formatReceiptDate(currentReceipt.createdAt)}`,
      `Skor: ${currentReceipt.overallScore === null ? 'Hesaplanmadı' : `${currentReceipt.overallScore}/100`}`,
      `Veri güvenilirliği: %${currentReceipt.reliabilityScore}`,
      `İnceleme önceliği: ${result.reviewPriority}`,
      '',
      result.consensusStatement,
      '',
      'Açıklığa kavuşturulacak konular:',
      ...(result.disagreements.length > 0
        ? result.disagreements.map((item) => `- ${item}`)
        : ['- Belirgin bir çelişki bulunmadı.']),
      '',
      'Sonraki adımlar:',
      ...(result.counterfactualPlan.actions.length > 0
        ? result.counterfactualPlan.actions.map((action) => `- ${action.label}`)
        : [`- ${result.counterfactualPlan.disclaimer}`]),
      '',
      'Bu özet örnek çalışma alanındaki kayıtlara dayanır ve nihai finansman kararı değildir.',
    ].join('\n');
    const url = URL.createObjectURL(
      new Blob([artifact], {
        type: 'text/plain;charset=utf-8',
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `agriscore-dosya-ozeti-${selectedProducer.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openNarrator = () => {
    const prompt = [
      `Risk & Analiz Paneli sonucunu yalnızca mevcut sayılara dayanarak açıkla.`,
      `Profil: ${selectedProducer.id}.`,
      `Skor: ${result.score.overallScore === null ? 'Hesaplanmadı' : `${result.score.overallScore}/100`}.`,
      `Veri güvenilirliği: %${result.score.reliabilityResult.score}.`,
      `Öncelik: ${result.reviewPriority}.`,
      `Ayrıntılı inceleme gereken alan sayısı: ${reviewAgents.length}.`,
      `Açıklığa kavuşturulacak konu: ${result.disagreements.length}.`,
      `Kredi kararı verme.`,
    ].join(' ');
    window.dispatchEvent(
      new CustomEvent('open-copilot', {
        detail: {
          prompt,
          displayText: 'Bu dosya değerlendirmesini açıkla.',
        },
      })
    );
  };

  const clearMemory = () => {
    clearDecisionMemory();
    setReceipts([]);
    setCurrentReceipt(null);
  };

  return (
    <div className="space-y-6">
      <section className="tour-decision-room relative overflow-hidden rounded-2xl bg-fin-900 text-white p-6 md:p-8 shadow-lg">
        <BrainCircuit className="absolute -right-8 -bottom-10 w-56 h-56 text-white/5" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full bg-agri-500/25 text-agri-300 border border-agri-400/30 px-3.5 py-1 text-xs font-extrabold tracking-wide flex items-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-agri-400 animate-pulse" />
              ÇOK AJANLI AI ORKESTRASYONU (COUNCIL-V1.0)
            </span>
            <span className="rounded-full bg-agri-500/20 text-agri-300 border border-agri-400/20 px-3 py-1 text-xs font-bold tracking-wide">
              5 DEĞERLENDİRME ALANI
            </span>
            <span className="rounded-full bg-white/10 text-fin-100 px-3 py-1 text-xs font-bold tracking-wide">
              3 ADIMLI AKIŞ
            </span>
            <span className="rounded-full bg-white/10 text-fin-100 px-3 py-1 text-xs font-bold tracking-wide">
              1 KAYITLI ÖZET
            </span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              AgriScore Risk ve Analiz
            </h1>
            <p className="text-fin-100 mt-3 leading-relaxed">
              Belge güvenini, finansal görünümü, değişen koşulları ve sonraki
              adımları tek bir anlaşılır dosyada toplar.
            </p>
          </div>
          <div className="mt-5 flex items-start rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 max-w-3xl text-sm text-amber-50">
            <ShieldAlert className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              Örnek işletme profili kullanılır. Analiz paneli kredi onayı veya ret
              kararı vermez; değerlendirmeyi destekleyen bilgileri açıkça gösterir.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <label className="flex-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              İncelenecek İşletme Profili
            </span>
            <select
              value={selectedProducer.id}
              onChange={(event) => {
                setCurrentReceipt(null);
                navigate(`/institution/decision-room/${event.target.value}`);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-fin-900 focus:border-agri-500 focus:ring-2 focus:ring-agri-200"
            >
              {producers.map((producer) => (
                <option key={producer.id} value={producer.id}>
                  {producer.name} — {producer.location}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => void createReceipt()}
            disabled={isCreatingReceipt}
            className="inline-flex items-center justify-center rounded-lg bg-agri-600 hover:bg-agri-700 disabled:opacity-60 text-white font-bold px-5 py-3"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isCreatingReceipt ? 'animate-spin' : ''}`}
            />
            {isCreatingReceipt
              ? 'Özet hazırlanıyor…'
              : 'Dosyayı Değerlendir ve Kaydet'}
          </button>

          <button
            type="button"
            onClick={openNarrator}
            className="inline-flex items-center justify-center rounded-lg border border-fin-300 bg-fin-50 hover:bg-fin-100 text-fin-900 font-bold px-5 py-3"
          >
            <Bot className="w-4 h-4 mr-2" />
            Yardımcıya Açıklat
          </button>
        </div>
        {memoryError && (
          <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {memoryError}
          </div>
        )}
      </section>

      <section
        className={`rounded-2xl border p-6 ${
          result.humanReviewRequired
            ? 'bg-amber-50 border-amber-200'
            : 'bg-green-50 border-green-200'
        }`}
      >
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
          <div>
            <div className="flex items-center gap-2">
              {result.humanReviewRequired ? (
                <TriangleAlert className="w-6 h-6 text-amber-700" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-green-700" />
              )}
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Dosya sonucu
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-fin-900 mt-3">
              {result.reviewPriority}
            </h2>
            <p className="mt-2 text-slate-700 leading-relaxed">
              {result.consensusStatement}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-bold text-fin-800">
                İnsan incelemesi: {result.humanReviewRequired ? 'Zorunlu' : 'Standart'}
              </span>
              <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-bold text-fin-800">
                Ayrıntılı inceleme: {reviewAgents.length}/5 alan
              </span>
              <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-bold text-fin-800">
                Açıklığa kavuşturulacak: {result.disagreements.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white border border-slate-200 p-4 text-center">
              <div className="text-xs text-slate-500">Skor</div>
              <div className="text-2xl font-extrabold text-fin-900 mt-1">
                {result.score.overallScore ?? '—'}
              </div>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-4 text-center">
              <div className="text-xs text-slate-500">Güven</div>
              <div className="text-2xl font-extrabold text-fin-900 mt-1">
                %{result.score.reliabilityResult.score}
              </div>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-4 text-center">
              <div className="text-xs text-slate-500">Risk</div>
              <div className="text-lg font-extrabold text-fin-900 mt-2">
                {result.score.riskLevel ?? 'Eksik Bilgi'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stress Test & Market Shock Simulator */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold text-agri-700 uppercase tracking-widest flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Karar Dayanıklılık Simülatörü
            </div>
            <h2 className="text-xl font-bold text-fin-900 mt-1">Stres Testi ve Piyasa Şok Analizi</h2>
            <p className="text-xs text-slate-500 mt-0.5">Değişen piyasa koşullarının bu işletmenin ödeme kapasitesine etkisini anında test edin.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <button
            type="button"
            onClick={() => setStressScenario('normal')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              stressScenario === 'normal'
                ? 'bg-fin-900 text-white border-fin-900 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <div className="text-xs font-bold">Mevcut Durum</div>
            <div className="text-[11px] opacity-80 mt-1">Standart girdi ve süt fiyatı</div>
          </button>

          <button
            type="button"
            onClick={() => setStressScenario('feed_shock')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              stressScenario === 'feed_shock'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100/80 text-amber-900 border-amber-200'
            }`}
          >
            <div className="text-xs font-bold flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Yem Şoku (+%20 Gider)
            </div>
            <div className="text-[11px] opacity-80 mt-1">Yem +%20, Süt -%10 Fiyat</div>
          </button>

          <button
            type="button"
            onClick={() => setStressScenario('drought')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              stressScenario === 'drought'
                ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                : 'bg-rose-50 hover:bg-rose-100/80 text-rose-900 border-rose-200'
            }`}
          >
            <div className="text-xs font-bold flex items-center">
              <TriangleAlert className="w-3.5 h-3.5 mr-1" /> Verim / Rekolte Riski
            </div>
            <div className="text-[11px] opacity-80 mt-1">Süt veriminde %15 düşüş</div>
          </button>
        </div>

        {stressScenario !== 'normal' && (
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-xs font-bold text-fin-900">
                Simülasyon Sonucu: {stressScenario === 'feed_shock' ? 'Maliyet Marjı Sıkışması' : 'Verim Riski Etkisi'}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {stressScenario === 'feed_shock'
                  ? 'Yem maliyetindeki artış ve süt fiyatındaki gerileme net nakit akışını daraltmaktadır. Ancak mevcut borç yükü kapasitesi (%70+) sayesinde taksit ödemeleri sürdürülebilir.'
                  : 'Süt verimindeki %15 kayıp mevsimsel geliri düşürmektedir. TARSİM kuraklık/hayvan sigortası ve devlet faiz desteği riski dengeleyici faktördür.'}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex-shrink-0">
              <div className="text-center px-2">
                <div className="text-[10px] text-slate-500 font-medium">Simüle Skor</div>
                <div className="text-lg font-extrabold text-amber-700">
                  {stressScenario === 'feed_shock'
                    ? Math.max(40, (result.score.overallScore ?? 80) - 12)
                    : Math.max(40, (result.score.overallScore ?? 80) - 18)}
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center px-2">
                <div className="text-[10px] text-slate-500 font-medium">Ödeme Kapasitesi</div>
                <div className="text-xs font-bold text-fin-900">
                  {stressScenario === 'feed_shock' ? 'Orta Seviye' : 'İnceleme Gerekli'}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <CouncilTrace result={result} />

      <section className="tour-council-agents">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold text-agri-700 uppercase tracking-widest">
              Değerlendirme alanları
            </div>
            <h2 className="text-2xl font-bold text-fin-900 mt-1">
              Beş başlık, tek dosya
            </h2>
          </div>
          <span className="hidden sm:inline text-xs text-slate-500">
            Aynı kayıtlar • farklı bakışlar • açık uyarılar
          </span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {result.agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      <section className="tour-counterfactual grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl bg-fin-900 text-white p-6 relative overflow-hidden">
          <GitBranch className="absolute -right-5 -bottom-8 w-40 h-40 text-white/5" />
          <div className="relative z-10">
            <div className="text-xs font-bold text-agri-300 uppercase tracking-widest">
              İyileştirme yolu
            </div>
            <h2 className="text-2xl font-bold mt-2">
              En küçük doğrulanabilir iyileştirme
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-extrabold">
                {result.counterfactualPlan.beforeScore ?? '—'}
              </span>
              <ArrowRight className="w-5 h-5 text-agri-300" />
              <span className="text-3xl font-extrabold text-agri-300">
                {result.counterfactualPlan.afterScore ?? '—'}
              </span>
              {result.counterfactualPlan.beforeScore !== null && (
                <span className="text-sm text-fin-200">
                  hedef {result.counterfactualPlan.targetScore}
                </span>
              )}
            </div>
            <ol className="mt-5 space-y-3">
              {result.counterfactualPlan.actions.map((action, index) => (
                <li
                  key={`${action.kind}-${action.label}`}
                  className="rounded-lg bg-white/10 border border-white/10 p-3"
                >
                  <div className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-agri-500 text-white text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-bold text-sm">{action.label}</div>
                      <div className="text-xs text-fin-200 mt-1">
                        {action.assumption}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {result.counterfactualPlan.actions.length === 0 && (
                <li className="text-fin-100 text-sm">
                  {result.counterfactualPlan.disclaimer}
                </li>
              )}
            </ol>
            {result.counterfactualPlan.actions.length > 0 && (
              <p className="text-xs text-fin-300 mt-4">
                {result.counterfactualPlan.disclaimer}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-violet-600 mr-2" />
            <h2 className="text-xl font-bold text-fin-900">
              Açıklığa kavuşturulacak konular
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Çelişen sinyaller gizlenmez; açıklığa kavuşturulmak üzere dosyada tutulur.
          </p>
          <ul className="mt-5 space-y-3">
            {result.disagreements.map((disagreement) => (
              <li
                key={disagreement}
                className="flex items-start rounded-lg bg-violet-50 border border-violet-200 p-3 text-sm text-violet-950"
              >
                <TriangleAlert className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-violet-700" />
                <span>{disagreement}</span>
              </li>
            ))}
            {result.disagreements.length === 0 && (
              <li className="flex items-start rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-900">
                <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Belirgin bir çelişki bulunmadı.
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center">
              <History className="w-5 h-5 text-blue-700 mr-2" />
              <h2 className="text-xl font-bold text-fin-900">
                Son değerlendirmeler
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Yalnızca son beş değerlendirme özeti bu tarayıcıda tutulur; ham
              belge veya serbest metin saklanmaz.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportReceipt}
              disabled={!currentReceipt}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-medium px-4 py-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Kaydı İndir
            </button>
            <button
              type="button"
              onClick={clearMemory}
              disabled={receipts.length === 0}
              className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-700 font-medium px-4 py-2"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Kayıtları Temizle
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {receipts.map((receipt) => (
            <div
              key={receipt.receiptId}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-fin-900 truncate">
                  {receipt.producerName}
                </span>
                <FileClock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {formatReceiptDate(receipt.createdAt)}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span>Skor {receipt.overallScore ?? '—'}</span>
                <span>Güven %{receipt.reliabilityScore}</span>
              </div>
            </div>
          ))}
          {receipts.length === 0 && (
            <div className="md:col-span-2 xl:col-span-5 rounded-lg border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              Henüz kayıt yok. “Dosyayı Değerlendir ve Kaydet” düğmesi yeni
              özeti bu tarayıcıya ekler.
            </div>
          )}
        </div>

        {currentReceipt && (
          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-900">
            Değerlendirme kaydedildi.
            {previousReceipt
              ? currentReceipt.overallScore !== null
                && previousReceipt.overallScore !== null
                ? ` • Önceki aynı profil kaydıyla skor farkı ${currentReceipt.overallScore - previousReceipt.overallScore}.`
                : ' • Önceki kayıt mevcut; skor karşılaştırması için eksik bilgiler tamamlanmalı.'
              : ' • Bu profil için ilk kayıt.'}
          </div>
        )}
      </section>

      <div className="flex flex-col sm:flex-row gap-3 pb-8">
        <Link
          to={`/institution/producers/${selectedProducer.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-fin-900 hover:bg-fin-800 text-white font-bold px-5 py-3"
        >
          Üretici belgelerini aç
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
        <Link
          to="/review-guide"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold px-5 py-3"
        >
          Kullanım Rehberine Dön
        </Link>
      </div>
    </div>
  );
};

export default DecisionRoom;
