import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  // In a real production app, use a backend proxy to hide the key.
  // For this frontend-only demo, we rely on process.env.API_KEY.
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateHeadline = async (text: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a senior editor for a Bengali news portal. 
      Read the following text and generate a catchy, professional, and short newspaper-style headline in Bengali.
      Only return the headline text, nothing else.
      
      Text: ${text.substring(0, 2000)}...`,
    });
    return response.text?.trim() || "Headline Generation Failed";
  } catch (error) {
    console.error("Gemini Headline Error:", error);
    return "স্বয়ংক্রিয় শিরোনাম জেনারেশন ব্যর্থ হয়েছে";
  }
};

export const cleanNewsText = async (text: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a Bengali proofreader. 
      The following text is a raw transcription from a video. 
      Clean it up, fix punctuation, improve grammar, and make it read like a high-quality newspaper article in Bengali.
      Do not change the core meaning. Keep it professional.
      
      Raw Text: ${text}`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini Cleaning Error:", error);
    return text;
  }
};

export const draftNewsFromTopic = async (topic: string): Promise<{ content: string; sources: string[] }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Search for the latest news regarding: "${topic}". 
      Prioritize recent events in West Bengal or India.
      Based on the search results, write a comprehensive news report in Bengali.
      The tone should be professional and journalistic.
      Do not use Markdown formatting.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // @ts-ignore 
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: string) => uri) as string[];
    
    const uniqueSources = [...new Set(sources)];

    return {
      content: response.text?.trim() || "Could not generate content.",
      sources: uniqueSources
    };
  } catch (error) {
    console.error("Research Error:", error);
    throw error;
  }
};

export const generateImagePrompt = async (text: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Read this Bengali news snippet and generate a short, visual English description (prompt) to generate a relevant image. 
      Focus on the visual scene (e.g., "Kolkata street crowd raining", "Mamata Banerjee speech podium", "Traffic jam Howrah bridge").
      Keep it under 10 words. Return ONLY the English prompt.
      
      News: ${text.substring(0, 500)}`,
    });
    return response.text?.trim() || "News West Bengal India generic";
  } catch (error) {
    console.error("Image Prompt Error:", error);
    return "News West Bengal India generic";
  }
};

export const getTrendingTopics = async (): Promise<string[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find 3 currently trending specific news topics in West Bengal or Kolkata. 
      Return them as a simple comma-separated list of English phrases. 
      Example: Metro disruption, Hilsa price rise, Durga Puja prep`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const text = response.text || "";
    return text.split(',').map(t => t.trim()).filter(t => t.length > 0);
  } catch (error) {
    console.error("Trending Topics Error:", error);
    return ["Kolkata Weather", "West Bengal Politics", "Indian Cricket Team"];
  }
};