import React from 'react';
import { Github, Code, Database } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 flex items-center justify-center p-6 pb-24 md:pb-6">
      <div className="max-w-3xl w-full bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            About This Project
          </h1>
          <p className="text-cyan-100">
            Final Year Project / Mini Project Implementation
          </p>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Code className="text-cyan-400" />
              Technical Stack
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-300 mb-1">Frontend</h4>
                <p className="text-slate-400 text-sm">React 18, TypeScript, Tailwind CSS</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-300 mb-1">Machine Learning</h4>
                <p className="text-slate-400 text-sm">MediaPipe Hands, Geometric Classification Engine</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="text-cyan-400" />
              Dataset & Methodology
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Instead of a server-side Python classifier (which adds latency), this project utilizes 
              <strong> Client-Side Edge AI</strong>. It extracts 21 3D landmarks (x, y, z) from the video feed 
              using Google's MediaPipe. These landmarks are processed through a geometric inference engine 
              to determine gesture states based on finger extension and angular relationships.
            </p>
          </section>

          <div className="border-t border-slate-700 pt-6 flex justify-between items-center text-sm text-slate-500">
             <span>v1.0.0 Production Build</span>
             <a href="#" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
               <Github className="w-4 h-4" />
               <span>Source Code</span>
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;