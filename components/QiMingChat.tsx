import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

// Standard Base64 decoder as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Standard Audio Decoder as per guidelines
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
    { role: 'ai', text: "Welcome back, explorer! I'm Nova. I've been monitoring your star system. How are you feeling in your orbit today?" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const getAudioContext = async () => {
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
      if (!apiKey) {
        console.warn("API Key missing for TTS");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const ctx = await getAudioContext();
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error("Nova TTS Error:", e);
    }
  };

  const toggleChat = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    
    if (nextState) {
      // Warm up audio context on user gesture
      const ctx = await getAudioContext();
      console.log("Nova wake-up: Audio context state is", ctx.state);
      
      // Play opening line
      handleTTS(messages[0].text);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key Not Found");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: "You are Nova, an empathetic AI mentor for high schoolers. Provide emotional support, use cosmic metaphors, be concise, and help users navigate stress. Always respond in the language the user is using.",
        },
      });

      const aiResponse = response.text || "I'm receiving some cosmic interference. Can you repeat that signal?";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      
      // Speak the response
      handleTTS(aiResponse);
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      const errorMessage = error?.message || "Connection lost in the nebula.";
      setMessages(prev => [...prev, { role: 'ai', text: `Signal Lost: ${errorMessage}. Please check your connection and try again.` }]);
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
              <div>
                <span className="block font-bold text-white text-[10px] uppercase tracking-widest">Nova AI Mentor</span>
                <span className="block text-[8px] text-cyan-200 uppercase">Status: Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-all hover:rotate-90">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-950/60 text-[11px] scroll-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm leading-relaxed ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[9px] text-gray-500 ml-2 uppercase tracking-tighter">Analyzing Orbit...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-white/10 bg-slate-900/80 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Send a signal to Nova..." 
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-gray-600" 
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="bg-cyan-600 text-white p-2 w-10 h-10 rounded-xl hover:bg-cyan-500 transition-all active:scale-95 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={toggleChat} 
          className="w-16 h-16 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-110 transition-all border border-white/20 animate-bounce group"
        >
          <i className="fas fa-robot group-hover:rotate-12"></i>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1a1a2e] animate-pulse"></span>
        </button>
      )}
    </div>
  );
};

export default QiMingChat;
