import React, { useState } from 'react';

const Module3: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedMoon, setSelectedMoon] = useState<number | null>(null);
  
  // 状态：每个卫星的自定义半径 (50px 为核心, 200px 为边缘)
  const [orbitRadii, setOrbitRadii] = useState<Record<number, number>>({
    0: 100, // Family
    1: 150, // Friends
    2: 150, // Mentors
    3: 60,  // Self-Care
    4: 180  // Counseling
  });

  const videoChannels = [
    { type: 'youtube', id: "jfKfPfyJRdk", title: "Nebula Lofi" },
    { type: 'youtube', id: "HGjmC_zsp9M", title: "Ocean Serenity" },
    { type: 'youtube', id: "vGOidyC6GgA", title: "Cosmic Short (New)" }
  ];

  const orbitNodes = [
    { label: "Family", icon: "fa-house-user", color: "bg-amber-500", desc: "Your primary support system. These are the roots of your planet." },
    { label: "Friends", icon: "fa-user-friends", color: "bg-cyan-500", desc: "The peers who share your atmosphere. Support through connection." },
    { label: "Mentors", icon: "fa-graduation-cap", color: "bg-indigo-500", desc: "Guides who help you navigate the gravity of school and goals." },
    { label: "Self-Care", icon: "fa-heart", color: "bg-rose-500", desc: "The Core: Your personal habits, sleep, and self-kindness." },
    { label: "Counseling", icon: "fa-user-md", color: "bg-emerald-500", desc: "Professional navigators for extreme space weather." }
  ];

  const handleRadiusChange = (idx: number, val: string) => {
    setOrbitRadii(prev => ({
      ...prev,
      [idx]: parseInt(val)
    }));
  };

  const renderVideoPlayer = () => {
    const video = videoChannels[currentVideo];
    // 处理 YouTube Shorts 的嵌入逻辑
    const embedId = video.id.includes('v=') ? video.id.split('v=')[1] : video.id;
    return (
      <iframe
        src={`https://www.youtube.com/embed/${embedId}?autoplay=0&mute=0&loop=1&playlist=${embedId}`}
        className="w-full h-full border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Healing Cinema"
      ></iframe>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <span className="text-amber-400 font-bold tracking-widest text-sm uppercase">Module 03</span>
        <h1 className="text-4xl font-bold text-white mt-2">The Support Orbit</h1>
        <p className="text-gray-400 mt-2">Adjust your human galaxy to find your perfect equilibrium.</p>
      </header>

      <section className="mb-20">
        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
           <i className="fas fa-atom text-amber-500"></i> Galaxy Mapping
        </h2>
        
        <div className="glass-card p-12 rounded-[3.5rem] relative flex flex-col md:flex-row items-center justify-between gap-12 border-white/5 bg-slate-950/20 overflow-hidden">
           {/* Visual Orbit Map */}
           <div className="relative w-full md:w-[400px] h-[400px] flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_70%)] rounded-full">
              {/* Core Star */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 planet-glow z-20 flex items-center justify-center border border-white/20">
                 <span className="text-[8px] font-black text-white uppercase tracking-tighter">ME</span>
              </div>
              
              {/* Background Orbit Lines (Fixed for reference) */}
              {[80, 130, 180].map((r, i) => (
                <div key={i} className="absolute rounded-full border border-white/5" style={{ width: r*2, height: r*2 }}></div>
              ))}

              {orbitNodes.map((node, i) => {
                const angle = (i * 360) / orbitNodes.length;
                const radius = orbitRadii[i] || 100;
                return (
                  <button 
                    key={i}
                    onClick={() => setSelectedMoon(i)}
                    className={`absolute z-30 w-12 h-12 rounded-full ${node.color} flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 border-2 border-white/10`}
                    style={{
                      transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
                    }}
                  >
                    <i className={`fas ${node.icon} text-white text-sm`}></i>
                  </button>
                );
              })}
           </div>

           {/* Distance Controls */}
           <div className="flex-grow glass-card p-10 rounded-3xl border-white/10 bg-white/5 min-h-[340px] flex flex-col justify-center">
              {selectedMoon !== null ? (
                <div className="animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest ${orbitNodes[selectedMoon].color}`}>
                      Satellite Tuning
                    </span>
                    <button onClick={() => setSelectedMoon(null)} className="text-white/40 hover:text-white">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{orbitNodes[selectedMoon].label}</h3>
                  <p className="text-gray-400 text-sm italic mb-8 leading-relaxed">"{orbitNodes[selectedMoon].desc}"</p>
                  
                  {/* Gravity Slider */}
                  <div className="space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                      <span>Inner Core</span>
                      <span>Outer Space</span>
                    </div>
                    <input 
                      type="range" 
                      min="55" 
                      max="195" 
                      value={orbitRadii[selectedMoon]}
                      onChange={(e) => handleRadiusChange(selectedMoon, e.target.value)}
                      className="w-full accent-cyan-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center">
                      <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                        {orbitRadii[selectedMoon] < 85 ? 'Intimate Bond' : orbitRadii[selectedMoon] > 165 ? 'Outer Perimeter' : 'Comfortable Orbit'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center md:text-left">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                    <i className="fas fa-hand-pointer text-cyan-500"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Your Human Galaxy</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Every relationship is a satellite. Click on a satellite and use the <b>Gravity Slider</b> to move them closer to your core or further into the safety of the perimeter. Your orbit, your rules.
                  </p>
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
              className={`px-6 py-3 rounded-xl text-[10px] font-bold transition-all border shrink-0 ${currentVideo === i ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}
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
