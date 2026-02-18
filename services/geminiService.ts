
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from "../types";

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

/**
 * Transforms raw external API JSON into BongoNews compatible format.
 * Translates content to professional Bengali.
 */
export const transformExternalNews = async (rawData: any, city: string): Promise<Partial<NewsItem>[]> => {
  const ai = getAI();
  const prompt = `
    Input Data: ${JSON.stringify(rawData)}
    
    Task:
    1. Parse this news data (it might be in any JSON format).
    2. Extract the most relevant news articles (up to 5).
    3. Translate the headlines, content, and summaries into professional Bengali for a news app called "Bongo News".
    4. Categorize each item (e.g., 'পলিটিক্স', 'খেলাধুলা', 'বিনোদন', 'লাইফস্টাইল').
    5. The city context is ${city}.
    
    Return a JSON array of news objects.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            content: { type: Type.STRING },
            previewText: { type: Type.STRING },
            category: { type: Type.STRING },
            readTime: { type: Type.STRING }
          },
          required: ["headline", "content", "previewText", "category"]
        }
      }
    }
  });

  const parsed = JSON.parse(response.text || "[]");
  return parsed;
};

export const discoverTrends = async (city: string): Promise<{ headlines: string[], sources: any[] }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find 5 major breaking news headlines specifically for ${city} and West Bengal from the last 24 hours. Focus on politics, infrastructure, sports, or local events.`,
    config: { 
      tools: [{ googleSearch: {} }] 
    }
  });
  
  const text = response.text || "";
  const headlines = text.split('\n')
    .filter(line => line.trim().length > 10)
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .slice(0, 5);
  
  // Extract grounding chunks as required by the Gemini API guidelines for search tool usage
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  return { headlines, sources };
};
