import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Standard PCM Audio Decoding for Gemini TTS.
 * This helper converts base64 raw PCM data to an AudioBuffer for playback.
 */
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
  const [isSimulationMode, setIsSimulationMode] = useState(!process.env.API_KEY);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Signal established. I'm Nova, your emotional navigator. How's the atmospheric pressure in your corner of the universe today?" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Sync state with environment variable availability
  useEffect(() => {
    setIsSimulationMode(!process.env.API_KEY);
  }, [process.env.API_KEY]);

  const initAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  /**
   * Browser-native TTS Fallback.
   * Ensures the user hears Nova even without an API key or when network fails.
   */
  const speakWithBrowser = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      // Detect language for proper voice selection
      utterance.lang = /[\u4e00-\u9fa5]/.test(text) ? 'zh-CN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTTS = async (text: string) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      speakWithBrowser(text);
      return;
    }

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
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
      } else {
        speakWithBrowser(text);
      }
    } catch (e: any) {
      console.warn("Gemini TTS unavailable, falling back to browser voice.");
      // If the request fails with "Requested entity was not found.", prompt for key selection
      if (e.message?.includes("Requested entity was not found.")) {
        if ((window as any).aistudio?.openSelectKey) {
          (window as any).aistudio.openSelectKey();
        }
      }
      speakWithBrowser(text);
    }
  };

  const handleOpenKeySelection = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume the key selection was successful after triggering to avoid race conditions
      setIsSimulationMode(false);
    } else {
      alert("Note: This feature requires a Gemini API Key. Since you're outside the development environment, I'm operating in 'Simulation Mode'.");
      setIsSimulationMode(true);
    }
  };

  const toggleChat = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      await initAudio();
      setTimeout(() => {
        handleTTS(messages[0].text);
      }, 400);
    }
  };

  /**
   * Local Knowledge Base for Simulation Mode.
   */
  const getSimulatedResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes("hi") || q.includes("hello") || q.includes("你好")) 
        return "Hello explorer! My primary signal is currently offline, but I'm here in simulation mode to help you navigate your mental health voyage.";
    if (q.includes("stress") || q.includes("pressure") || q.includes("压力")) 
        return "Stress is like gravity—it's always there, but we can learn to move within it. Have you tried the 4-7-8 breathing exercise in Module 2?";
    if (q.includes("sad") || q.includes("bad") || q.includes("难受")) 
        return "It's okay to have cloudy weather on your planet. Take a moment to rest. Check out Module 3 to see who in your orbit can help.";
    return "I'm receiving your message! While my 'Deep Thought' processor is disconnected, I suggest exploring the learning modules to strengthen your resilience.";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const apiKey = process.env.API_KEY;
    if (!apiKey || isSimulationMode) {
      setTimeout(() => {
        const simRes = getSimulatedResponse(userMsg);
        setMessages(prev => [...prev, { role: 'ai', text: simRes }]);
        handleTTS(simRes);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: "You are Nova, an empathetic AI mentor. Use space metaphors, be supportive, and help with stress. Keep responses brief and poetic. If you detect the user is in crisis, provide gentle encouragement and suggest professional help.",
        },
      });

      // Directly access .text property from GenerateContentResponse
      const aiText = response.text || "I encountered a nebula distortion. Please try again.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      handleTTS(aiText);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const msg = error.message || "";
      if (msg.includes("API key") || msg.includes("Requested entity was not found.")) {
        if (msg.includes("Requested entity was not found.") && (window as any).aistudio?.openSelectKey) {
          (window as any).aistudio.openSelectKey();
        }
        setIsSimulationMode(true);
        const fallbackMsg = "My connection to the main star has been interrupted. I've switched to local simulation mode to stay with you.";
        setMessages(prev => [...prev, { role: 'ai', text: fallbackMsg }]);
        handleTTS(fallbackMsg);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "A temporary signal interference occurred. Please try sending your message again." }]);
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
          <div className="bg-gradient-to-r from-cyan-600 to-indigo-700 p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                <i className="fas fa-robot text-white text-base"></i>
              </div>
              <div>
                <span className="block font-bold text-white text-[11px] uppercase tracking-widest leading-none">Nova Mentor</span>
                <span className={`text-[7px] uppercase font-black tracking-tighter mt-1 block ${isSimulationMode ? 'text-amber-300' : 'text-emerald-300'}`}>
                  {isSimulationMode ? "Simulation Mode" : "Real-time Link Active"}
                </span>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white/60 hover:text-white transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-950/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {isSimulationMode && (
            <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20">
              <button 
                onClick={handleOpenKeySelection}
                className="text-[9px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-2 hover:text-amber-300 transition-colors"
              >
                <i className="fas fa-key"></i> Connect to Main Star (Input API Key)
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-slate-900 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message Nova..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all pr-12"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center hover:bg-cyan-500 disabled:opacity-50 transition-all"
              >
                <i className="fas fa-paper-plane text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={toggleChat}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-700 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative group"
        >
          <div className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-20 group-hover:opacity-40"></div>
          <i className="fas fa-robot text-xl md:text-2xl z-10"></i>
          <span className="absolute -top-12 right-0 bg-slate-900 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded-full border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Nova is online
          </span>
        </button>
      )}
    </div>
  );
};

export default QiMingChat;
