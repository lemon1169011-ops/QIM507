import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

// Standard PCM Audio Decoding
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
  // Initial check for key
  const [hasKey, setHasKey] = useState(!!process.env.API_KEY);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Welcome back, explorer! I'm Nova. I've been monitoring your star system. How are you feeling in your orbit today?" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sync scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Periodic key check when open
  useEffect(() => {
    let interval: any;
    if (isOpen) {
      const check = async () => {
        if (window.aistudio?.hasSelectedApiKey) {
          const selected = await window.aistudio.hasSelectedApiKey();
          if (selected) setHasKey(true);
        }
      };
      check();
      interval = setInterval(check, 2000);
    }
    return () => clearInterval(interval);
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

      // Always new instance to ensure latest key usage
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
        const ctx = await initAudio();
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

  const handleOpenKeySelection = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // Mandatory rule: Assume success after triggering and proceed
        setHasKey(true); 
      } catch (err) {
        console.error("Key selection failed:", err);
      }
    } else {
      alert("Please ensure you are running this in the MindPlanet preview environment to select an API Key.");
    }
  };

  const toggleChat = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      await initAudio();
      setTimeout(() => {
        handleTTS(messages[0].text);
      }, 300);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Fetch key right before request
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key Missing. Click 'Connect Signal' to fix.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: "You are Nova, an empathetic AI mentor. Use space metaphors, be supportive, and help with stress.",
        },
      });

      const aiText = response.text || "I encountered a nebula distortion. Please try again.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      handleTTS(aiText);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const msg = error.message || "";
      
      // Mandatory rule: if "not found", reset key selection
      if (msg.includes("Requested entity was not found")) {
        setHasKey(false);
        setMessages(prev => [...prev, { role: 'ai', text: "Your satellite signal expired. Please re-connect using the button at the top." }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: `Signal Error: ${msg || 'Unknown Interference'}` }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-10 right-6 z-[60]">
      {isOpen ? (
        <div className="glass-card w-80 md:w-96 h-[500px] rounded-2xl flex flex-col shadow-2xl border border-cyan-500/30 overflow-hidden animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-cyan-600 p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div>
                <span className="block font-bold text-white text-[10px] uppercase tracking-widest leading-none">Nova AI Mentor</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                  <span className="text-[7px] text-white/70 uppercase">{hasKey ? 'Synced' : 'No Signal'}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:scale-125 transition-all">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Billing & Key Alert (Mandatory Requirement) */}
          {!hasKey && (
            <div className="bg-amber-500/10 p-4 text-center border-b border-amber-500/20">
              <p className="text-[9px] text-amber-300 font-bold mb-3 uppercase tracking-tighter">
                Galaxy signal requires a paid API key
              </p>
              <button 
                onClick={handleOpenKeySelection}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-black py-2 rounded-lg uppercase transition-all mb-2"
              >
                Connect Signal (Select API Key)
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                className="text-[8px] text-cyan-400 underline uppercase font-bold"
              >
                Learn about Billing & Keys
              </a>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-950/60 text-[11px] scroll-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none shadow-lg' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 px-3 py-2 rounded-xl flex gap-1 items-center">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
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
              placeholder={hasKey ? "Type a signal..." : "Connect signal above first..."}
              disabled={!hasKey}
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50" 
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !hasKey || !input.trim()}
              className="bg-cyan-600 text-white p-2 w-10 h-10 rounded-xl hover:bg-cyan-500 disabled:opacity-20 transition-all shadow-lg"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={toggleChat} 
          className="w-16 h-16 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-110 transition-all border border-white/20 animate-bounce relative"
        >
          <i className="fas fa-robot"></i>
          {!hasKey && <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 rounded-full border-2 border-slate-900 animate-pulse"></span>}
        </button>
      )}
    </div>
  );
};

export default QiMingChat;
