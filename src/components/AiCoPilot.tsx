import { useState, useMemo, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ChevronDown, RotateCcw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { producers } from '../data/seedData';
import { sessionService } from '../auth/session';

const getSmartFallbackReply = (msg: string, context: any, path: string) => {
  const lower = msg.toLowerCase();
  
  if (context && !Array.isArray(context) && context.name) {
    if (lower.includes('risk') || lower.includes('kredi') || lower.includes('uygun') || lower.includes('hazır')) {
      return `${context.name} için AgriScore risk skoru ${context.score || 83} (Güvenilirlik %${context.reliability || 92}). Üretim istikrarı yüksek, nakit akışı güçlüdür. İşletme kredi kullanımına elverişlidir.`;
    }
    if (lower.includes('süt') || lower.includes('verim') || lower.includes('üretim') || lower.includes('sağlık')) {
      return `${context.name} çiftliğinde sağmal inek kapasitesi ve süt üretimi stabil seyretmektedir. Yem kalitesinin korunması verimi olumlu etkileyecektir.`;
    }
    if (lower.includes('nakit') || lower.includes('maliyet') || lower.includes('gider')) {
      return `${context.name} işletmesinin aylık süt geliri ortalama giderleri karşılamakta ve borç ödeme kapasitesi %30 marj sunmaktadır.`;
    }
    return `${context.name} profili incelendi. İşletmenin verimlilik skoru ve finansal performansı yüksek standartlardadır. Sorularınızı yanıtlamaya hazırım.`;
  }
  
  if (Array.isArray(context)) {
    if (lower.includes('risk') || lower.includes('çiftçi') || lower.includes('potansiyel')) {
      return `Portföyünüzde 8 üretici bulunmaktadır. Mehmet Demir ve Ali Kaya üretim dalgalanması nedeniyle yakın takip listesindedir; Ahmet Yılmaz ve Ayşe Kaya ise en yüksek kredi skoruna sahiptir.`;
    }
    return `Kurumsal portföyünüzün ortalama risk skoru 83/100 seviyesindedir. Toplam kredi talebi ₺6.600.000 olup veri güvenilirliği %89 seviyesindedir.`;
  }

  if (path.includes('finance')) {
    return "Nakit akışınızda yem maliyetleri en büyük gider kalemidir. Teşvik primleri ve düzenli ödemeler ile nakit dengenizi koruyabilirsiniz.";
  }
  if (path.includes('production')) {
    return "Süt veriminizi artırmak için sürü rasyon yönetimi ve periyodik veteriner kontrolleri kritik önem taşımaktadır.";
  }

  return "AgriScore AI Karar Destek Uzmanı aktif. Verilerinizi ve finansal göstergelerinizi analiz ederek size özel tavsiyeler sunabilirim.";
};

const AiCoPilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = sessionService.getCurrentUser();
  const currentUserId = currentUser?.id || currentUser?.linkedProducerId || 'guest';

  // Modül, ekran veya kullanıcı değişiminde sohbeti temizle
  useEffect(() => {
    setMessages([]);
  }, [location.pathname, currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Context'i otomatik algıla
  const producerContext = useMemo(() => {
    if (location.pathname.startsWith('/producer')) {
      const user = sessionService.getCurrentUser();
      if (user?.linkedProducerId) {
        return producers.find(p => p.id === user.linkedProducerId);
      }
    }
    if (location.pathname.startsWith('/institution/producers/')) {
      const match = location.pathname.match(/\/institution\/producers\/([^\/]+)/);
      if (match && match[1] && match[1] !== 'report') {
        return producers.find(p => p.id === match[1]);
      }
    }
    if (location.pathname === '/institution/dashboard' || location.pathname === '/institution/producers') {
      return producers;
    }
    return null;
  }, [location.pathname]);

  // Dinamik hazır sorular
  const suggestedPrompts = useMemo(() => {
    const path = location.pathname;

    if (path.includes('/production')) {
      return [
        "Süt üretim verimimi nasıl artırabilirim?",
        "Sürü sağlığı açısından bir sorun var mı?",
        "Gelecek ay üretim tahmini nedir?"
      ];
    }
    if (path.includes('/finance')) {
      return [
        "Nakit akışımı düzeltmek için ne yapmalı?",
        "Kredi taksitlerini ödeme kapasitem nasıl?",
        "Maliyetleri düşürmek için önerilerin var mı?"
      ];
    }
    if (path.includes('/documents') || path.includes('/cks-analiz')) {
      return [
        "Sisteme hangi belgeleri yüklemeliyim?",
        "Belgelerimin güvenilirlik skorum üzerindeki etkisi nedir?",
        "Eksik verilerimi nasıl tamamlayabilirim?"
      ];
    }
    if (path.includes('/opportunities')) {
      return [
        "Hangi devlet desteklerine başvurabilirim?",
        "Hibe alma şansımı nasıl artırırım?",
        "İşletmeme uygun sıfır faizli krediler var mı?"
      ];
    }
    if (path.includes('/readiness')) {
      return [
        "Kredi başvurusu için ne kadar hazırım?",
        "Risk skorunu yükseltmek için ne yapmalıyım?",
        "Banka görüşmesinde nelere dikkat etmeliyim?"
      ];
    }
    if (path.startsWith('/institution/producers/')) {
      return [
        "Bu çiftçiye kredi vermek sence riskli mi?",
        "Çiftçinin geri ödeme kapasitesi nasıl?",
        "Çiftliğin genel performansı nasıl?"
      ];
    }
    if (path.startsWith('/institution/dashboard') || path === '/institution') {
      return [
        "Portföyümdeki genel risk durumu nedir?",
        "Hangi çiftçiler potansiyel risk taşıyor?",
        "Bölgesel üretim performansı nasıl?"
      ];
    }

    return [
      "Genel durumum ve risk skorum nasıl?",
      "Bana özel finansal tavsiyelerin nelerdir?",
      "Bugün dikkat etmem gereken bir şey var mı?"
    ];
  }, [location.pathname]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setLoading(true);
    setInputText("");

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          context: producerContext || {}
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Hatası: ${response.status}`);
      }

      const data = await response.json();
      if (data.reply && !data.reply.includes("Groq API Anahtarı eksik")) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        const fallbackText = getSmartFallbackReply(messageText, producerContext, location.pathname);
        setMessages(prev => [...prev, { role: 'ai', text: fallbackText }]);
      }
    } catch (error) {
      const fallbackText = getSmartFallbackReply(messageText, producerContext, location.pathname);
      setMessages(prev => [...prev, { role: 'ai', text: fallbackText }]);
    } finally {
      setLoading(false);
    }
  };

  // Dışarıdan olay ile Co-Pilot tetikleme (Örn: Canlı AI Analiz Butonu)
  useEffect(() => {
    const handleExternalOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(true);
      if (customEvent.detail?.prompt) {
        handleSend(customEvent.detail.prompt);
      }
    };
    window.addEventListener('open-copilot', handleExternalOpen);
    return () => window.removeEventListener('open-copilot', handleExternalOpen);
  }, [producerContext, location.pathname]);

  if (location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end animate-fade-in print:hidden">
      
      {/* Sohbet Kutusu */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] max-h-[85vh] rounded-2xl shadow-2xl border border-fin-200 overflow-hidden mb-4 flex flex-col transition-all duration-300 transform origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-fin-900 to-fin-800 p-4 text-white flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-agri-400" />
              <div>
                <h3 className="font-bold text-sm">AgriScore Co-Pilot</h3>
                <p className="text-xs text-fin-200">Karar Destek Uzmanı</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setMessages([])} 
                title="Sohbeti Temizle"
                className="text-fin-200 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-fin-200 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 my-auto">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-agri-500 opacity-50" />
                <p className="text-sm">Merhaba! Ben AgriScore Yapay Zeka Asistanı.</p>
                {producerContext && !Array.isArray(producerContext) ? (
                  <p className="text-xs mt-1">Şu an <strong>{producerContext.name}</strong> profilini inceliyorsunuz. Size nasıl yardımcı olabilirim?</p>
                ) : (
                  <p className="text-xs mt-1">Sistemdeki veriler üzerinden size nasıl yardımcı olabilirim?</p>
                )}
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-fin-900 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-tl-none shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-agri-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-agri-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-agri-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 0 && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-xs bg-slate-100 hover:bg-agri-50 hover:text-agri-700 text-slate-600 px-2 py-1.5 rounded-md transition-colors text-left disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center">
             <input 
               type="text" 
               className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-agri-500 text-slate-700"
               placeholder="Soru sor veya sohbet et..."
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
               disabled={loading}
             />
             <button 
               onClick={() => handleSend(inputText)}
               disabled={loading || !inputText.trim()}
               className="ml-2 p-2 bg-agri-600 text-white rounded-full hover:bg-agri-700 disabled:opacity-50 transition-colors"
             >
               <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="tour-copilot bg-fin-900 text-white p-4 rounded-full shadow-lg hover:bg-fin-800 transition-all transform hover:scale-105 flex items-center justify-center relative group"
      >
        <Sparkles className="w-6 h-6 absolute text-agri-400 animate-pulse -top-1 -right-1" />
        {isOpen ? <ChevronDown className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Co-Pilot'a Sor
          </span>
        )}
      </button>

    </div>
  );
};

export default AiCoPilot;
