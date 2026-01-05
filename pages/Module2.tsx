
import React, { useState, useRef, useEffect } from 'react';

const Module2: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set up audio source - Using a royalty-free meditative background track
  const AUDIO_URL = "https://www.bensound.com/bensound-music/bensound-relaxing.mp3"; 

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">Module 02</span>
        <h1 className="text-3xl font-bold text-white mt-2">Mind Toolbox: Cooling Your Planet</h1>
        <p className="mt-4 text-gray-400 leading-relaxed">
          In this module, we learn practical "cooling technologies". When academic pressure makes your planet's surface too hot, these tools are your emergency rescue kit.
        </p>
      </header>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={AUDIO_URL} loop />

      {/* Meditation Script */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-headphones text-blue-400"></i> Meditation: Planet Reset
        </h2>
        <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-blue-900/40 relative overflow-hidden">
          {isPlaying && (
            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none"></div>
          )}
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="font-bold text-white">5-Minute Guided Meditation</h3>
              <p className="text-xs text-gray-400">Voice: Nova | Music: Deep Alpha Waves</p>
            </div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-105 active:scale-95 transition-all ${isPlaying ? 'bg-rose-500' : 'bg-cyan-600'}`}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
          </div>
          
          <div className="p-6 bg-black/30 rounded-2xl relative z-10">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">Script Summary</h4>
            <div className="text-sm text-gray-400 italic space-y-4">
              <p>"Hello, traveler. Close your eyes. Imagine you are floating in space, looking down at your unique planet..."</p>
              <p>"See those clouds of stress? It's okay. Take a deep breath and imagine light piercing through the fog..."</p>
              <p>"Focus on your toes... your knees... your back... if your mind wanders, gently bring it back..."</p>
              <p>"Lastly, tell yourself: 'I am doing enough.' Slowly open your eyes."</p>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Guide Section */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-file-pdf text-rose-400"></i> PDF Guide: First Aid Toolbox
        </h2>
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-emerald-400 mb-4">Mindfulness & Breathing Guide</h3>
          <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed space-y-4">
            <div className="bg-white/5 p-6 rounded-2xl border-l-4 border-emerald-500">
              <h4 className="font-bold text-white mb-2">4-7-8 Breathing Technique</h4>
              <ol className="list-decimal list-inside space-y-2">
                <li>Inhale through your nose for <strong>4</strong> seconds.</li>
                <li>Hold your breath for <strong>7</strong> seconds.</li>
                <li>Exhale through your mouth for <strong>8</strong> seconds.</li>
                <li>Repeat 4 cycles.</li>
              </ol>
            </div>
          </div>
          <button className="mt-8 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
            <i className="fas fa-file-download"></i> Get Full PDF Guide
          </button>
        </div>
      </section>

      {/* Discussion Board */}
      <section>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-comments text-purple-400"></i> Discussion: Galactic Board
        </h2>
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="font-bold text-white mb-2">Today's Topic: Your "Unique" De-stress Tips</h3>
          <p className="text-gray-400 text-sm mb-6">
            Share your tips below! The most-voted post gets the "Senior Planet Gardener" badge!
          </p>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Type your tip here..." 
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold">
              Post
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Module2;
