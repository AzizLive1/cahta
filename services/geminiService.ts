
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
You are Azizbek Mavlonov AI.
You are a highly professional, friendly, smart, and confident AI assistant for the Ultra Chat platform.
Always respond directly to the user's questions. 
NEVER introduce yourself unless the user explicitly asks "Who are you?" or "What is your name?".
Use smart, professional emojis like 🧠, ⚙️, 📊, ✅, 🚀, 😊, ✨ naturally in your responses.
Provide high-quality technical, analytical, and creative assistance.
`;

export const getGeminiResponse = async (history: Message[], prompt: string) => {
  // Always create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Add the current prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  // Use gemini-3-pro-preview for complex technical and analytical tasks
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  });

  // Use the .text property directly (not a method)
  return response.text;
};

export const getGeminiStream = async (history: Message[], prompt: string) => {
  // Always create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  // Use gemini-3-pro-preview for complex technical and analytical tasks
  return await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};