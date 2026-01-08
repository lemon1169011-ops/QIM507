import React, { useState } from 'react';

const Module3: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoChannels = [
    { id: "jfKfPfyJRdk", title: "Nebula Lofi Station" },
    { id: "RefIZ5PeiTs", title: "Stellar Ambient Echoes" },
    { id: "n_LnkSIsC94", title: "Deep Sea Serenity" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <span className="text-amber-400 font-bold tracking-widest text-sm uppercase">Module 03</span>
        <h1 className="text-3xl font-bold text-white mt-2">The Support Orbit</h1>
      </header>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6">Healing Cinema</h2>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scroll-hide">
          {videoChannels.map((v, i) => (
            <button key={i} onClick={() => setCurrentVideo(i)} className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${currentVideo === i ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
              Channel {i + 1}: {v.title}
            </button>
          ))}
        </div>
        <div className="glass-card p-1 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoChannels[currentVideo].id}?autoplay=1&mute=1&loop=1&playlist=${videoChannels[currentVideo].id}`}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Healing Space"
            ></iframe>
          </div>
        </div>
      </section>
      
      <section className="glass-card p-8 rounded-3xl border-t-4 border-amber-500">
         <h2 className="text-xl font-bold text-white mb-4">Building Your Human Orbit</h2>
         <p className="text-gray-400 leading-relaxed text-sm mb-6">Real-world resilience isn't a solo mission. It involves choosing who enters your orbit. Identify your "Safe Moons" — friends or adults who listen without judging.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors">
               <h4 className="text-white font-bold text-sm mb-1">Active Listening</h4>
               <p className="text-xs text-gray-500 italic">Listening for the emotion, not just the facts.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors">
               <h4 className="text-white font-bold text-sm mb-1">Healthy Boundaries</h4>
               <p className="text-xs text-gray-500 italic">Knowing when to say 'no' to protect your fuel.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Module3;