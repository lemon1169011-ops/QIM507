import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

const QiMingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hello! I'm Nova, your emotional navigator. How's the weather on your inner planet today? I'm here to listen." }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // 当机器人打开时，自动播报欢迎词
  useEffect(() => {
    if (isOpen) {
      handleTTS("Hello! I'm Nova, your emotional navigator. How is the weather on your inner planet today? I am here to listen.");
    }
  }, [isOpen]);

  const handleTTS = async (text: string) => {
    try {
      const apiKey = (process.env as any).API_KEY;
      if (!apiKey) return;

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say warmly and calmly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioData = atob(base64Audio);
        const bytes = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) bytes[i] = audioData.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error("TTS Error", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are Nova, an empathetic AI mentor. Keep replies supportive and concise. Use cosmic metaphors.`,
        },
      });

      const response = await chat.sendMessage({ message: userMsg });
      const aiText = response.text || "Communication glitch... Please try again.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      handleTTS(aiText); // 播报AI回答
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Signal lost! Please check your space connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-10 right-6 z-[60]">
      {isOpen ? (
        <div className="glass-card w-80 md:w-96 h-[500px] rounded-2xl flex flex-col shadow-2xl border border-cyan-500/30 overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="bg-cyan-600 p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                 <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span className="font-bold text-white text-sm uppercase tracking-widest">Nova AI Mentor</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-transform hover:rotate-90">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-950/40 text-sm scroll-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none shadow-md' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-white/10 bg-slate-900/60">
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Talk to Nova..." 
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-gray-600" 
              />
              <button 
                onClick={handleSend} 
                className="bg-cyan-600 text-white p-2 w-10 h-10 rounded-xl hover:bg-cyan-500 transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-cyan-500/20"
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-14 h-14 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-110 transition-all planet-glow border border-white/20 animate-bounce"
        >
          <i className="fas fa-robot"></i>
        </button>
      )}
    </div>
  );
};

export default QiMingChat;
