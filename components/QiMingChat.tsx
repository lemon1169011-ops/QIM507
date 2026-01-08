import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

// 辅助函数：解码 Base64 为 Uint8Array
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// 辅助函数：将 raw PCM 数据转为 AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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
        const bytes = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(bytes, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error("Nova Voice Engine Error:", e);
    }
  };

  const toggleChat = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      // 激活音频并播报开场白
      const ctx = await initAudio();
      console.log("Audio Engine Ready:", ctx.state);
      // 给 UI 渲染留一点时间
      setTimeout(() => {
        handleTTS(messages[0].text);
      }, 300);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key Missing");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: "You are Nova, an empathetic AI mentor for high schoolers. Be supportive, concise, and use space metaphors.",
        },
      });

      const aiText = response.text || "Signal drift... please resend your message.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      handleTTS(aiText);
    } catch (error: any) {
      console.error("Communication Error Details:", error);
      setMessages(prev => [...prev, { role: 'ai', text: `Signal Lost: ${error?.message || 'Orbit connection failed'}. Please check your network.` }]);
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
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                 <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span className="font-bold text-white text-[10px] uppercase tracking-widest">Nova AI Support</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-transform hover:scale-125">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-950/60 text-xs scroll-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-white/10 bg-slate-900/80 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Nova anything..." 
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-gray-600" 
            />
            <button onClick={handleSend} className="bg-cyan-600 text-white p-2 w-10 h-10 rounded-xl hover:bg-cyan-500 transition-all active:scale-95 shadow-lg shadow-cyan-500/20">
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      ) : (
        <button onClick={toggleChat} className="w-14 h-14 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-110 transition-all border border-white/20 animate-bounce">
          <i className="fas fa-robot"></i>
        </button>
      )}
    </div>
  );
};

export default QiMingChat;
