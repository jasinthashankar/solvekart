import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItemId, quantity } = await req.json();

    if (!cartItemId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    if (quantity <= 0) {
      // Just delete it if quantity is 0 or less
      await supabaseAdmin.from("cart_items").delete().eq("id", cartItemId).eq("user_id", userId);
      return NextResponse.json({ success: true, action: "deleted" });
    }

    // Update quantity (limit at 10)
    const newQty = Math.min(quantity, 10);
    const { error } = await supabaseAdmin
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", cartItemId)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true, quantity: newQty });
  } catch (err) {
    const e = err as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
