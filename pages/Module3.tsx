import React, { useState } from 'react';

const Module3: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedMoon, setSelectedMoon] = useState<number | null>(null);

  const videoChannels = [
    { type: 'youtube', id: "jfKfPfyJRdk", title: "Nebula Lofi Station" },
    { type: 'youtube', id: "RefIZ5PeiTs", title: "Stellar Ambient Echoes" },
    { type: 'bilibili', bvid: "BV18K4y1m7rL", title: "Healing Serenity (Deep Sea)" }
  ];

  const orbitNodes = [
    { label: "Family", orbit: 1, icon: "fa-house-user", color: "bg-amber-500", desc: "Your primary support system. These are the roots of your planet." },
    { label: "Friends", orbit: 2, icon: "fa-user-friends", color: "bg-cyan-500", desc: "The peers who share your atmosphere. Support through connection." },
    { label: "Mentors", orbit: 2, icon: "fa-graduation-cap", color: "bg-indigo-500", desc: "Guides who help you navigate the gravity of school and goals." },
    { label: "Self-Care", orbit: 0, icon: "fa-heart", color: "bg-rose-500", desc: "The Core: Your personal habits, sleep, and self-kindness." },
    { label: "Counseling", orbit: 3, icon: "fa-user-md", color: "bg-emerald-500", desc: "Professional navigators for when the space weather gets extreme." }
  ];

  const renderVideoPlayer = () => {
    const video = videoChannels[currentVideo];
    if (video.type === 'bilibili') {
      return (
        <iframe
          src={`//player.bilibili.com/player.html?bvid=${video.bvid}&page=1&autoplay=0`}
          className="w-full h-full border-0"
          allowFullScreen
          title="Bilibili Healing Space"
        ></iframe>
      );
    }
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
        
        <div className="glass-card p-12 rounded-[3.5rem] relative flex flex-col md:flex-row items-center justify-between gap-12 border-white/5 bg-slate-950/20">
           {/* Visual Orbit Map */}
           <div className="relative w-full md:w-[450px] h-[450px] flex items-center justify-center">
              {/* Central Planet (User) */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 planet-glow z-20 flex items-center justify-center ring-4 ring-white/10 shadow-[0_0_60px_rgba(6,182,212,0.4)]">
                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">YOU</span>
              </div>
              
              {/* Visible Orbit Lines */}
              <div className="absolute w-44 h-44 rounded-full border border-white/10 border-dashed animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute w-64 h-64 rounded-full border border-white/10 border-solid animate-[spin_40s_linear_infinite_reverse]"></div>
              <div className="absolute w-[340px] h-[340px] rounded-full border border-white/5 border-double"></div>

              {/* Orbiting Moons */}
              {orbitNodes.map((node, i) => {
                const angle = (i * 360) / orbitNodes.length;
                const radius = 70 + node.orbit * 55;
                return (
                  <button 
                    key={i}
                    onClick={() => setSelectedMoon(i)}
                    className={`absolute z-30 w-14 h-14 rounded-full ${node.color} flex items-center justify-center shadow-2xl hover:scale-125 transition-all hover:ring-4 ring-white/30`}
                    style={{
                      transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
                    }}
                  >
                    <i className={`fas ${node.icon} text-white text-lg`}></i>
                  </button>
                );
              })}
           </div>

           {/* Info Box */}
           <div className="flex-grow glass-card p-10 rounded-3xl border-white/10 bg-white/5 min-h-[300px] flex flex-col justify-center animate-in fade-in">
              {selectedMoon !== null ? (
                <div className="animate-in slide-in-from-right-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest ${orbitNodes[selectedMoon].color}`}>
                    {orbitNodes[selectedMoon].orbit === 0 ? 'Inner Core' : `Orbit Layer ${orbitNodes[selectedMoon].orbit}`}
                  </span>
                  <h3 className="text-3xl font-bold text-white mt-6 mb-4">{orbitNodes[selectedMoon].label}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed italic">"{orbitNodes[selectedMoon].desc}"</p>
                </div>
              ) : (
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">Your Human Galaxy</h3>
                  <p className="text-gray-400 text-lg">Click the orbiting satellites to map out your network of stars. Every satellite represents a source of strength when space weather gets tough.</p>
                </div>
              )}
           </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-play-circle text-purple-500"></i> Healing Cinema
        </h2>
        <div className="flex gap-3 mb-6 overflow-x-auto pb-4 scroll-hide">
          {videoChannels.map((v, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentVideo(i)} 
              className={`px-8 py-4 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${currentVideo === i ? 'bg-purple-600 border-purple-400 text-white shadow-xl shadow-purple-500/20' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              Channel {i + 1}: {v.title}
            </button>
          ))}
        </div>
        <div className="glass-card p-2 rounded-[2.5rem] overflow-hidden shadow-2xl border border-purple-500/30">
          <div className="aspect-video bg-black">
            {renderVideoPlayer()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Module3;
