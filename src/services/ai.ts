import { GoogleGenAI } from "@google/genai";

export const getAIResponse = async (prompt: string, systemInstruction: string, chatHistory: any[], userApiKey?: string, modelName: string = "gemini-1.5-flash") => {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "GEMINI_API_KEY is missing. Please set it in Settings.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const result = await ai.models.generateContent({
      model: modelName,
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.9,
        topP: 0.95,
      }
    });

    return result.text || "My neural pathways are quiet right now...";
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    
    // Explicit check for permission/key errors
    const errorMessage = error?.message?.toLowerCase() || "";
    if (errorMessage.includes("api_key_invalid") || errorMessage.includes("invalid api key") || errorMessage.includes("401")) {
      return "Activation Failed: The API key entered is invalid. Please check your system settings.";
    }

    // Fallback if the requested model is not found/supported
    if (modelName !== "gemini-1.5-flash") {
       console.log("Model failure, falling back to 1.5 Flash...");
       return getAIResponse(prompt, systemInstruction, chatHistory, userApiKey, "gemini-1.5-flash");
    }
    
    return `Neural Link Failed: ${error?.message || "Check your API key and connection"}`;
  }
};
