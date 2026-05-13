import React, { useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AIState } from '../types';

interface MicButtonProps {
  state: AIState;
  onPressStart: () => void;
  onPressEnd: () => void;
  onReset: () => void;
  hasMessages: boolean;
}

const MicButton: React.FC<MicButtonProps> = ({ state, onPressStart, onPressEnd, onReset, hasMessages }) => {
  const isListening = state === 'listening';
  const isMuted = state === 'idle';

  let buttonColor = "bg-red-500";
  let textColor = "text-white";
  let glowColor = "shadow-red-500/50";

  if (state === 'thinking') {
    buttonColor = "bg-cyan-500";
    glowColor = "shadow-cyan-500/50";
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex items-center gap-6">
        {/* Reset Button */}
        {hasMessages && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onReset}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:border-red-500/30 transition-all"
            title="Clear Chat"
          >
            <MicOff size={18} />
          </motion.button>
        )}

        <motion.button
          onPointerDown={(e) => {
            e.preventDefault();
            onPressStart();
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            onPressEnd();
          }}
          onPointerLeave={(e) => {
            if (isListening) onPressEnd();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-24 h-12 rounded-full flex items-center justify-center ${buttonColor} ${textColor} shadow-lg ${glowColor} border-2 border-white/20 transition-colors duration-500 touch-none`}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
               <motion.div
                 key="mic"
                 initial={{ scale: 0 }}
                 animate={{ scale: 1.2 }}
                 exit={{ scale: 0 }}
               >
                 <Mic size={24} />
               </motion.div>
            ) : (
              <motion.div
                key="micoff"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {state === 'thinking' ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Mic size={24} />}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple Effect */}
          {isListening && (
             <motion.div
               initial={{ scale: 0.8, opacity: 0.5 }}
               animate={{ scale: 2.2, opacity: 0 }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute inset-0 rounded-full border-2 border-red-500"
             />
          )}
        </motion.button>

        {/* Empty space to balance the reset button if needed */}
        {hasMessages && <div className="w-11" />}
      </div>
      
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold">
          {state === 'idle' ? 'HOLD TO SPEAK' : state.toUpperCase()}
        </span>
        {state === 'idle' && (
          <span className="text-[8px] uppercase tracking-widest text-white/20 mt-1">
            RELEASE TO SEND
          </span>
        )}
      </div>
    </div>
  );
};

export default MicButton;
