"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  quantity: number;
  product_id: number;
  products: {
    id: number;
    name: string;
    brand: string;
    price: number;
    image_url: string;
    category: string;
    delivery_days: number;
  };
}

export default function CartPage() {
  const { status } = useSession();
  const router = useRouter();
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/cart");
      return;
    }
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch cart");
      
      const validItems = (data.cartItems || []).filter((item: CartItem) => item.products != null);
      setItems(validItems);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQty: number) => {
    try {
      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity: newQty }),
      });
      if (!res.ok) throw new Error("Failed to update");
      
      if (newQty <= 0) {
        setItems(items.filter((item) => item.id !== cartItemId));
        toast.success("Item removed");
      } else {
        setItems(items.map((item) => item.id === cartItemId ? { ...item, quantity: newQty } : item));
      }
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart/remove?id=${cartItemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove");
      setItems(items.filter((item) => item.id !== cartItemId));
      toast.success("Item removed");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 pt-20">
        <div className="container mx-auto max-w-5xl">
          <div className="h-10 w-48 skeleton mb-8" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-5">
                  <div className="w-24 h-24 skeleton shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 skeleton" />
                    <div className="h-3 w-1/4 skeleton" />
                    <div className="h-6 w-1/4 skeleton" />
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-80 h-64 bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <div className="h-6 w-1/2 skeleton mb-4" />
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-full skeleton" />
              <div className="h-12 w-full skeleton mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl shadow-sm text-center">
          <p className="font-semibold mb-2">Something went wrong</p>
          <p className="text-sm">{error}</p>
          <button onClick={fetchCart} className="mt-4 px-4 py-2 bg-red-100 font-medium rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  // Calculate Order Summary
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.products.price * item.quantity), 0);
  
  // 8% discount if 3 or more items
  let discount = 0;
  if (totalItemsCount >= 3) {
    discount = Math.floor(subtotal * 0.08);
  }

  // Free delivery above 499, else 49
  let deliveryFee = 0;
  if (items.length > 0 && subtotal - discount < 499) {
    deliveryFee = 49;
  }

  const grandTotal = subtotal - discount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-orange" />
          </div>
          <h1 className="font-sora text-2xl font-bold text-navy mb-3">Your cart is empty</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Looks like you haven&apos;t added anything to your cart yet. Let&apos;s go solve some problems!
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 bg-orange hover:bg-orange/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 pt-20">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-sora text-3xl font-bold text-navy">Shopping Cart</h1>
          <Link href="/home" className="text-sm font-medium text-orange hover:text-orange/80 transition-colors">
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Cart Items List */}
          <div className="flex-1 w-full space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center relative">
                
                {/* Product Image */}
                <div className="w-full sm:w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-4xl overflow-hidden shrink-0 border border-slate-100">
                  {item.products.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                  ) : (
                    "📦"
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-navy mb-1">{item.products.name}</h3>
                  <div className="text-sm text-slate-500 mb-2 truncate">
                    {item.products.brand} · {item.products.category}
                  </div>
                  <div className="font-bold text-navy">
                    ₹{item.products.price.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-4 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:text-orange transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-navy select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, 10))}
                      className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:text-orange transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="font-sora font-bold text-orange whitespace-nowrap">
                      ₹{(item.products.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-80 shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-sora text-lg font-bold text-navy mb-5 pb-4 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-semibold text-navy">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (8% off bulk)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-green-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-navy">₹{deliveryFee}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-navy">Total</span>
                  <span className="font-sora font-extrabold text-orange">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full h-12 bg-orange hover:bg-orange/90 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Safe and secure payments
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
