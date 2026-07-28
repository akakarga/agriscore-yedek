import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, ChevronDown, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { useLocation } from 'react-router';
import { sessionService } from '../auth/session';
import { producers } from '../data/seedData';
import { getLocalCopilotReply } from '../services/localCopilot';

type ResponseMode = 'live_llm' | 'local_deterministic';

const LIVE_COPILOT_ENABLED = import.meta.env.VITE_COPILOT_LIVE !== 'false';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  mode?: ResponseMode;
}

const AiCoPilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = sessionService.getCurrentUser();
  const currentUserId = currentUser?.id || currentUser?.linkedProducerId || 'guest';

  useEffect(() => {
    setMessages([]);
  }, [location.pathname, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const producerContext = useMemo(() => {
    if (location.pathname.startsWith('/producer')) {
      const user = sessionService.getCurrentUser();
      if (user?.linkedProducerId) {
        return producers.find((producer) => producer.id === user.linkedProducerId) ?? null;
      }
    }
    if (location.pathname.startsWith('/institution/producers/')) {
      const match = location.pathname.match(/\/institution\/producers\/([^/]+)/);
      if (match?.[1] && match[1] !== 'report') {
        return producers.find((producer) => producer.id === match[1]) ?? null;
      }
    }
    if (location.pathname.startsWith('/institution/decision-room')) {
      const match = location.pathname.match(/\/institution\/decision-room\/([^/]+)/);
      if (match?.[1]) {
        return producers.find((producer) => producer.id === match[1]) ?? null;
      }
      return producers[7] ?? producers[0] ?? null;
    }
    if (
      location.pathname === '/institution/dashboard'
      || location.pathname === '/institution/producers'
    ) {
      return producers;
    }
    return null;
  }, [location.pathname]);

  const suggestedPrompts = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/production')) {
      return ['Son üretim ve projeksiyon nedir?', 'Sürü sağlığı risk sinyali var mı?'];
    }
    if (path.includes('/finance')) {
      return ['Borç sonrası nakit akışı nedir?', 'Korumalı taksit aralığı nedir?'];
    }
    if (path.includes('/documents') || path.includes('/cks-analiz')) {
      return ['Eksik veriler skoru nasıl etkiliyor?', 'ÇKS belgesi tek başına yeterli mi?'];
    }
    if (path.includes('/opportunities')) {
      return ['Destek uygunluğu nasıl doğrulanır?', 'Bu fırsatlar resmi mi?'];
    }
    if (path.includes('/decision-room')) {
      return ['Dosya değerlendirmesini açıkla', 'Hangi alanlar ayrıntılı incelenmeli?'];
    }
    if (path.startsWith('/institution/producers/')) {
      return ['Bu profilin hesaplanan riskleri nedir?', 'Borç ödeme kapasitesi nasıl?'];
    }
    if (path.startsWith('/institution/dashboard')) {
      return ['Portföy risk dağılımı nedir?', 'Hangi profiller inceleme öncelikli?'];
    }
    return ['Hesaplanan genel durum nedir?', 'Veri güvenilirliği nedir?'];
  }, [location.pathname]);

  const handleSend = useCallback(async (
    messageText: string,
    visibleText = messageText
  ) => {
    const trimmed = messageText.trim();
    if (!trimmed || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: 'user', text: visibleText.trim() || trimmed },
    ]);
    setLoading(true);
    setInputText('');

    try {
      if (!LIVE_COPILOT_ENABLED) {
        const localReply = getLocalCopilotReply(trimmed, producerContext);
        setMessages((previous) => [
          ...previous,
          { role: 'ai', text: localReply.text, mode: localReply.mode },
        ]);
        return;
      }

      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          context: producerContext || {},
        }),
      });
      if (!response.ok) throw new Error(`COPILOT_HTTP_${response.status}`);

      const data = await response.json() as { reply?: string; mode?: ResponseMode };
      if (!data.reply || data.mode !== 'live_llm') throw new Error('COPILOT_INVALID_RESPONSE');
      setMessages((previous) => [
        ...previous,
        { role: 'ai', text: data.reply as string, mode: 'live_llm' },
      ]);
    } catch {
      const fallback = getLocalCopilotReply(trimmed, producerContext);
      setMessages((previous) => [
        ...previous,
        { role: 'ai', text: fallback.text, mode: fallback.mode },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, producerContext]);

  useEffect(() => {
    const handleExternalOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{
        prompt?: string;
        displayText?: string;
      }>;
      setIsOpen(true);
      if (customEvent.detail?.prompt) {
        void handleSend(
          customEvent.detail.prompt,
          customEvent.detail.displayText
        );
      }
    };
    window.addEventListener('open-copilot', handleExternalOpen);
    return () => window.removeEventListener('open-copilot', handleExternalOpen);
  }, [handleSend]);

  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end animate-fade-in print:hidden">
      {isOpen && (
        <div className="bg-white w-full sm:w-96 h-[min(500px,75vh)] rounded-2xl shadow-2xl border border-fin-200 overflow-hidden mb-3 flex flex-col">
          <div className="bg-gradient-to-r from-fin-900 to-fin-800 p-4 text-white flex justify-between items-center">
            <div className="flex items-center min-w-0">
              <Bot className="w-5 h-5 mr-2 text-agri-400 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold text-sm">AgriScore Yardımcısı</h3>
                <p className="text-xs text-fin-200 truncate">
                  Ekrandaki kayıtları anlaşılır biçimde açıklar
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMessages([])}
                title="Sohbeti temizle"
                aria-label="Sohbeti temizle"
                className="text-fin-200 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Yardımcı penceresini kapat"
                className="text-fin-200 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-4 py-2 text-[11px] bg-amber-50 text-amber-900 border-b border-amber-100">
            İşletme verileri analiz edilmektedir. Çıktılar karar destek amaçlıdır.
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 my-auto">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-agri-500 opacity-50" />
                <p className="text-sm">Mevcut ekrandaki hesaplanabilir verileri açıklayabilirim.</p>
                <p className="text-xs mt-1">Yanıtlar yalnızca bu çalışma alanındaki kayıtlara dayanır.</p>
              </div>
            ) : messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-3 rounded-lg text-sm whitespace-pre-line ${
                  message.role === 'user'
                    ? 'bg-fin-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-xs text-slate-500">
                  Yanıt hazırlanıyor…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => void handleSend(prompt)}
                  disabled={loading}
                  className="text-xs bg-slate-100 hover:bg-agri-50 hover:text-agri-700 text-slate-600 px-2 py-1.5 rounded-md disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 bg-white border-t border-slate-200 flex items-center">
            <input
              type="text"
              className="flex-1 min-w-0 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-agri-500 text-slate-700"
              placeholder="Mevcut veriler hakkında sor…"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void handleSend(inputText);
              }}
              disabled={loading}
              maxLength={2000}
            />
            <button
              onClick={() => void handleSend(inputText)}
              disabled={loading || !inputText.trim()}
              aria-label="Mesaj gönder"
              className="ml-2 p-2 bg-agri-600 text-white rounded-full hover:bg-agri-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Yardımcı penceresini küçült' : 'Yardımcı penceresini aç'}
        className="tour-copilot bg-fin-900 text-white p-4 rounded-full shadow-lg hover:bg-fin-800 transition-transform hover:scale-105 relative"
      >
        <Sparkles className="w-5 h-5 absolute text-agri-400 -top-1 -right-1" />
        {isOpen ? <ChevronDown className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default AiCoPilot;
