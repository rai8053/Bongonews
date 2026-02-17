
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  if (!process.env.API_KEY) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const curateNewsletterSection = async (city: string, rawData: string, type: 'STORY' | 'EVENT' | 'DEAL'): Promise<any> => {
  const ai = getAI();
  const prompt = `
    You are an AI editor for "LocalBeat", a hyper-local newsletter for ${city}.
    Task: Convert the following raw text into a high-quality ${type} entry.
    Raw Data: ${rawData}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          content: { type: Type.STRING },
          previewText: { type: Type.STRING }
        },
        required: ["headline", "content", "previewText"]
      }
    }
  });
  
  return JSON.parse(response.text || "{}");
};

export const generateWeatherTraffic = async (city: string, neighborhood: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a 2-sentence update for weather and traffic in ${neighborhood}, ${city} for this Friday.`,
  });
  return response.text || "Weather is clear. Traffic is moderate.";
};

export const discoverTrends = async (city: string): Promise<string[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find 3 trending local news topics in ${city}, India today. Return as comma separated list.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return (response.text || "").split(',').map(s => s.trim());
};
