"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Package,
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Minus,
  Plus,
  Check,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  tags: string[];
  rating: number;
  delivery_days: number;
  description: string;
}

interface Bundle {
  id: string;
  name: string;
  tagline: string;
  problem_solved: string;
  product_ids: number[];
  total_price: number;
  why_this_works: string;
  created_at: string;
}

interface ProductState {
  checked: boolean;
  qty: number;
  owned: boolean; // "I have this"
}

/* ─── Helpers ─────────────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  "pain-relief": "bg-red-50 text-red-600 border-red-200",
  study: "bg-blue-50 text-blue-600 border-blue-200",
  gym: "bg-green-50 text-green-600 border-green-200",
  home: "bg-yellow-50 text-yellow-700 border-yellow-200",
  gifts: "bg-purple-50 text-purple-600 border-purple-200",
  college: "bg-indigo-50 text-indigo-600 border-indigo-200",
  creator: "bg-pink-50 text-pink-600 border-pink-200",
  "new-home": "bg-orange-50 text-orange-500 border-orange-200",
};

const EMOJI_MAP: Record<string, string> = {
  gym: "💪",
  study: "📚",
  "pain-relief": "💊",
  home: "🏠",
  gifts: "🎁",
  college: "🎓",
  creator: "🎨",
  "new-home": "🏡",
};

function fmtINR(n: number) {
  return n.toLocaleString("en-IN");
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function BundlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [states, setStates] = useState<Record<number, ProductState>>({});
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  /* ── Fetch bundle + products ── */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/bundle/${id}`)
      .then((r) => r.json())
      .then(({ bundle, products }) => {
        setBundle(bundle);
        const prods: Product[] = products || [];
        setProducts(prods);
        const init: Record<number, ProductState> = {};
        prods.forEach((p) => {
          init[p.id] = { checked: true, qty: 1, owned: false };
        });
        setStates(init);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ── State helpers ── */
  const setQty = useCallback((id: number, delta: number) => {
    setStates((prev) => {
      const cur = prev[id];
      const next = Math.max(0, Math.min(5, cur.qty + delta));
      return {
        ...prev,
        [id]: {
          ...cur,
          qty: next,
          // qty=0 → uncheck; qty goes from 0→1 via + → re-check
          checked: next > 0 ? cur.checked : false,
        },
      };
    });
  }, []);

  const toggleChecked = useCallback((id: number) => {
    setStates((prev) => {
      const cur = prev[id];
      if (cur.owned) return prev; // can't toggle if "I have this"
      const next = !cur.checked;
      return {
        ...prev,
        [id]: {
          ...cur,
          checked: next,
          // If unchecking, keep qty; if re-checking and qty=0 → set to 1
          qty: next && cur.qty === 0 ? 1 : cur.qty,
        },
      };
    });
  }, []);

  const markOwned = useCallback((id: number) => {
    setStates((prev) => ({
      ...prev,
      [id]: { checked: false, qty: 0, owned: true },
    }));
  }, []);

  /* ── Derived totals ── */
  const selectedProducts = products.filter(
    (p) => states[p.id]?.checked && !states[p.id]?.owned && (states[p.id]?.qty ?? 0) > 0
  );

  const totalQty = selectedProducts.reduce(
    (acc, p) => acc + (states[p.id]?.qty ?? 0),
    0
  );

  const totalPrice = selectedProducts.reduce(
    (acc, p) => acc + p.price * (states[p.id]?.qty ?? 0),
    0
  );

  const avgRating = products.length
    ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)
    : "0";

  const maxDelivery = products.reduce((m, p) => Math.max(m, p.delivery_days), 0);

  /* ── Add to cart ── */
  const handleAddToCart = async () => {
    if (selectedProducts.length === 0) return;
    setAddingToCart(true);
    const items = selectedProducts.map((p) => ({
      productId: p.id,
      quantity: states[p.id].qty,
    }));
    try {
      await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 3000);
      router.push("/cart");
    } finally {
      setAddingToCart(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium">Loading your bundle…</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Bundle not found.</p>
          <Link href="/" className="text-orange-500 underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Banner ── */}
      <div className="bg-[#0f1c33] text-white py-14 px-4">
        <div className="container mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="inline-block bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
            AI-Curated Bundle
          </div>

          <h1 className="font-bold text-3xl md:text-5xl mb-3">{bundle.name}</h1>
          <p className="text-slate-300 text-xl mb-2">{bundle.tagline}</p>
          <p className="text-slate-400 text-sm max-w-2xl">
            Solves: {bundle.problem_solved}
          </p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
              {avgRating} avg rating
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-400" />
              {products.length} products
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Delivers in {maxDelivery} days
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Product List ── */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-bold text-xl text-[#0f1c33] mb-4">
              Products in this Bundle
            </h2>

            {products.map((product) => {
              const st = states[product.id] ?? {
                checked: true,
                qty: 1,
                owned: false,
              };
              const lineTotal = product.price * st.qty;
              const isGhosted = st.owned || (st.qty === 0 && !st.owned);
              const catColor =
                CATEGORY_COLORS[product.category] ??
                "bg-slate-50 text-slate-600 border-slate-200";
              const emoji =
                EMOJI_MAP[product.category] ?? "🛒";

              return (
                <div
                  key={product.id}
                  style={{
                    opacity: isGhosted ? 0.45 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* ── Top Row: checkbox | image | name | price ── */}
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleChecked(product.id)}
                      disabled={st.owned}
                      className="mt-1 flex-shrink-0"
                      aria-label="toggle select"
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          st.checked && !st.owned
                            ? "bg-orange-500 border-orange-500"
                            : "border-slate-300 bg-white"
                        } ${st.owned ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {st.checked && !st.owned && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                      </div>
                    </button>

                    {/* Image */}
                    <div className="w-[50px] h-[50px] rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {emoji}
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#0f1c33] text-sm leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {product.brand} ·{" "}
                        <span
                          className={`inline-block px-1.5 py-0 rounded-full border text-[10px] font-medium ${catColor}`}
                        >
                          {product.category}
                        </span>
                      </p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= Math.round(product.rating)
                                ? "fill-orange-400 text-orange-400"
                                : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-slate-400 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Line total price */}
                    <div className="flex-shrink-0 text-right">
                      {st.owned ? (
                        <span className="text-green-600 text-xs font-semibold">
                          ✓ Already owned
                        </span>
                      ) : (
                        <div className="font-bold text-[#0f1c33] text-base">
                          ₹{fmtINR(st.qty > 0 ? lineTotal : product.price)}
                        </div>
                      )}
                      {!st.owned && st.qty > 1 && (
                        <div className="text-[10px] text-slate-400">
                          ₹{fmtINR(product.price)} × {st.qty}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Bottom Row: qty controls + I have this ── */}
                  {!st.owned && (
                    <div className="mt-3 flex items-center gap-3 pl-[calc(20px+12px+50px+12px)]">
                      {/* Qty selector */}
                      <div className="flex items-center gap-1">
                        {/* − */}
                        <button
                          onClick={() => setQty(product.id, -1)}
                          disabled={st.qty === 0}
                          className={`w-7 h-7 rounded-md border flex items-center justify-center text-sm font-bold transition-colors ${
                            st.qty === 0
                              ? "border-slate-200 text-slate-300 cursor-not-allowed bg-white"
                              : "border-slate-300 bg-white hover:bg-orange-50 hover:border-orange-400 text-slate-700 cursor-pointer"
                          }`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        {/* Count */}
                        <div className="w-8 h-7 flex items-center justify-center font-bold text-base text-[#0f1c33] border border-slate-200 rounded-md bg-white select-none">
                          {st.qty}
                        </div>

                        {/* + */}
                        <button
                          onClick={() => setQty(product.id, 1)}
                          disabled={st.qty >= 5}
                          className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${
                            st.qty >= 5
                              ? "border-slate-200 text-slate-300 cursor-not-allowed bg-white"
                              : "border-slate-300 bg-white hover:bg-orange-50 hover:border-orange-400 text-slate-700 cursor-pointer"
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="w-px h-5 bg-slate-200" />

                      {/* I have this */}
                      <button
                        onClick={() => markOwned(product.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors font-medium"
                      >
                        I have this
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Bundle Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-[#0f1c33] text-lg mb-4">
                  Bundle Summary
                </h3>

                <div className="space-y-2 mb-4">
                  {products.map((p) => {
                    const st = states[p.id];
                    const active = st?.checked && !st?.owned && (st?.qty ?? 0) > 0;
                    return (
                      <div
                        key={p.id}
                        className={`flex justify-between text-sm transition-opacity ${
                          active ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        <span className="text-slate-600 truncate mr-2">
                          {p.name}
                          {st?.qty > 1 && (
                            <span className="text-slate-400 ml-1">
                              ×{st.qty}
                            </span>
                          )}
                        </span>
                        <span className="text-[#0f1c33] font-medium shrink-0">
                          {st?.owned
                            ? "owned"
                            : `₹${fmtINR(p.price * (st?.qty ?? 0))}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-4 mb-5">
                  <div className="flex justify-between font-bold text-[#0f1c33] text-xl">
                    <span>Total</span>
                    <span>₹{fmtINR(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={selectedProducts.length === 0 || addingToCart}
                  className={`w-full h-12 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                    selectedProducts.length === 0
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : cartAdded
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {addingToCart ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : cartAdded ? (
                    <>
                      <Check className="w-5 h-5" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" /> Add Selected to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => router.back()}
                  className="w-full h-10 mt-2 border border-[#0f1c33] text-[#0f1c33] hover:bg-[#0f1c33] hover:text-white font-medium rounded-xl text-sm transition-colors"
                >
                  Back
                </button>
              </div>

              {/* Why it works */}
              {bundle.why_this_works && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                  <h4 className="font-semibold text-[#0f1c33] text-sm mb-2 flex items-center gap-2">
                    ✨ Why This Works
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {bundle.why_this_works}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sticky Bottom Summary Bar ── */}
        {selectedProducts.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
            <div className="container mx-auto max-w-5xl">
              <div className="bg-[#0f1c33] text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center justify-between gap-4">
                <div className="text-sm">
                  <span className="font-semibold text-white">
                    {selectedProducts.length} item
                    {selectedProducts.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-slate-400 mx-1.5">·</span>
                  <span className="text-slate-300">{totalQty} qty total</span>
                  <span className="text-slate-400 mx-1.5">·</span>
                  <span className="font-bold text-orange-400 text-lg">
                    ₹{fmtINR(totalPrice)}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
                >
                  {cartAdded ? (
                    <><Check className="w-4 h-4" /> Added!</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add Selected to Cart</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Padding so sticky bar doesn't cover last product */}
        {selectedProducts.length > 0 && <div className="h-24" />}
      </div>
    </div>
  );
}
