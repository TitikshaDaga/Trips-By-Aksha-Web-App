import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Plan Trip API Endpoint
app.post("/api/plan", async (req, res) => {
  try {
    const {
      destination,
      durationDays,
      budget,
      travelers,
      interests,
      timing,
      extraRequests
    } = req.body;

    if (!destination) {
      return res.status(400).json({ error: "Destination is required." });
    }

    const ai = getGenAI();

    const selectedInterests = Array.isArray(interests) && interests.length > 0 
      ? interests.join(", ") 
      : "general exploring, sightseeing, local food";

    const prompt = `Create a custom, highly curated travel plan named "Trips By Aksha" for a visit to "${destination}".
Trip Details:
- Duration: ${durationDays || 3} days
- Budget tier: ${budget || "Mid-range"}
- Traveler configuration: ${travelers || "Couple"}
- Main interests: ${selectedInterests}
- Travel timing: ${timing || "Anytime"}
${extraRequests ? `- Custom requests/preferences: ${extraRequests}` : ""}

Ensure the itinerary feels highly localized, bespoke, boutique, and filled with insider secrets. Avoid generic tourist traps unless they are absolute must-visits, and provide alternative boutique ways to experience them. Write detailed descriptions for each item with real visual, historical, or practical charm.`;

    const systemInstruction = `You are Aksha, the chief boutique travel designer for "Trips By Aksha".
You design itineraries that blend luxury detail, local hidden secrets, and perfectly paced logistics.
Your tone is stylish, experienced, warm, and highly professional.
Always return response strictly in the structured JSON format provided. Do not include any text outside the JSON block.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["tripName", "destination", "durationDays", "overview", "highlights", "estimatedBudget", "packingEssentials", "localCustoms", "itinerary"],
          properties: {
            tripName: {
              type: Type.STRING,
              description: "A gorgeous, poetic, branded trip name showcasing the destination (e.g., Amalfi Shoreline & Secret Grottoes)."
            },
            destination: { type: Type.STRING },
            durationDays: { type: Type.INTEGER },
            overview: {
              type: Type.STRING,
              description: "A captivating, beautiful intro about what makes this customized trip wonderful for the traveler style."
            },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 ultra-alluring bullet point highlights of this personalized itinerary."
            },
            estimatedBudget: {
              type: Type.OBJECT,
              required: ["lodging", "food", "activities", "transportation", "currency"],
              properties: {
                lodging: { type: Type.STRING, description: "Lodging estimation description according to selected budget tier" },
                food: { type: Type.STRING, description: "Food & drinks estimation description" },
                activities: { type: Type.STRING, description: "Sightseeing/entry fees estimation" },
                transportation: { type: Type.STRING, description: "Local transport estimation" },
                currency: { type: Type.STRING, description: "Currency symbol or code (e.g. $, €, £)" }
              }
            },
            packingEssentials: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4-6 boutique travel essentials specific to the climate, timing, and activities planned."
            },
            localCustoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Local etiquette, words, or cultural charms that make them blend in like a local."
            },
            itinerary: {
              type: Type.ARRAY,
              description: "Sequential list of daily itineraries.",
              items: {
                type: Type.OBJECT,
                required: ["dayNumber", "theme", "activities", "meals"],
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  theme: { type: Type.STRING, description: "An elegant theme or mood for this day (e.g. Coastal Breezes & Lemon Groves)." },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["time", "title", "location", "description", "estimatedDuration", "costEstimate"],
                      properties: {
                        time: { type: Type.STRING, description: "Morning, Afternoon, or Evening" },
                        title: { type: Type.STRING },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING, description: "Rich, vivid detail and secret tips for visiting." },
                        estimatedDuration: { type: Type.STRING },
                        costEstimate: { type: Type.STRING }
                      }
                    }
                  },
                  meals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["type", "recommendation", "cuisineDescription"],
                      properties: {
                        type: { type: Type.STRING, description: "Breakfast, Lunch, or Dinner" },
                        recommendation: { type: Type.STRING, description: "Name of recommended local bistro, café, or street food spot" },
                        cuisineDescription: { type: Type.STRING, description: "What exactly to order, local delicacies, or the culinary vibe" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const parsedJson = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedJson);
  } catch (error: any) {
    console.error("Error generating travel plan:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred while generating your holiday plan. please make sure your GEMINI_API_KEY is configured correctly."
    });
  }
});

// 2. Chat API Endpoint for Digital Concierge
app.post("/api/chat", async (req, res) => {
  try {
    const { chatHistory, userMessage, currentTripContext } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGenAI();

    // Reconstruct conversation with background context
    const contextPrompt = `You are Aksha, the boutique travel concierge for "Trips By Aksha".
You are conversing with a traveler who is exploring their personalized vacation.
Current trip configuration:
${currentTripContext ? JSON.stringify(currentTripContext) : "No holiday selected yet. You can invite them to share their dream destination!"}

Instructions:
- Keep your tone elegant, friendly, knowledgeable, and filled with style.
- Keep answers relatively concise, useful, and actionable.
- Support markdown formatting.
- If they ask for changes to their trip, offer tips or suggestions, suggesting they can update preferences or ask you questions anytime.`;

    // Process history
    const formattedHistory = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
         formattedHistory.push({
           role: msg.role === "assistant" ? "model" as const : "user" as const,
           parts: [{ text: msg.content }]
         });
      }
    }

    const chatSession = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: contextPrompt,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chatSession.sendMessage({ message: userMessage });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in chat concierge:", error);
    res.status(500).json({
      error: error.message || "Failed to process concierge request."
    });
  }
});

// Vite or Static files handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Trips By Aksha custom full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
