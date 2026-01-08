
import React, { useState } from 'react';

const Module3: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedMoon, setSelectedMoon] = useState<number | null>(null);

  const videoChannels = [
    { type: 'youtube', id: "jfKfPfyJRdk", title: "Nebula Lofi Station" },
    { type: 'youtube', id: "RefIZ5PeiTs", title: "Stellar Ambient Echoes" },
    { type: 'bilibili', id: "BYTKPJp", title: "Bilibili Serenity (Inner Peace)" }
  ];

  const orbitNodes = [
    { label: "Family", orbit: 1, icon: "fa-house-user", color: "bg-amber-500", desc: "Your primary support. Those who know your journey from the start." },
    { label: "Friends", orbit: 2, icon: "fa-user-friends", color: "bg-cyan-500", desc: "The shared orbit. Peer support who understand your daily atmospheric pressure." },
    { label: "Mentors", orbit: 2, icon: "fa-graduation-cap", color: "bg-indigo-500", desc: "Guides who help you navigate the gravity of school and future goals." },
    { label: "Self-Care", orbit: 0, icon: "fa-heart", color: "bg-rose-500", desc: "The Planet Core. Your own habits, sleep, and kindness to yourself." },
    { label: "Professional", orbit: 3, icon: "fa-user-md", color: "bg-emerald-500", desc: "Expert navigators like counselors for when the space weather gets extreme." }
  ];

  const renderVideoPlayer = () => {
    const video = videoChannels[currentVideo];
    if (video.type === 'bilibili') {
      return (
        <iframe
          src={`//player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1&autoplay=0`}
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
        <p className="text-gray-400 mt-2">No planet exists in isolation. Map your network of stars.</p>
      </header>

      <section className="mb-20">
        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
           <i className="fas fa-atom text-amber-500"></i> Building Your Human Orbit
        </h2>
        
        <div className="glass-card p-4 md:p-12 rounded-[3rem] relative min-h-[500px] flex flex-col md:flex-row items-center justify-between gap-12 border-white/5 overflow-hidden">
           {/* Visual Orbit Map */}
           <div className="relative w-full md:w-[400px] h-[400px] flex items-center justify-center">
              {/* Central Planet (User) */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 planet-glow z-20 flex items-center justify-center ring-4 ring-white/10 shadow-2xl">
                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">YOU</span>
              </div>
              
              {/* Orbits */}
              <div className="absolute w-40 h-40 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute w-64 h-64 rounded-full border border-white/5 animate-[spin_40s_linear_infinite_reverse]"></div>
              <div className="absolute w-[320px] h-[320px] rounded-full border border-white/5 opacity-50"></div>

              {/* Orbiting Moons */}
              {orbitNodes.map((node, i) => {
                const angle = (i * 360) / orbitNodes.length;
                const radius = 60 + node.orbit * 50;
                return (
                  <button 
                    key={i}
                    onClick={() => setSelectedMoon(i)}
                    className={`absolute z-30 w-12 h-12 rounded-full ${node.color} flex items-center justify-center shadow-xl hover:scale-125 transition-all hover:ring-4 ring-white/20`}
                    style={{
                      transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
                    }}
                  >
                    <i className={`fas ${node.icon} text-white`}></i>
                  </button>
                );
              })}
           </div>

           {/* Info Box */}
           <div className="flex-grow glass-card p-8 rounded-3xl border-white/10 bg-white/5 min-h-[250px] flex flex-col justify-center animate-in fade-in">
              {selectedMoon !== null ? (
                <div className="animate-in slide-in-from-right-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase ${orbitNodes[selectedMoon].color}`}>
                    Orbit {orbitNodes[selectedMoon].orbit === 0 ? 'Core' : orbitNodes[selectedMoon].orbit}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-4 mb-2">{orbitNodes[selectedMoon].label}</h3>
                  <p className="text-gray-400 leading-relaxed italic">"{orbitNodes[selectedMoon].desc}"</p>
                </div>
              ) : (
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">Explore Your Network</h3>
                  <p className="text-gray-400">Click on the orbiting satellites to identify the people and habits that keep your planet stable.</p>
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
              className={`px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${currentVideo === i ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
            >
              <i className={`fas ${v.type === 'bilibili' ? 'fa-tv' : 'fa-film'} mr-2`}></i>
              Channel {i + 1}: {v.title}
            </button>
          ))}
        </div>
        <div className="glass-card p-1 rounded-[2rem] overflow-hidden shadow-2xl border border-purple-500/20">
          <div className="aspect-video bg-black">
            {renderVideoPlayer()}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
         <div className="glass-card p-8 rounded-3xl border-t-4 border-amber-500">
            <h4 className="text-white font-bold mb-3">Healthy Boundaries</h4>
            <p className="text-sm text-gray-400">Your orbit has limited space. It's okay to say 'no' to things that drain your planet's atmosphere. Protect your core energy first.</p>
         </div>
         <div className="glass-card p-8 rounded-3xl border-t-4 border-cyan-500">
            <h4 className="text-white font-bold mb-3">Safe Moons</h4>
            <p className="text-sm text-gray-400">Identify at least three people who listen without judging. These are your "Safe Moons" during cosmic storms.</p>
         </div>
      </section>
    </div>
  );
};

export default Module3;
