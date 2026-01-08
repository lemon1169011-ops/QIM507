
import React, { useState, useRef, useEffect } from 'react';

const Module2: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');
  const [timer, setTimer] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const AUDIO_URL = "https://www.bensound.com/bensound-music/bensound-relaxing.mp3"; 

  // Breathing Logic
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(t => {
          if (breathPhase === 'Ready') { setBreathPhase('Inhale'); return 0; }
          if (breathPhase === 'Inhale' && t >= 4) { setBreathPhase('Hold'); return 0; }
          if (breathPhase === 'Hold' && t >= 7) { setBreathPhase('Exhale'); return 0; }
          if (breathPhase === 'Exhale' && t >= 8) { setBreathPhase('Inhale'); return 0; }
          return t + 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Ready');
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, breathPhase]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">Module 02</span>
        <h1 className="text-4xl font-bold text-white mt-2">The Mind Toolbox</h1>
        <p className="text-gray-400 mt-2">Equipping your planet with advanced stabilization tech.</p>
      </header>

      <audio ref={audioRef} src={AUDIO_URL} loop />

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-wind text-emerald-400"></i> Interactive 4-7-8 Breathing Guide
        </h2>
        <div className="glass-card p-12 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
          {/* Animated Background Pulse */}
          <div className={`absolute inset-0 bg-emerald-500/5 transition-all duration-1000 ${breathPhase === 'Inhale' ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}`}></div>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* The Breath Circle */}
            <div className="w-64 h-64 rounded-full border-4 border-white/5 flex items-center justify-center relative mb-12">
               <div 
                 className={`absolute rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 transition-all duration-[4000ms] ease-in-out opacity-40
                 ${breathPhase === 'Inhale' ? 'w-full h-full scale-100' : ''}
                 ${breathPhase === 'Hold' ? 'w-full h-full scale-100' : ''}
                 ${breathPhase === 'Exhale' ? 'w-1/4 h-1/4 scale-50' : ''}
                 ${breathPhase === 'Ready' ? 'w-0 h-0 scale-0' : ''}
                 `}
                 style={{ transitionDuration: breathPhase === 'Inhale' ? '4000ms' : breathPhase === 'Hold' ? '0ms' : '8000ms' }}
               ></div>
               <div className="z-20 text-center">
                  <p className="text-4xl font-bold text-white mb-2">{breathPhase}</p>
                  <p className="text-emerald-400 font-mono text-2xl">{timer}s</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-10 text-center">
               <div className={`p-4 rounded-2xl transition-all ${breathPhase === 'Inhale' ? 'bg-emerald-500/20 ring-1 ring-emerald-500' : 'opacity-40'}`}>
                  <p className="text-white font-bold">4s</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Inhale (Nose)</p>
               </div>
               <div className={`p-4 rounded-2xl transition-all ${breathPhase === 'Hold' ? 'bg-emerald-500/20 ring-1 ring-emerald-500' : 'opacity-40'}`}>
                  <p className="text-white font-bold">7s</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Hold Breath</p>
               </div>
               <div className={`p-4 rounded-2xl transition-all ${breathPhase === 'Exhale' ? 'bg-emerald-500/20 ring-1 ring-emerald-500' : 'opacity-40'}`}>
                  <p className="text-white font-bold">8s</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Exhale (Mouth)</p>
               </div>
            </div>

            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className={`px-12 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl ${isPlaying ? 'bg-rose-500' : 'bg-emerald-600'}`}
            >
              <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'} mr-2`}></i>
              {isPlaying ? 'Stop Session' : 'Start Breathing'}
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-spa text-emerald-400"></i> Why this works?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-3xl">
            <h4 className="font-bold text-white mb-2">Vagus Nerve Stimulation</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              The 4-7-8 technique acts like a hack for your nervous system. Long exhalations tell your brain that you are safe, switching off the "fight or flight" response.
            </p>
          </div>
          <div className="glass-card p-6 rounded-3xl">
            <h4 className="font-bold text-white mb-2">Mental Anchoring</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              By counting and focusing on the physical sensation of breath, you pull your mind away from ruminating thoughts and back into the present moment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Module2;
