import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const QiMingChat: React.FC = () => {
  // 状态定义
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hi! I am Nova. If you are navigating any emotional challenges or just need to talk, I am here to support you." }
  ]);
  
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // --- 工具：Base64 转 Byte ---
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // --- 工具：音频解码 ---
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

  // --- 播放欢迎语音 (Gemini 2.0) ---
  const playGreeting = async () => {
    try {
      // 1. 初始化音频上下文
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      // 2. 获取 API Key
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("API Key missing");
        return;
      }

      // 3. 准备请求数据 (提取出来，防止语法错误)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{ 
          parts: [{ 
            text: "Hi! I am Nova. If you are navigating any emotional challenges, or just need to talk, I am here to support you." 
          }] 
        }],
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } }
        }
      };

      // 4. 发起请求
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.error) {
        console.error("Voice API Error:", data.error);
        return;
      }

      // 5. 处理音频数据
      const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
        const source = ctx.createBufferSource();
        const source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }

    } catch (err) {
      console.error("Voice Fetch Error:", err);
    }
  };

  // --- 发送消息 (Gemini 1.5 Flash) ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "You are Nova, a helpful AI mentor. Keep answers short and supportive." }],
            },
            {
                role: "model",
                parts: [{ text: "Understood." }],
            }
        ],
      });

      const result = await chat.sendMessage(userMsg);
      const response = await result.response;
      const aiText = response.text();
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      let errorMsg = "Connection lost. Please try again.";
      if (error.message?.includes("404")) errorMsg = "Model Error. Please check API Key.";
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 切换聊天窗口 ---
  const toggleChat = () => {
    if (!isOpen) {
      playGreeting(); 
    }
    setIsOpen(!isOpen);
  };

  // --- 渲染界面 ---
  return (
    <div className="fixed bottom-24 lg:bottom-10 right-6 z-[60]">
      {isOpen ? (
        <div className="glass-card w-80 md:w-96 h-[500px] rounded-2xl flex flex-col shadow-2xl border border-cyan-500/30 overflow-hidden animate-in slide-in-from-bottom-10">
          {/* 头部 */}
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
          
          {/* 消息列表 */}
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
          
          {/* 输入框区域 */}
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
                className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-10 flex items-center justify-center"
              >
                 <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 悬浮按钮 */
        <button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          <i className="fas fa-comment-dots text-2xl text-white group-hover:rotate-12 transition-transform"></i>
        </button>
      )}
    </div>
  );
};

export default QiMingChat;
