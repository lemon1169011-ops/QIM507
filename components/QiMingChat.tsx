import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const QiMingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hi! I am Nova. If you are navigating any emotional challenges or just need to talk, I am here to support you." }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // --- 工具：浏览器自带语音 (备用方案) ---
  const speakWithBrowser = (text: string) => {
    console.log("Switching to Browser TTS...");
    window.speechSynthesis.cancel(); // 停止之前的
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    
    // 尝试找一个好听点的女声
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferred) utterance.voice = preferred;
    
    window.speechSynthesis.speak(utterance);
  };

  // --- 工具：解码音频 ---
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  // --- 语音播放 (优先真人，失败则用浏览器) ---
  const playGreeting = async () => {
    const greetingText = "Hi! I am Nova. If you are navigating any emotional challenges, or just need to talk, I am here to support you.";
    
    try {
      // 1. 尝试初始化音频
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("No API Key");

      // 2. 尝试调用 Gemini 2.0 真人语音
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ parts: [{ text: greetingText }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
          },
        },
      });

      // 3. 播放
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      } else {
        throw new Error("No audio returned from Gemini");
      }

    } catch (err) {
      console.warn("Gemini Voice Failed (using fallback):", err);
      // 🔥 关键修复：如果真人语音失败，立刻用浏览器语音，保证有声音！
      speakWithBrowser(greetingText);
    }
  };

  // --- 聊天部分 (使用最稳定的 1.5 Flash) ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      // 🔥 关键修复：聊天只用 gemini-1.5-flash，且不请求 audio，确保不报错
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash", 
        contents: [
            { role: "user", parts: [{ text: userMsg }] }
        ],
        config: {
            systemInstruction: "You are Nova, a warm and empathetic mental health mentor. Keep answers concise.",
        }
      });

      const aiText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiText) {
          setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      } else {
          setMessages(prev => [...prev, { role: 'ai', text: "I'm here. Please go on." }]);
      }

    } catch (error: any) {
      console.error("Chat Error:", error);
      let errorMsg = "Connection lost. Please check your network.";
      
      // 详细的错误诊断
      if (error.message?.includes("404")) errorMsg = "Error: Model 'gemini-1.5-flash' not found. (Region/Key issue)";
      if (error.message?.includes("401") || error.message?.includes("API key")) errorMsg = "Error: Invalid API Key.";
      if (error.message?.includes("503")) errorMsg = "Nova is currently overloaded. Please try again in a moment.";

      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      playGreeting();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-24 lg:bottom-10 right-6 z-[60]">
      {isOpen ? (
        <div className="glass-card w-80 md:w-96 h-[500px] rounded-2xl flex flex-col shadow-2xl border border-cyan-500/30 overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="bg-cyan-600 p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
                <i className="fas fa-robot text-sm text-white"></i>
              </div>
              <div>
                <span className="block font-bold text-white text-sm">Nova</span>
                <span className="block text-[10px] text-cyan-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online Mentor
                </span>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
              className="text-white/80 hover:text-white p-1"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 scroll-hide bg-slate-900/40 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Nova anything..." 
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all" 
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className={`bg-cyan-600 text-white p-2 rounded-xl transition-all ${isLoading ? 'opacity-50' : 'hover:bg-cyan-500'}`}
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-110 active:scale-95 transition-all relative group overflow-hidden"
        >
          <div className="z-10 flex flex-col items-center">
            <div className="flex gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></div>
            </div>
            <i className="fas fa-robot text-xl"></i>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 to-transparent"></div>
          
          <span className="absolute -top-12 right-0 bg-white text-cyan-900 text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Chat with Nova
          </span>
        </button>
      )}
    </div>
  );
};

export default QiMingChat;
