import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Cpu, Zap, Globe } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    { icon: <Cpu />, title: "AI Powered", desc: "Uses advanced MediaPipe topology for tracking." },
    { icon: <Zap />, title: "Real-Time", desc: "Low latency inference (<10ms) entirely in browser." },
    { icon: <Globe />, title: "Voice Feedback", desc: "Full support for English voice output." },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 pb-24 md:pb-6">
      
      <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
          <span className="text-cyan-400 font-semibold tracking-wider text-sm uppercase">Computer Vision Project</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 pb-2">
          Real-Time Hand Gesture Recognition
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 font-light">
          Powered by MediaPipe & Machine Learning
        </p>
        
        <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed">
          Detects hand signs instantly using your webcam with voice feedback support.
        </p>

        <div className="pt-8">
          <Link 
            to="/detect"
            className="inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-cyan-500/30 transition-all transform hover:scale-105"
          >
            <Camera className="w-6 h-6" />
            Start Detection
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/30 transition-colors">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-cyan-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;