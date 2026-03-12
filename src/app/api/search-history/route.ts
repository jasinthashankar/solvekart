import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET: fetch recent searches for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ searches: [] });

  const { data } = await supabaseAdmin
    .from("search_history")
    .select("id, query, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({ searches: data || [] });
}

// POST: save a search
export async function POST(req: NextRequest) {
  const { userId, query } = await req.json();
  if (!userId || !query) return NextResponse.json({ ok: false });

  // Upsert — avoid duplicate entries for same query
  await supabaseAdmin.from("search_history").insert({ user_id: userId, query });
  return NextResponse.json({ ok: true });
}

// DELETE: clear all searches for a user
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ ok: false });

  await supabaseAdmin.from("search_history").delete().eq("user_id", userId);
  return NextResponse.json({ ok: true });
}
