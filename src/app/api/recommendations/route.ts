import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("Recommend API: Session check:", session?.user?.email ? "Logged in" : "Guest");
  if (!session?.user?.email) return NextResponse.json({ suggestions: [] });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.error("Recommend API: Missing API Key");
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const { data: history, error: historyError } = await supabase
      .from("search_history")
      .select("query")
      .eq("user_id", (session.user as any).id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (historyError) {
      console.error("Recommend API: Supabase error:", historyError);
      return NextResponse.json({ suggestions: [] });
    }

    console.log("Recommend API: History count:", history?.length || 0);
    if (!history || history.length === 0) return NextResponse.json({ suggestions: [] });

    const queries = history.map((h) => h.query).join(", ");
    const prompt = `A user searched for these problems: "${queries}". Suggest 3 NEW related problem ideas. Return ONLY a JSON array of 3 short strings. Example: ["My wrists hurt", "Need better posture", "Eyes tired"]`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    console.log("Recommend API: Calling Gemini...");
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      }),
    });

    const data = await res.json();
    if (data.error) {
       console.error("Recommend API: Gemini error:", data.error);
       return NextResponse.json({ suggestions: [] });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Recommend API: Gemini raw text:", text);
    
    // Robust JSON extraction
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const suggestions = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      console.log("Recommend API: Extracted suggestions:", suggestions);
      return NextResponse.json({ suggestions: suggestions.slice(0, 3) });
    }

    console.warn("Recommend API: Could not find JSON in text");
    return NextResponse.json({ suggestions: [] });
  } catch (err) {
    console.error("Recommend API: Critical error:", err);
    return NextResponse.json({ suggestions: [] });
  }
}
