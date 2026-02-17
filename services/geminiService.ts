
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  // The API key must be obtained exclusively from process.env.API_KEY.
  if (!process.env.API_KEY) throw new Error("API Key not found");
  // Always initialize GoogleGenAI with a named apiKey parameter.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const curateNewsletterSection = async (city: string, rawData: string, type: 'STORY' | 'EVENT' | 'DEAL'): Promise<any> => {
  const ai = getAI();
  const prompt = `
    You are an AI editor for "LocalBeat", a hyper-local newsletter for ${city}.
    Task: Convert the following raw text into a high-quality ${type} entry.
    
    Requirements:
    - Story: EXACTLY 100 words. Journalistic and punchy.
    - Event: Catchy title, 2 sentences, date/time if found.
    - Deal: Focus on value proposition (e.g., 50% off).
    
    Return ONLY a JSON object with: { "headline": "...", "content": "...", "previewText": "..." }
    
    Raw Data: ${rawData}
  `;

  // Fix: Use responseSchema to ensure the model returns a valid JSON object matching the requested structure.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: 'The headline of the newsletter entry.' },
          content: { type: Type.STRING, description: 'The main body content of the entry.' },
          previewText: { type: Type.STRING, description: 'A short summary for previews.' }
        },
        required: ["headline", "content", "previewText"]
      }
    }
  });
  
  // Access the extracted string output using the .text property (not a method).
  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr);
};

export const generateWeatherTraffic = async (city: string, neighborhood: string): Promise<string> => {
  const ai = getAI();
  // Basic text task uses the gemini-3-flash-preview model.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a 2-sentence update for weather and traffic in ${neighborhood}, ${city} for this Friday. Be concise and helpful.`,
  });
  return response.text?.trim() || "Weather is clear. Traffic is moderate.";
};

export const discoverTrends = async (city: string): Promise<string[]> => {
  const ai = getAI();
  // Using googleSearch tool for real-time local news trending topics.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find 3 trending local news topics in ${city}, India today. Return as comma separated list.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  // Grounding metadata is available in response.candidates[0].groundingMetadata if source verification is needed.
  return (response.text || "").split(',').map(s => s.trim());
};
