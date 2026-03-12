import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deliveryAddress, paymentMethod, items, subtotal, discount, deliveryFee, totalAmount } = await req.json();

    if (!deliveryAddress || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required checkout data" }, { status: 400 });
    }

    // Generate Order ID
    const orderId = "SK" + Date.now();
    
    // Calculate estimated delivery (today + max delivery days of items, or 3 days default)
    const maxDays = items.reduce((max: number, item: any) => Math.max(max, (item.products || item.product)?.delivery_days || 3), 0);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + maxDays);
    const estimatedDeliveryStr = estimatedDate.toISOString().split("T")[0];

    // Format products JSONB payload
    const productsPayload = items.map((i: any) => {
      const p = i.products || i.product || {};
      return {
        product_id: p.id,
        name: p.name,
        price: p.price,
        quantity: i.quantity,
        image_url: p.image_url
      };
    });

    const displayId = "SK" + Date.now();
    
    // Embed displayId into the deliveryAddress JSON payload to avoid altering the DB schema
    const addressWithDisplayId = {
      ...deliveryAddress,
      display_id: displayId
    };

    // 1. Insert order
    const { data: orderParams, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        products: productsPayload,
        total_amount: totalAmount,
        discount: discount,
        payment_method: paymentMethod.type === 'upi' ? `UPI (${paymentMethod.upiId})` : paymentMethod.type,
        delivery_address: addressWithDisplayId,
        status: "confirmed",
        estimated_delivery: estimatedDeliveryStr
      })
      .select("id")
      .single();

    if (orderError) throw orderError;
    const realOrderId = orderParams.id;

    // 2. Clear cart
    await supabaseAdmin.from("cart_items").delete().eq("user_id", userId);

    // 3. Create notification
    await supabaseAdmin.from("notifications").insert({
      user_id: userId,
      title: "Order placed! 🎉",
      message: `Your order ${displayId} has been confirmed. It will be delivered by ${estimatedDeliveryStr}.`,
      is_read: false
    });

    return NextResponse.json({ success: true, orderId: realOrderId });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
