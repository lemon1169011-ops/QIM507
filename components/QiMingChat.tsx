import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; // <--- 换成了标准版 SDK

const QiMingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 聊天记录
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hi! I am Nova. If you are navigating any emotional challenges or just need to talk, I am here to support you." }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  // 自动滚动
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // --- 语音播放 (使用浏览器原生能力，最稳定) ---
  const speakText = (text: string) => {
    // 停止之前的朗读
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // 设定为英语
    utterance.rate = 1.0;     // 语速正常
    utterance.pitch = 1.1;    // 语调稍微高一点点，听起来更积极
    
    // 尝试找一个好听的女声
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  // --- 初始化聊天 ---
  const getChatSession = async () => {
    if (chatSessionRef.current) return chatSessionRef.current;

    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // 使用最稳定的 Flash 模型

    chatSessionRef.current = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "System Instruction: You are Nova, an empathetic AI mentor for students. Keep answers supportive, concise, and warm." }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am Nova, ready to help." }],
        },
      ],
    });
    return chatSessionRef.current;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const chat = await getChatSession();
      const result = await chat.sendMessage(userMsg);
      const response = await result.response;
      const aiText = response.text();
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      // AI 回复时也自动朗读
      // speakText(aiText); // 如果不想每句都读，可以注释掉这行
    } catch (error: any) {
      console.error("Chat Error:", error);
      let errorMsg = "Connection error. Please try again.";
      
      if (error.message?.includes("404")) errorMsg = "Error: Model not found. Check API Key or Model name.";
      if (error.message?.includes("API Key")) errorMsg = "Error: API Key invalid.";
      
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      // 打开窗口时，朗读欢迎语
      speakText("Hi! I am Nova. I am here to support you.");
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
