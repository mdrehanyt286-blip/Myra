import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, User, Heart, Briefcase, Bot, Key } from 'lucide-react';
import { AppSettings, PersonalityMode } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => {
        const v = window.speechSynthesis.getVoices();
        setVoices(v);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const personalityModes: { id: PersonalityMode; label: string; icon: any; color: string }[] = [
    { id: 'assistant', label: 'Assistant', icon: Bot, color: 'border-purple-500 text-purple-400' },
    { id: 'gf', label: 'GF Mode', icon: Heart, color: 'border-red-500 text-red-500' },
    { id: 'professional', label: 'Professional', icon: Briefcase, color: 'border-cyan-500 text-cyan-400' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md max-h-[90vh] bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold tracking-widest text-white">SYSTEM CONFIG</h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 md:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
              {/* User Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">User Identity</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    type="text"
                    value={localSettings.userName}
                    onChange={(e) => setLocalSettings({ ...localSettings, userName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="Enter Name"
                  />
                </div>
              </div>

              {/* Personality Modes */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Personality Core</label>
                <div className="grid grid-cols-3 gap-2">
                  {personalityModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setLocalSettings({ ...localSettings, personality: mode.id })}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                        localSettings.personality === mode.id
                          ? `${mode.color} bg-white/5 scale-105 shadow-lg`
                          : 'border-white/5 text-white/40 hover:bg-white/5'
                      }`}
                    >
                      <mode.icon size={20} />
                      <span className="text-[10px] font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Model (Simulation) */}
               <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Neural Engine</label>
                <select 
                   value={localSettings.model}
                   onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm appearance-none focus:outline-none"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Intelligent)</option>
                </select>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Gemini API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter API Key..."
                    value={localSettings.apiKey}
                    onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-red-500/50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <Key size={14} />
                  </div>
                </div>
                <p className="text-[9px] text-white/30 italic px-1">Keys are stored locally in your browser.</p>
              </div>

              {/* Neural Voice Selection */}
              <div className="space-y-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Neural Voice System</label>
                  <span className="text-[9px] bg-red-600/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20 font-bold tracking-tighter">ALEXA READY</span>
                </div>
                <div className="relative">
                  <select 
                    value={localSettings.voice}
                    onChange={(e) => setLocalSettings({ ...localSettings, voice: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 px-4 text-white text-sm appearance-none focus:outline-none focus:border-red-500/50 shadow-inner"
                  >
                    <option value="">Native Audio (Human Voice) — DEFAULT</option>
                    <optgroup label="PREMIUM NEURAL (AI)">
                      <option value="Aoede">✨ Aoede (Female) — Smooth</option>
                      <option value="Charon">✨ Charon (Male) — Deep</option>
                      <option value="Kore">✨ Kore (Female) — Crisp</option>
                      <option value="Fenrir">✨ Fenrir (Male) — Bold</option>
                      <option value="Puck">✨ Puck (Male) — Playful</option>
                      <option value="Leda">✨ Leda (Female) — Warm</option>
                      <option value="Orus">✨ Orus (Male) — Epic</option>
                      <option value="Zephyr">✨ Zephyr (Female) — Ethereal</option>
                    </optgroup>
                    <optgroup label="LOCAL SYSTEM VOICES">
                      {voices.map((v, i) => (
                        <option key={`${v.name}-${i}`} value={v.name}>
                          {v.name.includes('Natural') || v.name.includes('Premium') ? '✨ ' : ''}
                          {v.name.split(' (')[0]}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <Bot size={14} />
                  </div>
                </div>
                <p className="text-[9px] text-white/30 italic leading-tight">Neural voices (✨) provide the most natural "Alexa-style" experience.</p>
              </div>

              {/* Clarity Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Speed: {localSettings.voiceRate?.toFixed(1) || '1.0'}</label>
                  <input 
                    type="range" min="0.5" max="1.5" step="0.1"
                    value={localSettings.voiceRate || 1.0}
                    onChange={(e) => setLocalSettings({ ...localSettings, voiceRate: parseFloat(e.target.value) })}
                    className="w-full accent-red-600 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Pitch: {localSettings.voicePitch?.toFixed(1) || '1.0'}</label>
                  <input 
                    type="range" min="0.5" max="1.5" step="0.1"
                    value={localSettings.voicePitch || 1.0}
                    onChange={(e) => setLocalSettings({ ...localSettings, voicePitch: parseFloat(e.target.value) })}
                    className="w-full accent-red-600 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Continuous Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">Continuous Mode</p>
                  <p className="text-[10px] text-white/40 uppercase font-mono">Auto-Listen after speech</p>
                </div>
                <button
                  onClick={() => setLocalSettings({ ...localSettings, continuousMode: !localSettings.continuousMode })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.continuousMode ? 'bg-red-600' : 'bg-gray-800'}`}
                >
                  <motion.div
                    animate={{ x: localSettings.continuousMode ? 26 : 2 }}
                    className="absolute top-1 left-0.5 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSave(localSettings)}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
              >
                <Save size={18} />
                INITIALIZE CHANGES
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Settings;
