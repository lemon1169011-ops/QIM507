import React, { useState, useRef, useEffect } from 'react';

const Module2: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');
  const [timer, setTimer] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const AUDIO_URL = "https://www.bensound.com/bensound-music/bensound-relaxing.mp3"; 

  const phaseDetails = {
    Ready: { text: "Find a comfortable seat", tip: "Place your tip of tongue behind upper front teeth." },
    Inhale: { text: "Breathe in quietly through nose", tip: "Count to 4... feel your belly expand." },
    Hold: { text: "Hold your breath", tip: "Count to 7... keep your body relaxed." },
    Exhale: { text: "Whoosh exhale through mouth", tip: "Count to 8... release all tension." }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(t => {
          if (breathPhase === 'Ready') { setBreathPhase('Inhale'); return 1; }
          if (breathPhase === 'Inhale' && t >= 4) { setBreathPhase('Hold'); return 1; }
          if (breathPhase === 'Hold' && t >= 7) { setBreathPhase('Exhale'); return 1; }
          if (breathPhase === 'Exhale' && t >= 8) { setBreathPhase('Inhale'); return 1; }
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
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">Module 02</span>
        <h1 className="text-4xl font-bold text-white mt-2">Mind Toolbox</h1>
        <p className="text-gray-400 mt-2">Stabilizing your planet's ecosystem with the 4-7-8 method.</p>
      </header>

      <audio ref={audioRef} src={AUDIO_URL} loop />

      <section className="mb-16">
        <div className="glass-card p-8 md:p-16 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`absolute inset-0 bg-emerald-500/5 transition-all duration-1000 ${breathPhase !== 'Ready' ? 'opacity-100' : 'opacity-0'}`}></div>
          
          <div className="text-center mb-10 z-10">
            <h3 className="text-2xl font-bold text-white mb-2">{phaseDetails[breathPhase].text}</h3>
            <p className="text-emerald-400/80 italic text-sm">{phaseDetails[breathPhase].tip}</p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-white/10 flex items-center justify-center relative mb-12">
               <div 
                 className={`absolute rounded-full bg-gradient-to-tr from-emerald-400/40 to-cyan-400/40 transition-all duration-[4000ms] ease-in-out
                 ${breathPhase === 'Inhale' ? 'w-full h-full scale-100 opacity-60' : ''}
                 ${breathPhase === 'Hold' ? 'w-full h-full scale-100 opacity-80' : ''}
                 ${breathPhase === 'Exhale' ? 'w-1/4 h-1/4 scale-50 opacity-20' : ''}
                 ${breathPhase === 'Ready' ? 'w-0 h-0 scale-0 opacity-0' : ''}
                 `}
                 style={{ transitionDuration: breathPhase === 'Inhale' ? '4000ms' : breathPhase === 'Hold' ? '0ms' : '8000ms' }}
               ></div>
               <div className="z-20 text-center">
                  <span className="text-6xl font-black text-white drop-shadow-lg">{timer}</span>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-bold mt-2">Seconds</p>
               </div>
            </div>

            <div className="flex gap-4 mb-10">
              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                className={`px-10 py-4 rounded-2xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${isPlaying ? 'bg-rose-500' : 'bg-emerald-600 shadow-emerald-500/20'}`}
              >
                <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'} mr-2`}></i>
                {isPlaying ? 'End Session' : 'Start 4-7-8 Breathing'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Inhale", time: "4s", desc: "Through nose, filling the lungs completely." },
          { title: "Hold", time: "7s", desc: "Oxygenating your blood stream." },
          { title: "Exhale", time: "8s", desc: "Vocalize a 'whoosh' to release stress." }
        ].map((step, i) => (
          <div key={i} className={`glass-card p-6 rounded-2xl border-l-4 ${breathPhase === step.title ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 opacity-50'}`}>
            <h4 className="text-white font-bold">{step.title} ({step.time})</h4>
            <p className="text-xs text-gray-400 mt-2">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Module2;
