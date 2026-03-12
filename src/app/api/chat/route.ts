import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: `You are SolveKart's helpful AI shopping assistant. SolveKart is an AI-powered e-commerce platform that helps users find curated product bundles for their specific problems (e.g. back pain, study setup, gaming rig, etc).

Your job:
- Help users find the right product bundle for their problem
- Be friendly, concise and helpful — keep replies short (2-4 sentences max)
- Always ask about budget if the user hasn't mentioned one
- Suggest the user describe their problem in the main search bar on the home page to get AI-generated bundles
- Never make up product names or prices — instead guide them to search SolveKart

If a user asks about a specific product or problem, gently redirect them to use the search bar to get personalized AI bundles.`,
});

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({ reply: "I'm still waiting for my Gemini API key! Please add it to .env.local." });
    }

    // Switch to stable v1 and try fallback models
    // Note: The user's key specifically returns gemini-2.5-flash in listModels
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash", "gemini-pro"];
    let lastError = "";

    const systemPrompt = "You are SolveKart's helpful AI shopping assistant. Keep replies extremely short (1-2 sentences). Help users find product bundles.";

    for (const modelName of modelsToTry) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
        
        let contents = history.slice(-6).map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));
        
        // Add system prompt to the first message if history is empty, or as context
        const userMessage = history.length === 0 ? `${systemPrompt}\n\nUser: ${message}` : message;
        
        contents.push({ role: "user", parts: [{ text: userMessage }] });

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return NextResponse.json({ reply });
      } catch (err: any) {
        lastError = err.message;
        console.error(`Gemini Error (${modelName}):`, err.message);
        continue;
      }
    }

    throw new Error(lastError || "All models failed");

  } catch (err: any) {
    console.error("CHAT_API_CRITICAL_FAILURE:", err.message);
    return NextResponse.json(
      { reply: `Connected, but AI service returned: ${err.message}. Please verify your key's permissions.` },
      { status: 200 }
    );
  }
}
