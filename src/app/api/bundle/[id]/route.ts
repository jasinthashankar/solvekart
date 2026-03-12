import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: bundle, error: bundleError } = await supabaseAdmin
      .from("bundles")
      .select("*")
      .eq("id", params.id)
      .single();

    if (bundleError || !bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, brand, price, category, tags, rating, delivery_days, description")
      .in("id", bundle.product_ids);

    if (productsError) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    // Sort products by price ascending
    const sortedProducts = (products || []).sort(
      (a: { price: number }, b: { price: number }) => a.price - b.price
    );

    return NextResponse.json({ bundle, products: sortedProducts });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
