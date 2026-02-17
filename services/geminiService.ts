
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  if (!process.env.API_KEY) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const curateNewsletterSection = async (city: string, rawData: string, type: 'STORY' | 'EVENT' | 'DEAL'): Promise<any> => {
  const ai = getAI();
  const prompt = `
    You are a professional Bengali news editor for "Bongo News".
    Task: Convert the following news topic into a high-quality news entry in Bengali.
    Topic: ${rawData} for the city ${city}.
    Requirement: Write in a professional journalistic tone. Use Hind Siliguri font style (pure Bengali).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: "Catchy Bengali headline" },
          content: { type: Type.STRING, description: "Detailed news body in Bengali" },
          previewText: { type: Type.STRING, description: "1-sentence summary" }
        },
        required: ["headline", "content", "previewText"]
      }
    }
  });
  
  return JSON.parse(response.text || "{}");
};

export const discoverTrends = async (city: string): Promise<string[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find 5 major breaking news headlines specifically for ${city} and West Bengal from the last 24 hours. Focus on politics, infrastructure, sports, or local events.`,
    config: { 
      tools: [{ googleSearch: {} }] 
    }
  });
  
  // Clean up the response to get a list of topics
  const text = response.text || "";
  return text.split('\n')
    .filter(line => line.trim().length > 10)
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .slice(0, 5);
};
