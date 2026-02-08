
import { GoogleGenAI, Type } from "@google/genai";
import { ResolvedStateModel } from "../types";

// Initialize AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const scheduleEventTool = {
  name: 'schedule_event',
  parameters: {
    type: Type.OBJECT,
    description: 'Proposes a single event (focus session, break, or review) to be added to the calendar.',
    properties: {
      title: { type: Type.STRING },
      startTime: { type: Type.STRING, description: 'ISO format string' },
      duration: { type: Type.NUMBER, description: 'Duration in minutes' },
      description: { type: Type.STRING },
      type: { type: Type.STRING, enum: ['focus', 'break', 'review'] }
    },
    required: ['title', 'startTime', 'duration', 'description', 'type'],
  },
};

export const designPathTool = {
  name: 'design_path',
  parameters: {
    type: Type.OBJECT,
    description: 'Proposes a sequence of events (a "Path") to tackle a larger goal or structure a work block.',
    properties: {
      pathName: { type: Type.STRING, description: 'A title for this journey' },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            startTime: { type: Type.STRING },
            duration: { type: Type.NUMBER },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['focus', 'break', 'review'] }
          },
          required: ['title', 'startTime', 'duration', 'description', 'type']
        }
      }
    },
    required: ['pathName', 'steps'],
  },
};

export async function getSenseiResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  profile: ResolvedStateModel
) {
  const toneMap = {
    COACH: "motivational and habit-centric",
    IGNITION: "energetic and activation-focused",
    PACER: "steady and rhythm-aware",
    STABILIZER: "low-pressure and grounding",
    ADAPTIVE: "observant"
  };

  const systemInstruction = `
    You are "The Sensei", an AI learning architect.
    Mode: ${profile.mode} (${toneMap[profile.mode]})
    
    Student Model:
    - Friction: ${profile.friction.primary} (${profile.friction.strategy})
    - Values: ${profile.values.productivity_framing}
    - Rhythm: Best at ${profile.rhythm?.focus_time || 'anytime'}, ${profile.rhythm?.work_burst || 'flexible'}m bursts.
    
    Responsibilities:
    1. Guide the student using concise, validated dialogue (max 2 sentences).
    2. Propose single events with 'schedule_event' for quick wins.
    3. Use 'design_path' to map out a thorough learning journey or a balanced work block.
    4. For 'design_path', always balance focus blocks with breaks and a review at the end.
    5. Always end with action chips: [Option 1] [Option 2].
    
    Design paths that directly counter the user's reported friction. For example, if they have 'decision fatigue', your path should take the decisions away by being specific.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    })),
    config: {
      systemInstruction,
      tools: [{ functionDeclarations: [scheduleEventTool, designPathTool] }],
    },
  });

  return response;
}
