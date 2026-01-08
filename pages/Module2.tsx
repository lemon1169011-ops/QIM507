import React, { useState, useRef, useEffect } from 'react';

const Module2: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const AUDIO_URL = "https://www.bensound.com/bensound-music/bensound-relaxing.mp3"; 

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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">Module 02</span>
        <h1 className="text-3xl font-bold text-white mt-2">Mind Toolbox</h1>
      </header>

      <audio ref={audioRef} src={AUDIO_URL} loop />

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6">Meditation: Planet Reset</h2>
        <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-blue-900/40 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-grow">
            <h3 className="font-bold text-white text-lg">5-Minute Guided Meditation</h3>
            <p className="text-sm text-gray-400 mt-2 mb-6">Close your eyes. Imagine looking down at your unique planet... see those clouds of stress? It's okay. Breathe light into the fog.</p>
            <div className="flex items-center gap-4">
               <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full bg-cyan-400 transition-all duration-1000 ${isPlaying ? 'w-full' : 'w-0'}`}></div>
               </div>
            </div>
          </div>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-2xl transition-all hover:scale-110 ${isPlaying ? 'bg-rose-500' : 'bg-cyan-600'}`}>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-6">4-7-8 Breathing Guide</h2>
        <div className="glass-card p-8 rounded-3xl border-l-4 border-emerald-500 grid md:grid-cols-3 gap-6">
           <div className="p-4 bg-white/5 rounded-2xl text-center">
              <p className="text-2xl font-bold text-emerald-400">4s</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Inhale (Nose)</p>
           </div>
           <div className="p-4 bg-white/5 rounded-2xl text-center">
              <p className="text-2xl font-bold text-emerald-400">7s</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Hold</p>
           </div>
           <div className="p-4 bg-white/5 rounded-2xl text-center">
              <p className="text-2xl font-bold text-emerald-400">8s</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Exhale (Mouth)</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Module2;