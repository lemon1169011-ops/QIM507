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
      content: "Anxiety is your planet's internal alarm system being stuck in 'ON'.",
      insight: "It is a protective mechanism gone into overdrive."
    },
    { 
      title: "The Depressive Fog", 
      content: "When stress is chronic, your planet enters 'Power Save Mode'. You aren't lazy; you are empty.",
      insight: "Withdrawal is a survival strategy, not a failure."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <span className="text-cyan-400 font-bold tracking-widest text-sm uppercase">Module 01</span>
        <h1 className="text-3xl font-bold text-white mt-2">Identify Your Weather</h1>
      </header>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6">Quick Weather Check-in</h2>
        <div className="glass-card p-8 rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setCurrentMood(mood.id)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all border ${currentMood === mood.id ? 'border-cyan-500 bg-cyan-500/10 scale-105' : 'border-white/5 hover:bg-white/5'}`}
              >
                <i className={`fas ${mood.icon} text-3xl mb-3 ${mood.color}`}></i>
                <span className="text-[10px] font-bold text-white uppercase">{mood.label}</span>
              </button>
            ))}
          </div>
          {currentMood && (
            <div className="mt-8 p-6 bg-white/5 rounded-2xl border-l-4 border-cyan-500 animate-in slide-in-from-left-4">
              <h4 className="font-bold text-white">Status: {moods.find(m => m.id === currentMood)?.label}</h4>
              <p className="text-sm text-gray-400 mt-1">{moods.find(m => m.id === currentMood)?.desc}</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-6">Presentation: The Masks</h2>
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-10 min-h-[300px] flex flex-col justify-center bg-gradient-to-br from-slate-950 to-indigo-950">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">{pptSlides[activeSlide].title}</h3>
            <p className="text-gray-300 leading-relaxed mb-8">{pptSlides[activeSlide].content}</p>
            <div className="bg-cyan-500/10 p-4 rounded-xl mb-8 border border-cyan-500/20">
               <p className="text-xs text-cyan-400 font-bold uppercase mb-1">Psychological Insight:</p>
               <p className="text-sm text-gray-300 italic">{pptSlides[activeSlide].insight}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))} 
                className="px-6 py-2 text-sm text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30"
                disabled={activeSlide === 0}
              >
                Prev
              </button>
              <button 
                onClick={() => setActiveSlide(prev => Math.min(pptSlides.length - 1, prev + 1))} 
                className="px-6 py-2 text-sm text-white bg-cyan-600 rounded-full hover:bg-cyan-500 transition-colors disabled:opacity-30"
                disabled={activeSlide === pptSlides.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Module1;
