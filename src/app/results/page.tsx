import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BundleCard } from "@/components/BundleCard";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  tags: string[];
  rating: number;
  delivery_days: number;
}

interface Bundle {
  id: string;
  name: string;
  tagline: string;
  problem_solved: string;
  why_this_works: string;
  product_ids: number[];
  total_price: number;
  tasks: string[];
}

export const revalidate = 0;

function getBundleOrder(name: string): number {
  if (name.includes("Budget")) return 0;
  if (name.includes("Complete")) return 2;
  return 1; // Recommended
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { ids?: string; q?: string };
}) {
  const rawIds = searchParams.ids || "";
  const query = searchParams.q ? decodeURIComponent(searchParams.q) : "your problem";
  const bundleIds = rawIds.split(",").filter(Boolean);

  if (bundleIds.length === 0) notFound();

  const { data: bundles, error } = await supabaseAdmin
    .from("bundles")
    .select("*")
    .in("id", bundleIds);

  if (error || !bundles || bundles.length === 0) notFound();

  const sortedBundles: Bundle[] = [...bundles].sort(
    (a, b) => getBundleOrder(a.name) - getBundleOrder(b.name)
  );

  // Fetch all unique products across all bundles
  const allProductIds = Array.from(
    new Set(sortedBundles.flatMap((b) => b.product_ids as number[]))
  );
  const { data: allProducts } = await supabaseAdmin
    .from("products")
    .select("*")
    .in("id", allProductIds);

  const productsMap = new Map<number, Product>(
    (allProducts || []).map((p) => [p.id, p])
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-navy text-white py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-block bg-orange/20 text-orange px-3 py-1 rounded-full text-xs font-semibold mb-3 uppercase tracking-wider">
            🤖 AI-Curated for You
          </div>
          <h1 className="font-sora text-3xl md:text-4xl font-bold mb-1">
            Solutions for:{" "}
            <span className="text-orange">&ldquo;{query}&rdquo;</span>
          </h1>
          <p className="text-slate-400 text-sm">
            {sortedBundles.length} bundles · {allProductIds.length} products — customise each bundle below
          </p>
        </div>
      </div>

      {/* Bundles */}
      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-6">
        {sortedBundles.map((bundle, idx) => {
          const bundleProducts = (bundle.product_ids as number[])
            .map((id) => productsMap.get(id))
            .filter(Boolean) as Product[];

          const isRecommended = getBundleOrder(bundle.name) === 1;

          return (
            <div key={bundle.id}>
              <BundleCard
                bundle={bundle}
                products={bundleProducts}
                isRecommended={isRecommended}
              />
              {/* "or" divider between bundles */}
              {idx < sortedBundles.length - 1 && (
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-slate-400 text-sm font-medium">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
