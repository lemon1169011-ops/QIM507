import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const QiMingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 这里的文字是英文的，和语音内容保持一致
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hi! I am Nova. If you are navigating any emotional challenges or just need to talk, I am here to support you." }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // --- 音频处理工具函数 ---
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

  // --- 关键修改 1：语音播放 (带备用方案) ---
  const playGreeting = async () => {
    // 1. 尝试初始化音频上下文 (浏览器要求必须在用户点击后触发)
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      // 2. 尝试使用 Gemini 2.0 模型生成真人语音
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp", // 这是一个支持音频输出的模型
        contents: [{ 
            parts: [{ 
                text: "Hi! I am Nova. If you are navigating any emotional challenges, or just need to talk, I am here to support you." 
            }] 
        }],
        config: {
          responseModalities: ["AUDIO"], // 请求音频
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
          },
        },
      });

      // 3. 播放 Gemini 生成的音频
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
        console.log("Gemini Voice playing...");
      } else {
        throw new Error("No audio data received");
      }

    } catch (err) {
      console.warn("Gemini TTS failed, switching to Browser TTS:", err);
      // --- 备用方案：如果 Gemini 语音失败，使用浏览器自带语音 ---
      const utterance = new SpeechSynthesisUtterance("Hi! I am Nova. If you are navigating any emotional challenges, or just need to talk, I am here to support you.");
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- 关键修改 2：聊天初始化 (使用最稳定的 1.5 Flash) ---
  const initChat = () => {
    if (chatRef.current) return chatRef.current;
    
    // 检查 Key 是否存在
    if (!process.env.API_KEY) {
        console.error("API Key is missing! Check deploy.yml settings.");
        return null;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-1.5-flash', // <--- 这里改成了最稳定的 1.5 Flash，修复聊天报错
      config: {
        systemInstruction: `You are Nova, an empathetic AI senior student mentor for high schoolers. 
        Your goal is to provide supportive, warm, and concise guidance on stress management.
        Always maintain a safe, non-judgmental, and encouraging tone.`,
      },
    });
    return chatRef.current;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const chat = initChat();
      if (!chat) throw new Error("Chat init failed (Missing Key?)");
      
      const response = await chat.sendMessage({ message: userMsg });
      const aiText = response.text || "I'm listening, please go on.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error: any) {
      console.error("Gemini API Error details:", error);
      let errorMsg = "Connection lost. Please check your network.";
      
      // 更加友好的错误提示，方便你排查
      if (error.message?.includes("401") || error.message?.includes("API Key")) {
        errorMsg = "Config Error: API Key not valid.";
      } else if (error.message?.includes("404")) {
        errorMsg = "Error: AI Model not found. Please update code.";
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      // 打开窗口时尝试播放欢迎语
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
