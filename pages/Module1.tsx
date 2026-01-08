
import React, { useState } from 'react';

const Module1: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  const moods = [
    { id: 'sunny', icon: 'fa-sun', label: 'Radiant', color: 'text-yellow-400', desc: 'Feeling confident and energized.' },
    { id: 'cloudy', icon: 'fa-cloud-sun', label: 'Balanced', color: 'text-blue-300', desc: 'Steady but a bit quiet today.' },
    { id: 'rainy', icon: 'fa-cloud-showers-heavy', label: 'Heavy', color: 'text-indigo-400', desc: 'Feeling overwhelmed or sad.' },
    { id: 'stormy', icon: 'fa-bolt', label: 'Turbulent', color: 'text-red-400', desc: 'Anxious or frustrated right now.' },
    { id: 'foggy', icon: 'fa-smog', label: 'Misty', color: 'text-gray-400', desc: 'Confused or physically exhausted.' },
  ];

  const pptSlides = [
    { 
      title: "The Masks of Stress", 
      content: "Stress wears masks like procrastination or deep fatigue. Identifying the mask is the first step.",
      insight: "Labeling emotions reduces their power over you."
    },
    { 
      title: "The Anxiety Alarm", 
      content: "Anxiety is your planet's internal alarm system being stuck in 'ON'. Your body is preparing for a battle that isn't there.",
      insight: "It is a protective mechanism gone into overdrive."
    },
    { 
      title: "The Depressive Fog", 
      content: "When stress is chronic, your planet enters 'Power Save Mode'. You aren't lazy; your system is preserving energy to survive.",
      insight: "Withdrawal is a survival strategy, not a failure."
    },
    { 
      title: "Atmospheric Pressure", 
      content: "Academic and social expectations act like gravity. Too much gravity makes it hard to move, but zero gravity makes us drift away.",
      insight: "Healthy pressure (Eustress) actually helps us grow."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <span className="text-cyan-400 font-bold tracking-widest text-sm uppercase">Module 01</span>
        <h1 className="text-4xl font-bold text-white mt-2">Identify Your Weather</h1>
        <p className="text-gray-400 mt-2">Learning to read the atmosphere of your inner world.</p>
      </header>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-satellite-dish text-cyan-500"></i> Quick Weather Check-in
        </h2>
        <div className="glass-card p-8 rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setCurrentMood(mood.id)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all border ${currentMood === mood.id ? 'border-cyan-500 bg-cyan-500/10 scale-105 ring-4 ring-cyan-500/20' : 'border-white/5 hover:bg-white/5'}`}
              >
                <i className={`fas ${mood.icon} text-3xl mb-3 ${mood.color}`}></i>
                <span className="text-[10px] font-bold text-white uppercase">{mood.label}</span>
              </button>
            ))}
          </div>
          {currentMood && (
            <div className="mt-8 p-6 bg-white/5 rounded-2xl border-l-4 border-cyan-500 animate-in slide-in-from-left-4">
              <h4 className="font-bold text-white flex items-center gap-2">
                 Current Outlook: {moods.find(m => m.id === currentMood)?.label}
              </h4>
              <p className="text-sm text-gray-400 mt-1">{moods.find(m => m.id === currentMood)?.desc}</p>
            </div>
          )}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-project-diagram text-cyan-500"></i> Deep Dive: Stress Patterns
        </h2>
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center bg-gradient-to-br from-slate-950 to-indigo-950 relative">
            <div className="absolute top-4 right-8 text-cyan-800 text-6xl font-bold opacity-20">0{activeSlide + 1}</div>
            <h3 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">{pptSlides[activeSlide].title}</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">{pptSlides[activeSlide].content}</p>
            <div className="bg-cyan-500/10 p-5 rounded-2xl mb-10 border border-cyan-500/20">
               <p className="text-xs text-cyan-400 font-bold uppercase mb-2 tracking-widest">Psychological Insight:</p>
               <p className="text-gray-300 italic">"{pptSlides[activeSlide].insight}"</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))} 
                className="px-8 py-3 text-sm font-bold text-white bg-white/10 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-30"
                disabled={activeSlide === 0}
              >
                Previous
              </button>
              <button 
                onClick={() => setActiveSlide(prev => Math.min(pptSlides.length - 1, prev + 1))} 
                className="px-8 py-3 text-sm font-bold text-white bg-cyan-600 rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-30"
                disabled={activeSlide === pptSlides.length - 1}
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border-b-4 border-red-500/50">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-red-400"></i> Storm Warnings
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2"><i className="fas fa-check-circle text-red-500/50 mt-1"></i> Sudden changes in sleep patterns</li>
            <li className="flex items-start gap-2"><i className="fas fa-check-circle text-red-500/50 mt-1"></i> Increased irritability or "short fuse"</li>
            <li className="flex items-start gap-2"><i className="fas fa-check-circle text-red-500/50 mt-1"></i> Difficulty concentrating on small tasks</li>
          </ul>
        </div>
        <div className="glass-card p-6 rounded-3xl border-b-4 border-emerald-500/50">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-umbrella text-emerald-400"></i> Emotional Resilience
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Resilience isn't avoiding the storm, but learning to sail through it. By identifying your weather early, you can deploy your toolbox before the clouds break.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Module1;
