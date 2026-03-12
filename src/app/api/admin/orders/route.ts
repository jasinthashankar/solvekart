import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

function isAdmin(session: any) {
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with user email
  const enriched = await Promise.all(
    (data || []).map(async (order) => {
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("email, name")
        .eq("id", order.user_id)
        .single();
      return { ...order, userEmail: user?.email, userName: user?.name };
    })
  );

  return NextResponse.json({ orders: enriched });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { orderId, status } = await req.json();

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("user_id, delivery_address")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const displayId = order?.delivery_address?.display_id || orderId;
  const statusLabels: Record<string, string> = {
    confirmed: "confirmed ✅",
    processing: "being processed 🏭",
    shipped: "shipped 🚚",
    delivered: "delivered 🎉",
  };

  // Create a notification for the user
  await supabaseAdmin.from("notifications").insert({
    user_id: order.user_id,
    title: `Order Update`,
    message: `Your order ${displayId} is now ${statusLabels[status] || status}.`,
    is_read: false,
  });

  return NextResponse.json({ success: true });
}
