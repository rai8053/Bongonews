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
      Read the following transcribed text and generate a catchy, professional, and short newspaper-style headline in Bengali.
      Only return the headline text, nothing else.
      
      Text: ${text.substring(0, 2000)}...`, // Truncate to avoid token limits if huge
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
    return text; // Fallback to original
  }
};

export const draftNewsFromTopic = async (topic: string): Promise<{ content: string; sources: string[] }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Search for the latest news and details regarding: "${topic}". 
      Prioritize recent events in West Bengal or India if applicable.
      Based on the search results, write a comprehensive news report in Bengali.
      The tone should be professional and journalistic.
      Do not use Markdown formatting (bold/italic), just plain text paragraphs.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract grounding metadata (Search Sources)
    // @ts-ignore - groundingMetadata types might vary based on SDK version, accessing safely
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: string) => uri) as string[];
    
    // Deduplicate sources
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
