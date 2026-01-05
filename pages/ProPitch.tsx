
import React from 'react';

const ProPitch: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">Premium Service</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Upgrade Your "MindPlanet" Energy Pack</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Free mode gets you started, Pro mode gets you through. We offer more than just lessons—we offer real-time companionship.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Free Plan */}
        <div className="glass-card p-8 rounded-3xl opacity-60 border border-white/5">
          <h3 className="text-xl font-bold text-white mb-2">Basic (Free)</h3>
          <p className="text-3xl font-bold text-white mb-6">$ 0 <span className="text-sm font-normal text-gray-500">/ forever</span></p>
          <ul className="space-y-4 mb-8 text-sm text-gray-400">
            <li><i className="fas fa-check text-green-500 mr-2"></i> Core Resilience Course</li>
            <li><i className="fas fa-check text-green-500 mr-2"></i> Nova Basic AI Support</li>
            <li><i className="fas fa-check text-green-500 mr-2"></i> Community Discussions</li>
            <li className="line-through opacity-30"><i className="fas fa-times mr-2"></i> 1-on-1 Human Specialist</li>
            <li className="line-through opacity-30"><i className="fas fa-times mr-2"></i> Deep Personality Reports</li>
          </ul>
          <button disabled className="w-full py-3 rounded-xl bg-white/10 text-gray-500 font-bold">Active</button>
        </div>

        {/* Pro Plan */}
        <div className="glass-card p-8 rounded-3xl border-2 border-cyan-500 shadow-2xl shadow-cyan-500/20 relative">
          <div className="absolute -top-4 right-8 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
          <h3 className="text-xl font-bold text-white mb-2">Pro Navigator</h3>
          <p className="text-3xl font-bold text-cyan-400 mb-6">$ 2.99 <span className="text-sm font-normal text-gray-500">/ month</span></p>
          <ul className="space-y-4 mb-8 text-sm text-gray-200">
            <li><i className="fas fa-check-circle text-cyan-400 mr-2"></i> <strong>24/7 Human Counselor Access</strong></li>
            <li><i className="fas fa-check-circle text-cyan-400 mr-2"></i> <strong>MBTI & Career Deep Assessment</strong></li>
            <li><i className="fas fa-check-circle text-cyan-400 mr-2"></i> <strong>HD Lossless Meditation Audio</strong></li>
            <li><i className="fas fa-check-circle text-cyan-400 mr-2"></i> Monthly Expert Live Seminars</li>
            <li><i className="fas fa-check-circle text-cyan-400 mr-2"></i> Personalized Planet Decorations</li>
          </ul>
          <button className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-600/30">
            Upgrade Now
          </button>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl text-center">
        <h4 className="font-bold text-white mb-4">Sustainability & Social Impact</h4>
        <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mx-auto">
          MindPlanet uses a "Freemium" model to ensure every student has access to mental health education. Your Pro fees help us provide free counseling quotas to students in underserved areas.
        </p>
      </div>
    </div>
  );
};

export default ProPitch;
