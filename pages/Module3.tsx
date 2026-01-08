import React, { useState } from 'react';

const Module3: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedMoon, setSelectedMoon] = useState<number | null>(null);
  
  // 状态：每个轨道的动态距离加成 (0-100)
  const [orbitDistances, setOrbitDistances] = useState<Record<number, number>>({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0
  });

  const videoChannels = [
    { type: 'youtube', id: "jfKfPfyJRdk", title: "Nebula Lofi Station" },
    { type: 'youtube', id: "RefIZ5PeiTs", title: "Stellar Ambient Echoes" },
    { type: 'youtube', id: "HGjmC_zsp9M", title: "Ocean Serenity (Healing)" }
  ];

  const orbitNodes = [
    { label: "Family", baseOrbit: 1, icon: "fa-house-user", color: "bg-amber-500", desc: "Your primary support system. These are the roots of your planet." },
    { label: "Friends", baseOrbit: 2, icon: "fa-user-friends", color: "bg-cyan-500", desc: "The peers who share your atmosphere. Support through connection." },
    { label: "Mentors", baseOrbit: 2, icon: "fa-graduation-cap", color: "bg-indigo-500", desc: "Guides who help you navigate the gravity of school and goals." },
    { label: "Self-Care", baseOrbit: 0.5, icon: "fa-heart", color: "bg-rose-500", desc: "The Core: Your personal habits, sleep, and self-kindness." },
    { label: "Counseling", baseOrbit: 3, icon: "fa-user-md", color: "bg-emerald-500", desc: "Professional navigators for when the space weather gets extreme." }
  ];

  const adjustDistance = (idx: number, delta: number) => {
    setOrbitDistances(prev => ({
      ...prev,
      [idx]: Math.max(-40, Math.min(40, prev[idx] + delta))
    }));
  };

  const renderVideoPlayer = () => {
    const video = videoChannels[currentVideo];
    return (
      <iframe
        src={`https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1&loop=1&playlist=${video.id}`}
        className="w-full h-full border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Healing Space"
      ></iframe>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <span className="text-amber-400 font-bold tracking-widest text-sm uppercase">Module 03</span>
        <h1 className="text-4xl font-bold text-white mt-2">The Support Orbit</h1>
        <p className="text-gray-400 mt-2">Building your social network for stability.</p>
      </header>

      <section className="mb-20">
        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
           <i className="fas fa-atom text-amber-500"></i> Building Your Human Orbit
        </h2>
        
        <div className="glass-card p-12 rounded-[3.5rem] relative flex flex-col md:flex-row items-center justify-between gap-12 border-white/5 bg-slate-950/20 overflow-hidden">
           {/* Visual Orbit Map */}
           <div className="relative w-full md:w-[400px] h-[400px] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 planet-glow z-20 flex items-center justify-center">
                 <span className="text-[8px] font-black text-white uppercase tracking-tighter">YOU</span>
              </div>
              
              <div className="absolute w-36 h-36 rounded-full border border-white/10 border-dashed"></div>
              <div className="absolute w-56 h-56 rounded-full border border-white/10 border-solid"></div>
              <div className="absolute w-[280px] h-[280px] rounded-full border border-white/5 border-double"></div>

              {orbitNodes.map((node, i) => {
                const angle = (i * 360) / orbitNodes.length;
                const radius = (70 + node.baseOrbit * 50) + (orbitDistances[i] || 0);
                return (
                  <button 
                    key={i}
                    onClick={() => setSelectedMoon(i)}
                    className={`absolute z-30 w-12 h-12 rounded-full ${node.color} flex items-center justify-center shadow-xl transition-all duration-700 hover:ring-4 ring-white/30`}
                    style={{
                      transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
                    }}
                  >
                    <i className={`fas ${node.icon} text-white`}></i>
                  </button>
                );
              })}
           </div>

           {/* Info Box & Distance Controls */}
           <div className="flex-grow glass-card p-10 rounded-3xl border-white/10 bg-white/5 min-h-[340px] flex flex-col justify-center">
              {selectedMoon !== null ? (
                <div className="animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest ${orbitNodes[selectedMoon].color}`}>
                      Satellite Profile
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => adjustDistance(selectedMoon, -15)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
                        title="Pull Closer (Strengthen connection)"
                      >
                        <i className="fas fa-magnet"></i>
                      </button>
                      <button 
                        onClick={() => adjustDistance(selectedMoon, 15)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
                        title="Push Away (Set boundaries)"
                      >
                        <i className="fas fa-arrows-alt-h"></i>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{orbitNodes[selectedMoon].label}</h3>
                  <p className="text-gray-400 text-lg italic mb-4">"{orbitNodes[selectedMoon].desc}"</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest">Orbit Status: {orbitDistances[selectedMoon] < 0 ? 'Reinforced Core' : orbitDistances[selectedMoon] > 0 ? 'Safe Buffer' : 'Nominal Orbit'}</p>
                </div>
              ) : (
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">Your Human Galaxy</h3>
                  <p className="text-gray-400">Click a satellite to view details. Use the <i className="fas fa-magnet"></i> to bring support closer, or the <i className="fas fa-arrows-alt-h"></i> to adjust your emotional boundaries.</p>
                </div>
              )}
           </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-play-circle text-purple-500"></i> Healing Cinema
        </h2>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scroll-hide">
          {videoChannels.map((v, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentVideo(i)} 
              className={`px-6 py-3 rounded-xl text-[10px] font-bold transition-all border ${currentVideo === i ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}
            >
              {v.title}
            </button>
          ))}
        </div>
        <div className="glass-card p-1 rounded-[2.5rem] overflow-hidden shadow-2xl border border-purple-500/20">
          <div className="aspect-video bg-black">
            {renderVideoPlayer()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Module3;
