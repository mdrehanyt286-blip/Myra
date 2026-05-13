
export type AIState = 'idle' | 'listening' | 'thinking' | 'speaking';

export type PersonalityMode = 'assistant' | 'gf' | 'professional';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'myra';
  timestamp: number;
}

export interface AppSettings {
  userName: string;
  personality: PersonalityMode;
  model: string;
  voice: string;
  voiceRate: number;
  voicePitch: number;
  continuousMode: boolean;
  apiKey: string;
}
