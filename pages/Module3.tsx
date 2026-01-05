
import React, { useState } from 'react';

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

  const handlePlace = (roleId: string, orbitId: string) => {
    setPlacements(prev => ({ ...prev, [roleId]: orbitId }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <span className="text-amber-400 font-bold tracking-widest text-sm uppercase">Module 03</span>
        <h1 className="text-3xl font-bold text-white mt-2">Building Support Systems: No One is an Island</h1>
        <p className="mt-4 text-gray-400 leading-relaxed">
          Isolation is a gravity well. To stay afloat, we need a network of supporters. Understanding who plays which role in your orbit makes asking for help easier.
        </p>
      </header>

      {/* Interactive Support Map */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-map-marked-alt text-green-400"></i> Interactive Support Map
        </h2>
        
        <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 leading-relaxed">
          <i className="fas fa-info-circle text-cyan-400 mr-2"></i> 
          <strong>Why this matters:</strong> Visualizing your support network reduces the feeling of isolation. 
          <span className="block mt-2 text-xs text-gray-400">
            - <strong>Core:</strong> Immediate emotional safety. <br/>
            - <strong>Stable:</strong> Daily social gravity. <br/>
            - <strong>Satellite:</strong> Expert pulling power.
          </span>
        </div>

        <div className="glass-card p-8 rounded-3xl flex flex-col lg:flex-row gap-12">
          {/* Orbits Visual */}
          <div className="relative w-full lg:w-1/2 aspect-square flex items-center justify-center border border-white/5 rounded-full bg-black/20 overflow-hidden">
            {/* Professional Satellite (Outer) */}
            <div className="absolute w-[95%] h-[95%] border border-dashed border-purple-500/20 rounded-full flex items-start justify-center pt-2">
              <span className="text-[8px] uppercase tracking-widest text-purple-400/40">Satellite Ring</span>
            </div>
            {/* Stable Planet (Middle) */}
            <div className="absolute w-[65%] h-[65%] border border-dashed border-blue-500/20 rounded-full flex items-start justify-center pt-2">
              <span className="text-[8px] uppercase tracking-widest text-blue-400/40">Stable Orbit</span>
            </div>
            {/* Core (Inner) */}
            <div className="absolute w-[35%] h-[35%] border border-dashed border-green-500/20 rounded-full flex items-start justify-center pt-2">
              <span className="text-[8px] uppercase tracking-widest text-green-400/40">Inner Core</span>
            </div>
            
            <div className="z-10 w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/20 flex items-center justify-center border-2 border-white/20">
              <span className="text-white text-[10px] font-bold">YOU</span>
            </div>

            {/* Placed Icons Rendering */}
            {Object.entries(placements).map(([roleId, orbit]) => {
              const role = roles.find(r => r.id === roleId);
              if (!role) return null;
              
              const posIndex = roles.indexOf(role);
              const angle = (posIndex / roles.length) * 2 * Math.PI;
              const distance = orbit === 'core' ? 22 : orbit === 'stable' ? 38 : 50;
              const left = 50 + distance * Math.cos(angle);
              const top = 50 + distance * Math.sin(angle);

              return (
                <div 
                  key={roleId}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center text-sm text-white transition-all duration-700 ease-out shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-in zoom-in spin-in-12"
                >
                  <i className={`fas ${role.icon}`}></i>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex-grow">
            <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Assign to Orbit</h3>
            <div className="space-y-3">
              {roles.map(role => (
                <div key={role.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <i className={`fas ${role.icon} text-cyan-400 text-xs`}></i>
                    </div>
                    <span className="text-xs text-white font-medium">{role.label}</span>
                  </div>
                  <div className="flex gap-1">
                    {['core', 'stable', 'sat'].map(orb => (
                      <button
                        key={orb}
                        onClick={() => handlePlace(role.id, orb)}
                        className={`text-[9px] px-2 py-1.5 rounded-md transition-all font-bold uppercase ${placements[role.id] === orb ? 'bg-cyan-600 text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                      >
                        {orb}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Non-Violent Communication */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-comment-dots text-pink-400"></i> Non-Violent Communication (NVC)
        </h2>
        <div className="mb-6 p-4 bg-pink-900/10 border border-pink-500/20 rounded-xl text-sm text-gray-300">
          NVC is about connecting with yourself and others based on empathy. Use the formula: 
          <span className="text-pink-400 font-bold block mt-1">Observation + Feeling + Need + Request</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border-t-4 border-pink-500">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Scenario: The Note Borrower</span>
            <p className="text-sm text-gray-300 my-4">"A friend keeps asking for your notes, making you feel used."</p>
            <div className="bg-black/30 p-4 rounded-xl space-y-2 border border-white/5">
              <p className="text-[11px] text-gray-500"><span className="text-pink-400">Formula:</span> I saw you ask 3 times (Obs), I feel overwhelmed (Feel), I need to focus on my prep (Need), can you try taking your own today? (Req)</p>
              <p className="text-sm text-white italic border-l-2 border-pink-500 pl-3">"I notice you've asked for my notes often lately. I'm feeling a bit anxious about my own time. I need to prioritize my study tonight, so I can't lend them right now. Can we review together tomorrow instead?"</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl border-t-4 border-blue-500">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Scenario: Parental Comparison</span>
            <p className="text-sm text-gray-300 my-4">"Parents say: 'We had it harder in our day'."</p>
            <div className="bg-black/30 p-4 rounded-xl space-y-2 border border-white/5">
              <p className="text-[11px] text-gray-500"><span className="text-blue-400">Formula:</span> You mentioned your past (Obs), I feel misunderstood (Feel), I need validation (Need), can you just listen for a moment? (Req)</p>
              <p className="text-sm text-white italic border-l-2 border-blue-500 pl-3">"When I hear you talk about your past, I feel like my current struggle isn't being seen. I really need some support right now. Could you please just listen to what's bothering me for five minutes without advice?"</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Module3;
