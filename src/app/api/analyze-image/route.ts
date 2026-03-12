import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = image.type || "image/jpeg";

    // Call Groq vision (llama-3.2-11b-vision-preview supports images)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.solvekart_api}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
              {
                type: "text",
                text: "Look at this image and describe the problem the person is facing in 1-2 short sentences. Be specific and focus on what product solution might help. Example: 'My back hurts from long sitting hours' or 'I need a gym starter kit'. Just the problem description, no extra text.",
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Vision API error:", err);
      // Fallback: return generic description
      return NextResponse.json({
        description: "I need help finding the right products for my situation",
      });
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim() || 
      "I need help finding the right products";

    return NextResponse.json({ description });
  } catch (err) {
    console.error("Image analysis error:", err);
    return NextResponse.json(
      { description: "I need help finding the right products" }
    );
  }
}
