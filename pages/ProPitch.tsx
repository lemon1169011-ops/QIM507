import React from 'react';

const ProPitch: React.FC = () => {
  const surveyUrl = "https://v.wjx.cn/vm/w0MCXQC.aspx";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(surveyUrl)}&bgcolor=1a1a2e&color=ffffff`;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-center animate-in fade-in duration-700">
      <div className="inline-block p-2 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-6">
         <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest px-4">Deep Space Exploration</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Upgrade Your "MindPlanet" Pack</h1>
      <p className="text-gray-400 max-w-xl mx-auto mb-12">Unlock hyper-advanced resilience tools, 1-on-1 AI guided sessions, and exclusive interstellar healing cinema.</p>
      
      <div className="grid md:grid-cols-2 gap-8 mt-12 mb-20">
        <div className="glass-card p-10 rounded-[2.5rem] opacity-60 border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Basic Explorer</h3>
            <p className="text-3xl font-bold mt-4 text-white">$0 <span className="text-sm font-normal text-gray-500">/ forever</span></p>
            <ul className="mt-8 space-y-4 text-left text-sm text-gray-400">
               <li><i className="fas fa-check text-cyan-500 mr-2"></i> Standard Learning Modules</li>
               <li><i className="fas fa-check text-cyan-500 mr-2"></i> Basic AI Support</li>
               <li><i className="fas fa-check text-cyan-500 mr-2"></i> Public Healing Cinema</li>
            </ul>
          </div>
          <button disabled className="mt-10 w-full py-4 bg-white/5 text-gray-500 rounded-2xl cursor-not-allowed">Current Tier</button>
        </div>
        
        <div className="glass-card p-10 rounded-[2.5rem] border-2 border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-cyan-500 text-slate-900 text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-tighter">Recommended</div>
          <div>
            <h3 className="text-xl font-bold text-white">Pro Navigator</h3>
            <p className="text-3xl font-bold mt-4 text-cyan-400">$2.99 <span className="text-sm font-normal text-gray-400">/ mo</span></p>
            <ul className="mt-8 space-y-4 text-left text-sm text-gray-300">
               <li><i className="fas fa-check text-cyan-400 mr-2"></i> Advanced "Deep Space" Modules</li>
               <li><i className="fas fa-check text-cyan-400 mr-2"></i> 24/7 Personalized AI Coaching</li>
               <li><i className="fas fa-check text-cyan-400 mr-2"></i> Offline Mindfulness Tracks</li>
               <li><i className="fas fa-check text-cyan-400 mr-2"></i> Digital Certificate of Resilience</li>
            </ul>
          </div>
          <button className="mt-10 w-full py-4 bg-cyan-600 text-white rounded-2xl font-bold hover:bg-cyan-500 transition-all shadow-lg hover:shadow-cyan-500/30 active:scale-95">Upgrade Mission</button>
        </div>
      </div>

      {/* Survey Mission Section */}
      <section className="glass-card p-12 rounded-[3.5rem] border border-cyan-500/20 bg-gradient-to-br from-slate-900/50 to-cyan-900/20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-grow text-left">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <i className="fas fa-clipboard-list text-cyan-400"></i> Galaxy Feedback Mission
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Help us calibrate our planet's atmosphere! Complete this small survey to share your experience and help Nova better support explorers like you.
            </p>
            <a 
              href={surveyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
            >
              Start Survey Mission <i className="fas fa-external-link-alt text-xs"></i>
            </a>
          </div>
          <div className="flex-shrink-0 bg-white p-4 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <img 
              src={qrCodeUrl} 
              alt="Survey QR Code" 
              className="w-40 h-40"
            />
            <p className="text-[10px] text-slate-800 font-bold mt-2 uppercase text-center">Scan to Start</p>
          </div>
        </div>
      </section>
      
      <p className="mt-12 text-xs text-gray-600 italic">Supported by SDG 3 global health initiatives. 15% of proceeds go to youth mental health charities.</p>
    </div>
  );
};

export default ProPitch;
