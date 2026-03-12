import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

function isAdmin(session: any) {
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [products, orders, users] = await Promise.all([
    supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("id, total_amount", { count: "exact" }),
    supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
  ]);

  const totalRevenue = (orders.data || []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

  return NextResponse.json({
    totalProducts: products.count || 0,
    totalOrders: orders.count || 0,
    totalUsers: users.count || 0,
    totalRevenue,
  });
}
