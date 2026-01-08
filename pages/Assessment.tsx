import React, { useState } from 'react';

const Assessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'quiz' | 'feedback' | 'done'>('quiz');
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  const quizQuestions = [
    { q: "Heart racing before an exam is usually:", options: ["Weakness", "Fight or Flight", "Heart Disease"], a: 1 },
    { q: "4-7-8 Breathing hold duration:", options: ["4s", "7s", "8s"], a: 1 },
    { q: "Main goal of mindfulness:", options: ["Clear thoughts", "Judgment-free observation", "Sleep"], a: 1 }
  ];

  const handleSubmit = () => {
    let s = 0;
    quizQuestions.forEach((q, i) => { if(userAnswers[i] === q.a) s++; });
    setScore(s);
    setCurrentStep('feedback');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {currentStep === 'quiz' && (
        <section>
          <header className="mb-12">
            <span className="text-cyan-400 font-bold tracking-widest text-sm uppercase">Assessment</span>
            <h1 className="text-3xl font-bold text-white mt-2">Final Orbit: Resilience Check</h1>
          </header>
          <div className="space-y-6">
            {quizQuestions.map((q, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 0.1}s` }}>
                <p className="text-white mb-4 font-medium">{idx+1}. {q.q}</p>
                <div className="grid gap-3">
                  {q.options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => setUserAnswers({...userAnswers, [idx]: i})} 
                      className={`p-4 rounded-xl border text-sm text-left transition-all ${userAnswers[idx] === i ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button 
              onClick={handleSubmit} 
              className="w-full bg-cyan-600 hover:bg-cyan-500 py-5 rounded-2xl text-white font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-8"
              disabled={Object.keys(userAnswers).length < quizQuestions.length}
            >
              Analyze My Resilience
            </button>
          </div>
        </section>
      )}
      {currentStep === 'feedback' && (
        <section className="text-center py-20 glass-card rounded-3xl animate-in fade-in">
          <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
             <i className="fas fa-rocket text-4xl text-cyan-400"></i>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Voyage Certified!</h2>
          <p className="text-gray-400 mb-8">You've mastered the core coordinates of mental well-being.</p>
          <p className="text-cyan-400 text-7xl font-bold mb-12">{score}/{quizQuestions.length}</p>
          <button onClick={() => setCurrentStep('done')} className="bg-emerald-600 hover:bg-emerald-500 px-12 py-4 rounded-full text-white font-bold transition-all shadow-lg">Finalize Mission</button>
        </section>
      )}
      {currentStep === 'done' && (
        <div className="text-center py-20 animate-in zoom-in">
          <i className="fas fa-certificate text-8xl text-yellow-400 mb-8 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]"></i>
          <h3 className="text-3xl text-white font-bold mb-4">Official Planet Gardener</h3>
          <p className="text-gray-400 max-w-md mx-auto">You have the tools to protect your inner orbit. Remember, every planet has seasons. Nova will always be here to help.</p>
        </div>
      )}
    </div>
  );
};

export default Assessment;
