import React from 'react';
import { motion } from 'motion/react';

interface WaveformProps {
  isSpeaking: boolean;
  isListening: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ isSpeaking, isListening }) => {
  const bars = Array.from({ length: 20 });
  const isActive = isSpeaking || isListening;

  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full max-w-xs">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isActive ? [8, Math.random() * 32 + 8, 8] : 4,
            opacity: isActive ? [0.4, 0.8, 0.4] : 0.2,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
          className="w-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(255,23,68,0.5)]"
        />
      ))}
    </div>
  );
};

export default Waveform;
