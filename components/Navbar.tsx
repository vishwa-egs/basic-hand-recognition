import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Home, Info, HelpCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const navItems = [
    { to: "/", label: 'Home', icon: <Home className="w-4 h-4 mr-1" /> },
    { to: "/detect", label: 'Live Cam', icon: <Camera className="w-4 h-4 mr-1" /> },
    { to: "/gestures", label: 'Gestures', icon: <Info className="w-4 h-4 mr-1" /> },
    { to: "/about", label: 'About', icon: <HelpCircle className="w-4 h-4 mr-1" /> },
  ];

  return (
    <>
      {/* Desktop / Top Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-cyan-400 font-bold text-xl flex items-center gap-2">
                <Camera className="w-8 h-8" />
                <span>HandSigns AI</span>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-800'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Bottom Menu Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 p-2 pb-4 flex justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-md text-xs font-medium transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-400'
              }`
            }
          >
            {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6 mb-1" })}
            {item.label}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Navbar;