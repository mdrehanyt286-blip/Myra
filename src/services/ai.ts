import { GoogleGenAI } from "@google/genai";

export const getAIResponse = async (prompt: string, systemInstruction: string, chatHistory: any[], userApiKey?: string) => {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "GEMINI_API_KEY is missing. Please set it in Settings.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const options: any = {
      model: "gemini-3-flash-preview",
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.9,
        topP: 0.95,
      },
      tools: [
        {
          googleSearch: {}
        }
      ]
    };

    const response = await ai.models.generateContent(options);

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my neural network. Please check my energy core (API key).";
  }
};
