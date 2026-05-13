import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Message } from '../types';

interface ChatProps {
  messages: Message[];
}

const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 15); // Adjust typing speed here
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [index, text, onComplete]);

  return <p className="text-sm leading-relaxed relative z-10">{displayedText}</p>;
};

const Chat: React.FC<ChatProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (instant = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: instant ? 'auto' : 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShowScrollButton(!isAtBottom && messages.length > 0);
  };

  return (
    <div className="flex-1 w-full relative max-w-lg mx-auto min-h-0">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto px-4 pt-8 pb-32 flex flex-col gap-6 custom-scrollbar scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl backdrop-blur-xl border ${
                  msg.sender === 'user'
                    ? 'bg-red-500/10 border-red-500/30 text-white rounded-tr-none'
                    : 'bg-white/5 border-white/10 text-gray-200 rounded-tl-none'
                } shadow-xl relative overflow-hidden group`}
              >
                {/* Holographic Scanline Effect for AI messages */}
                {msg.sender === 'myra' && (
                  <div className="absolute inset-x-0 h-[1px] bg-red-500/20 top-0 animate-[scan_2s_linear_infinite]" 
                    style={{ 
                      backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,23,68,0.5), transparent)',
                      animation: 'scanline 3s linear infinite'
                    }} 
                  />
                )}

                {msg.sender === 'myra' && i === messages.length - 1 ? (
                  <TypewriterText text={msg.text} onComplete={() => scrollToBottom(false)} />
                ) : (
                  <p className="text-sm leading-relaxed relative z-10">{msg.text}</p>
                )}
                
                <div className={`text-[8px] mt-1 opacity-40 font-mono tracking-tighter ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                {msg.sender === 'myra' && (
                  <div className="absolute top-2 left-1 w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Scroll Down Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full bg-red-600/80 text-white shadow-lg backdrop-blur-sm border border-white/20 hover:bg-red-500 transition-colors z-20"
          >
            <ChevronDown size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
