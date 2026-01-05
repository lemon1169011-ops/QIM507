
import React, { useState } from 'react';

const Assessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'quiz' | 'feedback' | 'done'>('quiz');
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  const quizQuestions = [
    {
      q: "When you feel a racing heart and sweaty palms before an exam, this is likely:",
      options: ["General weakness", "The Fight or Flight response", "Heart disease", "Memory loss"],
      a: 1
    },
    {
      q: "In '4-7-8 Breathing', how many seconds do you hold your breath?",
      options: ["4 seconds", "7 seconds", "8 seconds", "10 seconds"],
      a: 1
    },
    {
      q: "According to NVC principles, the first step in communication is:",
      options: ["Expressing anger", "Making a demand", "Stating an observation of facts", "Asking for an apology"],
      a: 2
    },
    {
      q: "In the 'MindPlanet' concept, who belongs to the 'Core Ring'?",
      options: ["Principals", "Study partners", "Friends you can call for support at any time", "Strangers online"],
      a: 2
    },
    {
      q: "The core goal of mindfulness meditation is:",
      options: ["Clearing all thoughts", "Forcing yourself to sleep", "Observing the present without judgment", "Recalling happy memories"],
      a: 2
    }
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let calculatedScore = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.a) calculatedScore += 1;
    });
    setScore(calculatedScore);
    setCurrentStep('feedback');
  };

  const getNovaEval = () => {
    if (score === 5) return "Absolute Planet Guardian! You have mastered the orbits of resilience. Your inner world is in excellent hands.";
    if (score >= 3) return "Great Navigator. You've got the essentials down. Keep practicing the 4-7-8 method—it's your best friend in a storm.";
    return "New Traveler. Don't worry! Mastery takes time. Re-read the 'Masks of Stress' to better understand your signals.";
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {currentStep === 'quiz' && (
        <section className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Final Orbit: Resilience Check</h2>
            <span className="text-xs text-gray-500 uppercase tracking-widest">{Object.keys(userAnswers).length} / {quizQuestions.length} Answered</span>
          </div>
          <form onSubmit={handleQuizSubmit} className="space-y-6">
            {quizQuestions.map((item, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-white font-medium mb-4 text-sm">{idx + 1}. {item.q}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {item.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: i }))}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all ${userAnswers[idx] === i ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px]">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button 
              type="submit" 
              disabled={Object.keys(userAnswers).length < quizQuestions.length}
              className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-cyan-600/20"
            >
              Analyze My Results
            </button>
          </form>
        </section>
      )}

      {currentStep === 'feedback' && (
        <section className="animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-white mb-4">Course Feedback</h2>
          <p className="text-gray-400 mb-8">Your feedback helps Nova evolve the platform for others.</p>
          <div className="glass-card p-8 rounded-3xl space-y-8">
            <div>
              <p className="text-white font-medium mb-4">1. How satisfied are you with the "Planet Voyage"?</p>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} className="flex-grow aspect-square md:aspect-auto md:h-12 rounded-xl border border-white/10 hover:bg-cyan-500 flex items-center justify-center text-white transition-all text-sm font-bold">{n}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-medium mb-4">2. Any message for your mentor Nova?</p>
              <textarea 
                placeholder="I learned that my anxiety is actually just a mask..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                rows={3}
              ></textarea>
            </div>
            <button onClick={() => setCurrentStep('done')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all">
              Complete Assessment
            </button>
          </div>
        </section>
      )}

      {currentStep === 'done' && (
        <section className="text-center py-10 animate-in zoom-in duration-500">
          <div className="relative inline-block mb-10">
            <div className="w-32 h-32 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-5xl shadow-2xl animate-bounce">
              <i className="fas fa-certificate"></i>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-900 w-12 h-12 rounded-full border-4 border-[#0f0f1a] flex items-center justify-center font-bold text-lg">
              {score * 20}%
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Voyage Certified!</h2>
          <div className="bg-white/5 p-6 rounded-2xl mb-12 border-l-4 border-cyan-500 text-left max-w-lg mx-auto">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Nova's Evaluation</span>
            <p className="text-gray-300 mt-2 italic leading-relaxed">"{getNovaEval()}"</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-cyan-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-cyan-600/30 transition-all">
              Download Gardener Certificate
            </button>
            <button onClick={() => window.location.hash = "/"} className="glass-card text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
              Return to Orbit
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Assessment;
