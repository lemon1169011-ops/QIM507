import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

// 基础编解码函数
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const QiMingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasKey, setHasKey] = useState(!!process.env.API_KEY);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hello! I'm Nova, your emotional navigator. Signal established. How's the weather on your inner planet today?" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // 检查 API Key 状态
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected || !!process.env.API_KEY);
      }
    };
    checkKey();
  }, [isOpen]);

  const initAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const handleTTS = async (text: string) => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) return;

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Respond warmly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const ctx = await initAudio();
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error("Nova Speech System Error:", e);
    }
  };

  const handleOpenKeySelection = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // 假设选择成功并继续
    }
  };

  const toggleChat = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      await initAudio(); // 强制激活音频上下文
      setTimeout(() => {
        handleTTS(messages[0].text);
      }, 500);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key Missing. Please click 'Connect Signal' above.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: "You are Nova, an empathetic AI mentor for high schoolers. Be supportive, concise, and use space metaphors. Support SDG 3 goals.",
        },
      });

      const aiText = response.text || "Signal interrupted... Please try again.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      handleTTS(aiText);
    } catch (error: any) {
      console.error("Communication Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: `Signal Lost: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-10 right-6 z-[60]">
      {isOpen ? (
        <div className="glass-card w-80 md:w-96 h-[500px] rounded-2xl flex flex-col shadow-2xl border border-cyan-500/30 overflow-hidden animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-cyan-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span className="font-bold text-white text-[10px] uppercase tracking-widest">Nova AI Mentor</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:rotate-90 transition-all">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* API Key Alert */}
          {!hasKey && (
            <div className="bg-amber-500/20 p-3 text-center border-b border-amber-500/30">
              <p className="text-[10px] text-amber-200 font-bold mb-2">GALAXY SIGNAL DISCONNECTED</p>
              <button 
                onClick={handleOpenKeySelection}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-black px-4 py-1.5 rounded-full uppercase transition-all"
              >
                Connect Signal (Select API Key)
              </button>
            </div>
          )}

          {/* Chat area */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-950/60 text-[11px] scroll-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white/5 px-3 py-2 rounded-xl text-[9px] text-cyan-400 uppercase font-bold tracking-tighter">
                  Interpreting Nebula signals...
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-slate-900/80 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message Nova..." 
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" 
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !hasKey}
              className="bg-cyan-600 text-white p-2 w-10 h-10 rounded-xl disabled:opacity-30"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      ) : (
        <button onClick={toggleChat} className="w-16 h-16 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition-all border border-white/20 animate-bounce">
          <i className="fas fa-robot"></i>
        </button>
      )}
    </div>
  );
};

export default QiMingChat;
