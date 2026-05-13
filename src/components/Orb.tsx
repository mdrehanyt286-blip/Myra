import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AIState, PersonalityMode } from '../types';

interface OrbProps {
  state: AIState;
  mode: PersonalityMode;
}

const Orb: React.FC<OrbProps> = ({ state, mode }) => {
  const isGf = mode === 'gf';
  const isProf = mode === 'professional';
  
  const getThemeColors = () => {
    if (isGf) return { core: '#FF1744', outer: '#D500F9', glow: 'rgba(213, 0, 249, 0.4)' };
    if (isProf) return { core: '#40C4FF', outer: '#00B0FF', glow: 'rgba(64, 196, 255, 0.4)' };
    return { core: '#FF1744', outer: '#651FFF', glow: 'rgba(255, 23, 68, 0.4)' };
  };

  const colors = getThemeColors();

  const getAnimationProps = () => {
    switch (state) {
      case 'listening':
        return {
          scale: [1, 1.15, 1],
          opacity: [0.8, 1, 0.8],
          transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
        };
      case 'thinking':
        return {
          rotate: [0, 360],
          scale: [1, 0.95, 1],
          transition: { duration: 2, repeat: Infinity, ease: "linear" }
        };
      case 'speaking':
        return {
          scale: [1, 1.05, 1, 1.1, 1],
          transition: { duration: 0.4, repeat: Infinity, ease: "anticipate" }
        };
      default:
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        };
    }
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Background Glow */}
      <motion.div
        animate={{ 
          scale: state === 'listening' ? 1.5 : 1.2,
          opacity: state === 'idle' ? 0.3 : 0.6 
        }}
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ backgroundColor: colors.glow }}
      />
      
      {/* Outer Rotating Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: state === 'thinking' ? 2 : 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full border-2 border-dashed rounded-full opacity-20"
        style={{ borderColor: colors.outer }}
      />

      {/* Energy Rings */}
      <AnimatePresence>
        {state === 'speaking' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-full h-full border-2 rounded-full"
            style={{ borderColor: colors.core }}
          />
        )}
      </AnimatePresence>

      {/* Main Core */}
      <motion.div
        animate={getAnimationProps()}
        className="relative w-48 h-48 rounded-full shadow-2xl overflow-hidden flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${colors.core}, ${colors.outer})`,
          boxShadow: `0 0 50px ${colors.glow}, inset 0 0 30px rgba(255,255,255,0.2)`
        }}
      >
        {/* Holographic Texture */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        
        {/* Core Highlight */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full blur-xl opacity-40 shrink-0" />
        
        {/* Reactive Particles (Simulated with div pulses) */}
        {state !== 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
             {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 100],
                    y: [0, (Math.random() - 0.5) * 100],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-2 h-2 rounded-full bg-white blur-sm opacity-50"
                />
             ))}
          </div>
        )}
      </motion.div>

      {/* Personality Modifiers */}
      {mode === 'gf' && (
        <div className="absolute -top-4 -right-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            💖
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orb;
