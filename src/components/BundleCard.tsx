"use client";

import { useState } from "react";
import { Star, ShoppingCart, CheckCircle, Package, Minus, Plus, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface BundleCardProps {
  bundle: Bundle;
  products: Product[];
  isRecommended?: boolean;
}

const TIER_STYLES: Record<string, { border: string; bg: string; badge: string; badgeCls: string }> = {
  "Budget Kit":      { border: "border-green-200",  bg: "bg-green-50/60",   badge: "💚 Budget",      badgeCls: "bg-green-100 text-green-700" },
  "Recommended Kit": { border: "border-orange/50",  bg: "bg-orange/5",      badge: "⭐ Recommended", badgeCls: "bg-orange text-white" },
  "Complete Kit":    { border: "border-navy/30",    bg: "bg-navy/5",        badge: "👑 Premium",     badgeCls: "bg-navy text-white" },
};

function getTierStyle(name: string) {
  for (const key of Object.keys(TIER_STYLES)) {
    if (name.includes(key.replace(" Kit", ""))) return TIER_STYLES[key];
  }
  return TIER_STYLES["Recommended Kit"];
}

function getTierLabel(name: string): string {
  if (name.includes("Budget")) return "Budget Kit";
  if (name.includes("Complete")) return "Complete Kit";
  return "Recommended Kit";
}

export function BundleCard({ bundle, products, isRecommended = false }: BundleCardProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // State: quantities for each product (default 1)
  const initialQuantities: Record<number, number> = {};
  products.forEach((p) => { initialQuantities[p.id] = 1; });
  const [quantities, setQuantities] = useState<Record<number, number>>(initialQuantities);
  
  // State: "I have this"
  const [owned, setOwned] = useState<Set<number>>(new Set());
  
  const [addingCart, setAddingCart] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!session) { toast.error("Please sign in to save items"); return; }
    setSaving(true);
    if (saved) {
      toast("Already saved to your profile!");
      setSaving(false);
      return;
    }
    const res = await fetch("/api/profile/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: bundle.id, itemType: "bundle" }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      toast.success("Bundle saved to your profile!");
    } else {
      toast.error("Failed to save");
    }
  };

  const tierLabel = getTierLabel(bundle.name);
  const style = getTierStyle(tierLabel);

  // Derived state
  const activeProducts = products.filter((p) => !owned.has(p.id) && quantities[p.id] > 0);
  const totalItems = activeProducts.reduce((sum, p) => sum + quantities[p.id], 0);
  const liveTotal = activeProducts.reduce((sum, p) => sum + (p.price * quantities[p.id]), 0);
  
  // Is the whole bundle "active"? (Nothing deselected or zeroed)
  const isFullBundle = products.every((p) => !owned.has(p.id) && quantities[p.id] >= 1);

  const updateQuantity = (id: number, delta: number) => {
    if (owned.has(id)) return; // Can't change quantity if owned
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(5, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const toggleCheck = (id: number) => {
    if (owned.has(id)) return;
    setQuantities((prev) => {
      const current = prev[id] || 0;
      // If unchecked (0), checking it restores it to 1. If checked (>0), unchecking sets to 0.
      return { ...prev, [id]: current > 0 ? 0 : 1 };
    });
  };

  const toggleOwned = (id: number) => {
    setOwned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Reset quantity to 0 since user already has it
        setQuantities((q) => ({ ...q, [id]: 0 }));
      }
      return next;
    });
  };

  const handleAddToCart = async (addFull: boolean = false) => {
    // If addFull is true, we act as if everything is 1 quantity except owned items
    const cartItems = addFull
      ? products.filter(p => !owned.has(p.id)).map(p => ({ productId: p.id, quantity: 1 }))
      : activeProducts.map((p) => ({ productId: p.id, quantity: quantities[p.id] }));

    if (cartItems.length === 0) {
      toast.error("Select at least one product!");
      return;
    }
    
    const totalAdded = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setAddingCart(true);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, bundleId: bundle.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      toast.success(
        addFull
          ? `🛒 Full bundle added! ${totalAdded} items in cart`
          : `✅ ${totalAdded} item${totalAdded > 1 ? "s" : ""} added to cart!`
      );
      
      router.push("/cart");
      
    } catch (err) {
      const e = err as Error;
      if (!session) {
        toast.success(
          addFull
            ? `🛒 Full bundle added! ${totalAdded} items in cart`
            : `✅ ${totalAdded} item${totalAdded > 1 ? "s" : ""} added to cart!`
        );
      } else {
        toast.error(e.message);
      }
    } finally {
      setAddingCart(false);
    }
  };

  return (
    <div className={`rounded-2xl border-2 ${style.border} ${style.bg} overflow-hidden shadow-sm hover:shadow-lg transition-shadow relative`}>
      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        title="Save bundle"
        className={`absolute top-4 left-4 z-10 p-1.5 rounded-full transition-all shadow-sm ${
          saved ? "bg-orange text-white" : "bg-white/80 hover:bg-white text-slate-400 hover:text-orange"
        }`}
      >
        <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
      </button>
      {isRecommended && (
        <div className="absolute top-4 right-4 z-10">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange text-white shadow-sm animate-pulse">
            ⭐ Most Popular
          </span>
        </div>
      )}

      {/* Bundle Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${style.badgeCls}`}>
              {style.badge}
            </div>
            <h2 className="font-sora text-xl font-bold text-navy">{bundle.name}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{bundle.tagline}</p>
            {bundle.why_this_works && (
              <p className="text-blue-600 text-sm italic mt-2 leading-relaxed">
                💡 {bundle.why_this_works}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="font-sora text-2xl font-extrabold text-orange">
              ₹{liveTotal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="px-4 pb-4 space-y-2">
        {products.map((product) => {
          const qty = quantities[product.id] || 0;
          const isOwned = owned.has(product.id);
          const isFaded = isOwned || qty === 0;

          return (
            <div
              key={product.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-xl p-4 border transition-all ${
                isFaded ? "opacity-50 border-slate-100" : "border-slate-100 hover:border-slate-200"
              }`}
            >
              {/* Left Side: Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                {/* Checkbox */}
                <button
                  onClick={() => toggleCheck(product.id)}
                  disabled={isOwned}
                  className="shrink-0"
                  aria-label={qty > 0 ? "Uncheck product" : "Check product"}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isOwned
                      ? "border-slate-200 bg-slate-100"
                      : (qty > 0)
                      ? "border-orange bg-orange text-white"
                      : "border-slate-300"
                  }`}>
                    {(qty > 0 || isOwned) && (
                      <CheckCircle className="w-3 h-3" strokeWidth={3} />
                    )}
                  </div>
                </button>

                {/* Product image placeholder */}
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xl shrink-0">
                  📦
                </div>

                {/* Name + Brand */}
                <div className="flex-1 min-w-0 pr-2">
                  <p className={`font-semibold text-sm leading-tight truncate ${isOwned ? "text-slate-400 line-through" : "text-navy"}`}>
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 truncate">
                    <span>{product.brand}</span>
                    <span>·</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                    <Star className="w-3 h-3 fill-orange text-orange" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Price, Qty, Owned */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                
                {/* Line Total */}
                {!isOwned ? (
                  <div className="w-20 text-right shrink-0">
                    {qty > 0 ? (
                      <p className="font-bold text-navy text-sm">
                        ₹{(product.price * qty).toLocaleString("en-IN")}
                      </p>
                    ) : (
                      <p className="font-semibold text-slate-400 text-sm">₹0</p>
                    )}
                  </div>
                ) : (
                  <div className="w-20 text-right shrink-0 text-xs text-green-600 font-medium flex items-center justify-end gap-1">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  {!isOwned && (
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        disabled={qty === 0}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-orange/10 hover:text-orange hover:border-orange/30 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" strokeWidth={3} />
                      </button>
                      <span className="w-4 text-center text-sm font-bold text-navy select-none">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        disabled={qty >= 5}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-orange/10 hover:text-orange hover:border-orange/30 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" strokeWidth={3} />
                      </button>
                    </div>
                  )}

                  {/* "I have this" button */}
                  <button
                    onClick={() => toggleOwned(product.id)}
                    className={`w-[100px] text-xs px-2 py-1.5 rounded-lg border transition-all font-medium ${
                      isOwned
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "border-slate-200 text-slate-500 hover:border-green-300 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {isOwned ? "✓ Already owned" : "I have this"}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ── ACTION TASKS (Phase 5) ── */}
      {bundle.tasks && bundle.tasks.length > 0 && (
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-sm font-bold text-navy uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-orange" />
            Your Action Plan
          </div>
          <div className="grid gap-2">
            {bundle.tasks.map((task, i) => (
              <label 
                key={i} 
                className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-orange/20 cursor-pointer transition-all group"
              >
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-orange focus:ring-orange accent-orange" 
                />
                <span className="text-sm text-slate-700 font-medium group-hover:text-navy transition-colors">
                  {task}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Footer – Live summary + CTAs */}
      <div className="px-4 pb-5">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2 text-slate-600 text-sm font-medium">
              <Package className="w-4 h-4 text-slate-400" />
              Selected: <strong className="text-navy">{activeProducts.length} items</strong> <span className="text-slate-400">({totalItems} qty total)</span>
            </span>
            <span className="font-sora font-bold text-navy text-xl">
              ₹{liveTotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <Link
              href={`/bundle/${bundle.id}`}
              className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center transition-colors text-sm"
            >
              View Bundle Details
            </Link>
            <button
              onClick={() => handleAddToCart(false)}
              disabled={addingCart || totalItems === 0}
              className="flex-1 h-12 bg-orange hover:bg-orange/90 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors text-sm disabled:opacity-60"
            >
              <ShoppingCart className="w-4 h-4" />
              Add Selected to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
