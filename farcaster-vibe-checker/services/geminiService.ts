
import { GoogleGenAI, Type } from "@google/genai";
import { FarcasterUser, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeUserVibe = async (user: FarcasterUser): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this Farcaster user profile and determine if they are worth following despite not following back.
      Username: ${user.username}
      Display Name: ${user.display_name}
      Bio: ${user.bio}
      Followers: ${user.follower_count}
      Following: ${user.following_count}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibe: { type: Type.STRING, description: "One of: cool, spam, inactive, high-value" },
            reason: { type: Type.STRING, description: "Turkish explanation for the vibe" },
            recommendation: { type: Type.STRING, description: "One of: keep, unfollow, watch" }
          },
          required: ["vibe", "reason", "recommendation"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as AnalysisResult;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return {
      vibe: 'cool',
      reason: 'Analiz sırasında bir hata oluştu.',
      recommendation: 'keep'
    };
  }
};

export const fetchPublicFarcasterData = async (username: string) => {
  // Since we don't have a direct Warpcast API key that we can embed,
  // we use Gemini search grounding to "find" data about this user's followers.
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Find public Farcaster (Warpcast) profile information for username "${username}". 
    Specifically, I need to know roughly who they follow and who follows them back to identify non-followers. 
    If you can't find specific lists, return general profile stats.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
