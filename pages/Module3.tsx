
import React, { useState, useEffect } from 'react';

type SupportRole = { id: string; label: string; icon: string; category: string };

const Module3: React.FC = () => {
  const roles: SupportRole[] = [
    { id: 'parent', label: 'Parent', icon: 'fa-house-user', category: 'Family' },
    { id: 'bff', label: 'BFF', icon: 'fa-heart', category: 'Peers' },
    { id: 'teacher', label: 'Teacher', icon: 'fa-chalkboard-teacher', category: 'Mentors' },
    { id: 'counselor', label: 'Counselor', icon: 'fa-user-md', category: 'Experts' },
    { id: 'pet', label: 'Pet', icon: 'fa-paw', category: 'Family' },
    { id: 'mentor', label: 'Mentor', icon: 'fa-user-graduate', category: 'Mentors' },
  ];

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [currentVideo, setCurrentVideo] = useState(0);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // Dynamically set origin for GitHub Pages compatibility
    setOrigin(window.location.origin);
  }, []);

  const handlePlace = (roleId: string, orbitId: string) => {
    setPlacements(prev => ({ ...prev, [roleId]: orbitId }));
  };

  // High-stability video IDs from reputable channels (Lofi Girl, Relaxing Music)
  const videoChannels = [
    {
      id: "jfKfPfyJRdk", // Lofi Girl - Study Beats (Extremely Stable)
      title: "Nebula Lofi Station",
      desc: "Endless low-fidelity beats. A consistent rhythmic companion that acts as a 'white noise' shield for your planet."
    },
    {
      id: "DWcPDo0962I", // Rainy Coffee Shop (High Quality)
      title: "Rainy Haven Cabin",
      desc: "The sound of rain hitting glass in a cozy cabin. This visual helps ground your senses when anxiety feels like a storm."
    },
    {
      id: "n_LnkSIsC94", // Ocean Waves (Nature Relaxation)
      title: "Deep Sea Serenity",
      desc: "Slow motion waves and deep blue hues. Ideal for synchronizing with the 4-7-8 breathing technique from Module 2."
    }
  ];

  const getEmbedUrl = (videoId: string) => {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: videoId, // Mandatory for loop=1 to work
      modestbranding: '1',
      rel: '0',
      origin: origin || 'https://github.io'
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <span className="text-amber-400 font-bold tracking-widest text-sm uppercase">Module 03</span>
        <h1 className="text-3xl font-bold text-white mt-2">The Support Orbit: No Planet is an Island</h1>
        <p className="mt-4 text-gray-400 leading-relaxed">
          In space, gravity holds everything together. In life, that gravity is your support network. Recognizing your allies is the first step toward long-term resilience.
        </p>
      </header>

      {/* Interactive Support Map */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-satellite text-green-400"></i> Interactive Social Map
        </h2>
        
        <div className="glass-card p-8 rounded-3xl flex flex-col lg:flex-row gap-12">
          {/* Visual Orbit Map */}
          <div className="relative w-full lg:w-1/2 aspect-square flex items-center justify-center border border-white/5 rounded-full bg-black/20 overflow-hidden shadow-inner">
            <div className="absolute w-[95%] h-[95%] border border-dashed border-purple-500/20 rounded-full flex items-start justify-center pt-2">
              <span className="text-[7px] uppercase tracking-widest text-purple-400/30">Satellite</span>
            </div>
            <div className="absolute w-[65%] h-[65%] border border-dashed border-blue-500/20 rounded-full flex items-start justify-center pt-2">
              <span className="text-[7px] uppercase tracking-widest text-blue-400/30">Stable Orbit</span>
            </div>
            <div className="absolute w-[35%] h-[35%] border border-dashed border-green-500/20 rounded-full flex items-start justify-center pt-2">
              <span className="text-[7px] uppercase tracking-widest text-green-400/30">Inner Core</span>
            </div>
            
            <div className="z-10 w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <span className="text-white text-[9px] font-bold uppercase">Me</span>
            </div>

            {Object.entries(placements).map(([roleId, orbit]) => {
              const role = roles.find(r => r.id === roleId);
              if (!role) return null;
              const posIndex = roles.indexOf(role);
              const angle = (posIndex / roles.length) * 2 * Math.PI;
              const distance = orbit === 'core' ? 22 : orbit === 'stable' ? 38 : 48;
              const left = 50 + distance * Math.cos(angle);
              const top = 50 + distance * Math.sin(angle);

              return (
                <div 
                  key={roleId}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center text-white shadow-lg transition-all duration-700 animate-in zoom-in"
                >
                  <i className={`fas ${role.icon} text-[10px]`}></i>
                  <div className="absolute -bottom-4 text-[7px] uppercase font-bold text-gray-400 whitespace-nowrap">{role.label}</div>
                </div>
              );
            })}
          </div>

          <div className="flex-grow space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Assign Your Allies</h3>
            {roles.map(role => (
              <div key={role.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-cyan-500/10 flex items-center justify-center">
                    <i className={`fas ${role.icon} text-cyan-400 text-[10px]`}></i>
                  </div>
                  <span className="text-xs text-white">{role.label}</span>
                </div>
                <div className="flex gap-1">
                  {['core', 'stable', 'sat'].map(orb => (
                    <button
                      key={orb}
                      onClick={() => handlePlace(role.id, orb)}
                      className={`text-[8px] px-2 py-1.5 rounded-md uppercase font-bold transition-all ${placements[role.id] === orb ? 'bg-cyan-600 text-white shadow-md' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      {orb}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Healing Cinema Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-film text-purple-400"></i> Healing Cinema
          </h2>
          <div className="flex gap-2">
            {videoChannels.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentVideo(idx)}
                className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${currentVideo === idx ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-1 rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl">
          <div className="relative aspect-video bg-black/60 group">
            <iframe
              key={videoChannels[currentVideo].id}
              src={getEmbedUrl(videoChannels[currentVideo].id)}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Healing Space"
            ></iframe>
            
            {/* Hover Fallback */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="bg-purple-600/90 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                Playing Channel {currentVideo + 1}
              </div>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-b from-white/5 to-transparent">
            <h3 className="text-white font-bold text-sm uppercase tracking-tighter flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              {videoChannels[currentVideo].title}
            </h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed italic">{videoChannels[currentVideo].desc}</p>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
              <p className="text-[9px] text-gray-500 uppercase font-medium">Video not loading?</p>
              <a 
                href={`https://www.youtube.com/watch?v=${videoChannels[currentVideo].id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-white/10 text-white text-[9px] px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 transition-all"
              >
                <i className="fab fa-youtube text-red-500"></i> Open in YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center text-gray-500 italic text-[10px] mb-12">
        "Just like a planet needs a star, a student needs a system. Choose your orbits wisely."
      </section>
    </div>
  );
};

export default Module3;
