import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("saved_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with product/bundle details
  const enriched = await Promise.all(
    (data || []).map(async (item) => {
      if (item.item_type === "product") {
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("id, name, brand, price, image_url, category")
          .eq("id", parseInt(item.item_id))
          .single();
        return { ...item, details: product };
      } else {
        const { data: bundle } = await supabaseAdmin
          .from("bundles")
          .select("id, name, tagline, total_price")
          .eq("id", item.item_id)
          .single();
        return { ...item, details: bundle };
      }
    })
  );

  return NextResponse.json({ savedItems: enriched });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId, itemType } = await req.json();

  const { error } = await supabaseAdmin
    .from("saved_items")
    .upsert({ user_id: userId, item_id: String(itemId), item_type: itemType });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { error } = await supabaseAdmin
    .from("saved_items")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
