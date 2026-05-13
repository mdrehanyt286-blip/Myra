import React, { useState, useEffect } from 'react';
import { Settings, Battery, Cpu, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onSettingsClick: () => void;
  activeVoice: string;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, activeVoice }) => {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(85);
  const [ram, setRam] = useState(4.2);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const statTimer = setInterval(() => {
      setRam(prev => Math.max(3.0, Math.min(6.0, prev + (Math.random() - 0.5) * 0.1)));
    }, 3000);
    return () => {
      clearInterval(timer);
      clearInterval(statTimer);
    };
  }, []);

  return (
    <div className="w-full h-16 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md border-b border-red-500/10">
      {/* Left: Stats */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-red-500">
          <Battery size={12} />
          <span>{battery}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-red-500">
          <Cpu size={12} />
          <span>{ram.toFixed(1)}GB</span>
        </div>
      </div>

      {/* Center: Title */}
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold tracking-[0.2em] text-white glow-text">MYRA</h1>
        <div className="flex items-center gap-2">
           <span className="text-[8px] tracking-[0.1em] text-red-400 font-medium">AI COMPANION</span>
           {activeVoice && <span className="text-[7px] text-white/30 border border-white/10 px-1 rounded uppercase font-mono">{activeVoice}</span>}
        </div>
      </div>

      {/* Right: Time & Settings */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs font-mono text-white/80">
          <Clock size={12} />
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onSettingsClick}
          className="p-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Settings size={18} />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};

export default Header;
