import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Please sign in to add items to cart." }, { status: 401 });
    }

    const { items } = await req.json(); // Array of { productId: number, quantity: number }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No products provided." }, { status: 400 });
    }

    let totalCount = 0;

    for (const item of items) {
      if (item.quantity <= 0) continue;
      
      // Check if item already exists in cart for this user
      const { data: existingItem } = await supabaseAdmin
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", item.productId)
        .single();

      if (existingItem) {
        // Update quantity
        const newQuantity = Math.min(existingItem.quantity + item.quantity, 5); // Limit to 5
        await supabaseAdmin
          .from("cart_items")
          .update({ quantity: newQuantity })
          .eq("id", existingItem.id);
        totalCount += item.quantity;
      } else {
        // Insert new item
        const { error: insertErr } = await supabaseAdmin
          .from("cart_items")
          .insert({
            user_id: userId,
            product_id: item.productId,
            quantity: Math.min(item.quantity, 5)
          });
        
        if (!insertErr) {
          totalCount += item.quantity;
        }
      }
    }

    return NextResponse.json({ success: true, count: totalCount });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

