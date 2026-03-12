import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

/* ─── Types ───────────────────────────────────────────────────── */
interface AiBundleRaw {
  name: string;
  tagline: string;
  why_this_works: string;
  product_ids: number[];
  total_price: number;
  tasks: string[];
}

interface ProductRow {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  tags: string[];
  rating: number;
  delivery_days: number;
}

/* ─── Groq call ───────────────────────────────────────────────── */
async function callGroq(prompt: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.solvekart_api}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are SolveKart AI. Match Indian user problems to physical products. " +
            "For emotional/personal problems suggest relevant physical products (journals, stress relief, self-help books, study tools). " +
            "Return ONLY valid JSON, no markdown, no explanation.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 900,
    }),
  });

  if (response.status === 413) {
    throw new Error("TOKEN_LIMIT");
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/* ─── Build compact prompt ────────────────────────────────────── */
function buildPrompt(query: string, budget: number, products: ProductRow[]): string {
  const label = query.length > 30 ? query.slice(0, 30) : query;
  const productLines = products
    .map((p) => `${p.id}|${p.name}|${p.brand}|${p.price}`)
    .join("\n");

  return `User problem: ${query}
Budget: Rs.${budget}

Products available:
${productLines}

Create 3 bundles named "${label} Budget Kit", "${label} Recommended Kit", "${label} Complete Kit".
Budget Kit: 3 cheapest products within Rs.${budget}.
Recommended Kit: 4 best-value products within Rs.${budget}.
Complete Kit: 5 complete products (up to Rs.${Math.round(budget * 1.3)}).
Products can repeat across bundles.

For each kit, generate 3-5 "tasks" (Action Tasks) — actionable steps the user should take to solve their problem using these products.

Return ONLY this JSON (no markdown):
{"bundles":[{"name":"","tagline":"","why_this_works":"","product_ids":[],"total_price":0,"tasks":[]}]}`;
}

/* ─── Parse JSON ──────────────────────────────────────────────── */
function parseJson(raw: string): { bundles: AiBundleRaw[] } | null {
  try {
    const cleaned = raw.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed?.bundles) && parsed.bundles.length > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

/* ─── Smart product filter from Supabase ─────────────────────── */
async function fetchRelevantProducts(
  query: string,
  limit: number
): Promise<ProductRow[]> {
  // Step 1: extract meaningful keywords (skip short words)
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9\-]/g, ""))
    .filter((w) => w.length >= 3);

  let products: ProductRow[] = [];

  // Step 2: tag overlap search if we have keywords
  if (keywords.length > 0) {
    const { data: tagMatches } = await supabaseAdmin
      .from("products")
      .select("id, name, brand, price, category, tags, rating, delivery_days")
      .overlaps("tags", keywords)
      .limit(limit);
    products = (tagMatches as ProductRow[]) || [];
  }

  // Step 3: if fewer than 8 matches, also pull top products by name/brand text search
  if (products.length < 8) {
    const keyword = keywords[0] || query.split(" ")[0];
    const { data: nameMatches } = await supabaseAdmin
      .from("products")
      .select("id, name, brand, price, category, tags, rating, delivery_days")
      .ilike("name", `%${keyword}%`)
      .limit(10);

    const existing = new Set(products.map((p) => p.id));
    const extras = ((nameMatches as ProductRow[]) || []).filter(
      (p) => !existing.has(p.id)
    );
    products = [...products, ...extras];
  }

  // Step 4: still under 8 — pull random affordable products as fallback
  if (products.length < 8) {
    const { data: fallback } = await supabaseAdmin
      .from("products")
      .select("id, name, brand, price, category, tags, rating, delivery_days")
      .order("price", { ascending: true })
      .limit(15);

    const existing = new Set(products.map((p) => p.id));
    const extras = ((fallback as ProductRow[]) || []).filter(
      (p) => !existing.has(p.id)
    );
    products = [...products, ...extras];
  }

  // Deduplicate and cap
  const seen = new Set<number>();
  return products.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  }).slice(0, limit);
}

/* ─── POST handler ────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const { query, budget } = await req.json();

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { error: "Please describe your problem in more detail." },
        { status: 400 }
      );
    }

    const budgetValue = Number(budget) || 3000;

    // ── Smart filter: max 20 products ──
    let products = await fetchRelevantProducts(query, 20);

    // ── Call Groq with retry on token limit ──
    let aiResult: { bundles: AiBundleRaw[] } | null = null;
    let attempt = 0;
    const maxProducts = [20, 10, 8];

    while (attempt < 3 && !aiResult) {
      const limit = maxProducts[attempt];
      const subset = products.slice(0, limit);
      const prompt = buildPrompt(query, budgetValue, subset);

      try {
        const rawText = await callGroq(prompt);
        aiResult = parseJson(rawText);
        if (!aiResult) {
          console.warn(`Attempt ${attempt + 1}: JSON parse failed`);
        }
      } catch (err) {
        const error = err as Error;
        if (error.message === "TOKEN_LIMIT") {
          console.warn(`Attempt ${attempt + 1}: token limit hit, reducing to ${maxProducts[attempt + 1] ?? 8} products`);
        } else {
          console.error(`Groq attempt ${attempt + 1} error:`, error.message);
          if (attempt >= 2) throw error;
        }
      }
      attempt++;
    }

    // ── Fallback bundles if all attempts failed ──
    if (!aiResult) {
      console.warn("All AI attempts failed — using fallback bundles");
      const sorted = [...products].sort((a, b) => a.price - b.price);
      aiResult = {
        bundles: [
            {
              name: `Budget Kit`,
              tagline: "Most affordable solution",
              why_this_works: "Most affordable products relevant to your problem.",
              product_ids: sorted.slice(0, 3).map((p) => p.id),
              total_price: sorted.slice(0, 3).reduce((s, p) => s + p.price, 0),
              tasks: ["Apply the treatment as directed", "Monitor progress daily", "Consult a specialist if needed"],
            },
            {
              name: `Recommended Kit`,
              tagline: "Best value combination",
              why_this_works: "A balanced mix of price and quality for your needs.",
              product_ids: sorted.slice(0, 4).map((p) => p.id),
              total_price: sorted.slice(0, 4).reduce((s, p) => s + p.price, 0),
              tasks: ["Follow the recommended schedule", "Combine with healthy habits", "Keep track of results"],
            },
            {
              name: `Complete Kit`,
              tagline: "The most complete solution",
              why_this_works: "Everything you need for a comprehensive solution.",
              product_ids: sorted.slice(0, 5).map((p) => p.id),
              total_price: sorted.slice(0, 5).reduce((s, p) => s + p.price, 0),
              tasks: ["Complete the full course of action", "Integrate all tools for best results", "Share your feedback"],
            },
          ],
        };
      }

    // ── Fetch full product details for validation ──
    const { data: allProducts } = await supabaseAdmin
      .from("products")
      .select("id, name, brand, price, category, tags, rating, delivery_days")
      .in(
        "id",
        aiResult.bundles.flatMap((b) => b.product_ids)
      );

    const validProductIds = new Set((allProducts || []).map((p: ProductRow) => p.id));
    const savedBundleIds: string[] = [];

    for (const b of aiResult.bundles) {
      const uniqueIds = Array.from(
        new Set((b.product_ids as number[]).filter((id) => validProductIds.has(id)))
      );
      if (uniqueIds.length === 0) continue;

      const selectedProducts = (allProducts || []).filter((p: ProductRow) =>
        uniqueIds.includes(p.id)
      );
      const totalPrice = selectedProducts.reduce(
        (sum: number, p: ProductRow) => sum + p.price,
        0
      );

      let { data: saved, error: saveErr } = await supabaseAdmin
        .from("bundles")
        .insert({
          name: b.name,
          tagline: b.tagline,
          problem_solved: query,
          product_ids: uniqueIds,
          total_price: totalPrice,
          why_this_works: b.why_this_works,
          tasks: b.tasks || [],
        })
        .select("id")
        .single();

      if (saveErr) {
        try {
          const fs = require("fs");
          fs.writeFileSync("./supabase_error.json", JSON.stringify(saveErr, null, 2));
          console.error("Supabase insert error logged to ./supabase_error.json");
        } catch (logErr) {
          console.error("Failed to log to file:", logErr);
        }
      }

      // Fallback: if 'tasks' column is missing in DB, retry without it
      const isMissingColumn = saveErr && (
        saveErr.message?.includes('column "tasks" of relation "bundles" does not exist') ||
        saveErr.message?.includes("'tasks' column")
      );

      if (isMissingColumn) {
        console.warn("Retrying bundle insert without tasks column (fallback triggered)...");
        const { data: retrySaved, error: retryErr } = await supabaseAdmin
          .from("bundles")
          .insert({
            name: b.name,
            tagline: b.tagline,
            problem_solved: query,
            product_ids: uniqueIds,
            total_price: totalPrice,
            why_this_works: b.why_this_works,
          })
          .select("id")
          .single();
        
        if (retryErr) {
          console.error("Supabase retry insert error:", JSON.stringify(retryErr, null, 2));
        }
        saved = retrySaved;
        saveErr = retryErr;
      }

      if (!saveErr && saved) savedBundleIds.push(saved.id);
    }

    if (savedBundleIds.length === 0) {
      throw new Error("No valid bundles could be created. Please try again.");
    }

    return NextResponse.json({ bundleIds: savedBundleIds, query });
  } catch (err) {
    const error = err as Error;
    console.error("AI solve error:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
