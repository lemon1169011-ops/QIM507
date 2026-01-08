
import React, { useState } from 'react';

const Module1: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  const moods = [
    { id: 'sunny', icon: 'fa-sun', label: 'Radiant', color: 'text-yellow-400', bg: 'bg-yellow-400/10', desc: 'Feeling confident and energized.' },
    { id: 'cloudy', icon: 'fa-cloud-sun', label: 'Balanced', color: 'text-blue-300', bg: 'bg-blue-300/10', desc: 'Steady but a bit quiet today.' },
    { id: 'rainy', icon: 'fa-cloud-showers-heavy', label: 'Heavy', color: 'text-indigo-400', bg: 'bg-indigo-400/10', desc: 'Feeling overwhelmed or sad.' },
    { id: 'stormy', icon: 'fa-bolt', label: 'Turbulent', color: 'text-red-400', bg: 'bg-red-400/10', desc: 'Anxious or frustrated right now.' },
    { id: 'foggy', icon: 'fa-smog', label: 'Misty', color: 'text-gray-400', bg: 'bg-gray-400/10', desc: 'Confused or physically exhausted.' },
  ];

  const pptSlides = [
    { 
      title: "Slide 1: The Masks of Stress", 
      content: "Why do you feel tired even when you aren't doing 'anything'? \n\nStress doesn't always look like 'being busy'. It wears masks like procrastination, anger, or even deep fatigue. Identifying the mask is the first step to taking it off.",
      why: "Psycho-education: Labeling an emotion reduces its power over you. It moves the processing from the emotional amygdala to the rational prefrontal cortex."
    },
    { 
      title: "Slide 2: The Anxiety Alarm", 
      content: "Mask: Over-worrying & Brain Loops. \n\nAnxiety is your planet's internal alarm system being stuck in 'ON'. It's trying to protect you from future threats, but it's wasting your energy today.",
      why: "Insight: Understanding anxiety as a protective mechanism gone into overdrive helps reduce self-blame."
    },
    { 
      title: "Slide 3: The Depressive Fog", 
      content: "Mask: Loss of Interest & 'Laziness'. \n\nWhen stress becomes chronic, your planet enters 'Power Save Mode'. You aren't lazy; your emotional battery is simply empty and needs a recharge.",
      why: "Self-Compassion: Understanding that withdrawal is a survival strategy, not a failure, is key to starting the recovery process."
    },
    { 
      title: "Slide 4: Learned Helplessness", 
      content: "Mask: 'What's the point?'. \n\nRepeated academic setbacks can make you feel like your effort doesn't matter. This is a cognitive trap. Your actions STILL have power, even if they feel small.",
      why: "Empowerment: Breaking the cycle of 'effort is useless' through small, manageable wins allows you to rebuild confidence."
    },
    { 
      title: "Slide 5: Recognition = Recovery", 
      content: "The path home: Acceptance. \n\nOnce you see the mask, you can say: 'I see you, Anxiety.' Now, you can use your tools—like breathing or social connection—to begin true healing.",
      why: "Action: Moving from passive suffering to active management starts with simple recognition of the current state."
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <span className="text-cyan-400 font-bold tracking-widest text-sm uppercase">Module 01</span>
        <h1 className="text-3xl font-bold text-white mt-2">Identify Your Weather: Deconstructing the Masks</h1>
        <p className="mt-4 text-gray-400 leading-relaxed">
          Before we can fix the planet, we must map its storms. Understanding the "Why" behind your feelings is the key to mental resilience.
        </p>
      </header>

      {/* Quick Mood Check-in */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-satellite-dish text-cyan-400"></i> Quick Weather Check-in
        </h2>
        <div className="glass-card p-8 rounded-3xl">
          <p className="text-gray-300 mb-8 text-sm">How is your "Internal Weather" right now? Identifying it immediately lowers your cognitive load and helps Nova understand you better.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setCurrentMood(mood.id)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all border ${currentMood === mood.id ? 'border-cyan-500 scale-105 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'border-white/5 hover:bg-white/5'}`}
              >
                <i className={`fas ${mood.icon} text-3xl mb-3 ${mood.color}`}></i>
                <span className="text-xs font-bold text-white uppercase tracking-tighter">{mood.label}</span>
              </button>
            ))}
          </div>
          {currentMood && (
            <div className="mt-8 p-6 bg-white/5 rounded-2xl border-l-4 border-cyan-500 animate-in fade-in slide-in-from-left-4">
              <h4 className="font-bold text-white mb-1">Planet Status: {moods.find(m => m.id === currentMood)?.label}</h4>
              <p className="text-sm text-gray-400">{moods.find(m => m.id === currentMood)?.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* PPT Interactive */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-file-powerpoint text-orange-400"></i> Core Presentation: The Masks
        </h2>
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Psych-Ed Card {activeSlide + 1} / {pptSlides.length}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                onClick={() => setActiveSlide(prev => Math.min(pptSlides.length - 1, prev + 1))}
                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="p-10 md:p-16 min-h-[400px] flex flex-col justify-center bg-gradient-to-br from-slate-950 to-indigo-950">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">{pptSlides[activeSlide].title}</h3>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed mb-8 text-sm md:text-base">{pptSlides[activeSlide].content}</p>
            <div className="mt-auto pt-6 border-t border-white/5">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">The "Why":</span>
              <p className="text-xs text-gray-500 italic mt-1">{pptSlides[activeSlide].why}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Module1;
