import React from 'react';
import { GESTURE_DICTIONARY } from '../constants';

const GestureInfo: React.FC = () => {
  const validGestures = Object.values(GESTURE_DICTIONARY).filter(g => g.id !== 'none');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 p-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Gesture Library
          </h2>
          <p className="text-slate-400">
            List of all detectable hand signs and their meanings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validGestures.map((item) => (
            <div 
              key={item.id} 
              className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-700 rounded-xl text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                  {item.icon}
                </div>
                <span className="text-xs font-mono text-slate-500 border border-slate-600 px-2 py-1 rounded">
                  ID: {item.id}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">
                {item.name}
              </h3>
              
              <div className="h-px w-12 bg-cyan-500/50 my-3"></div>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GestureInfo;