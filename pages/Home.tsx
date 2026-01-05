
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      {/* Hero Banner */}
      <section className="text-center mb-20">
        <div className="mb-8 relative inline-block">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-cyan-600 via-blue-500 to-indigo-500 planet-glow mx-auto flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
          </div>
          <div className="absolute -top-4 -right-4 bg-cyan-400 text-slate-900 font-bold px-3 py-1 rounded-full text-sm animate-bounce">
            Your Orbit
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
          In a high-pressure world,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Care for your inner orbit</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          MindPlanet: Not just learning stress management, but starting an interstellar voyage to protect your inner home.
        </p>
      </section>

      {/* Nova Welcome */}
      <section className="glass-card p-8 rounded-3xl mb-12 flex flex-col md:flex-row gap-8 items-center border-l-4 border-cyan-500">
        <div className="w-24 h-24 flex-shrink-0 bg-slate-800 rounded-2xl flex items-center justify-center ring-4 ring-cyan-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>
          <div className="z-10 flex flex-col items-center gap-1">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-75"></div>
            </div>
            <i className="fas fa-robot text-3xl text-cyan-500"></i>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">I am Nova, your AI Mentor</h3>
          <p className="text-gray-300 leading-relaxed italic">
            "Hey there! Welcome to MindPlanet. In this coordinate, we don't talk about grades, rankings, or endless exam papers. I've been in the 'sea of questions' too, feeling suffocated. I'm here to help you build your own emotional defense system. Let's turn that heavy pressure into the stardust that nourishes your planet."
          </p>
        </div>
      </section>

      {/* Learning Objectives */}
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <i className="fas fa-eye text-blue-400 text-xl"></i>
          </div>
          <h4 className="font-bold text-white mb-2">Identify Weather</h4>
          <p className="text-sm text-gray-400 leading-relaxed">Accurately recognize physical and mental stress signals to see the true face of your 'emotional weather'.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
            <i className="fas fa-magic text-emerald-400 text-xl"></i>
          </div>
          <h4 className="font-bold text-white mb-2">Equip Toolbox</h4>
          <p className="text-sm text-gray-400 leading-relaxed">Master breathing techniques and mindfulness to regain control when academic anxiety strikes.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
            <i className="fas fa-heart text-indigo-400 text-xl"></i>
          </div>
          <h4 className="font-bold text-white mb-2">Connect Systems</h4>
          <p className="text-sm text-gray-400 leading-relaxed">Build deep self-compassion and learn scientific communication to gain real social support.</p>
        </div>
      </section>

      {/* Navigation Guide */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-white mb-8">Start Your Voyage</h2>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to="/module1" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-cyan-500/20">
            Enter Module 1: Identify Your Weather
          </Link>
          <Link to="/pro" className="glass-card hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all">
            Explore Pro Services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
