"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  User, ShoppingBag, Bookmark, Clock, Settings,
  Package, ArrowRight, Trash2, Search, LogOut,
  ChevronRight, Heart, Star, CheckCircle2
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "history", label: "History", icon: Clock },
  { id: "preferences", label: "Preferences", icon: Settings },
];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  pending: "bg-slate-100 text-slate-600",
};

const HEALTH_CONDITIONS = ["Back pain", "Knee pain", "Eye strain", "Sleep issues"];
const INTERESTS = ["Fitness", "Study", "Gaming", "Cooking", "Travel"];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Overview state
  const [profileData, setProfileData] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);

  // Saved state
  const [savedItems, setSavedItems] = useState<any[]>([]);

  // History state
  const [history, setHistory] = useState<any[]>([]);

  // Preferences state
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/api/auth/signin?callbackUrl=/profile");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    if (data.user) {
      setProfileData(data.user);
      setPhone(data.user.phone || "");
      setAge(data.user.age || "");
      setGender(data.user.gender || "");
      setHealthConditions(data.user.preferences?.healthConditions || []);
      setInterests(data.user.preferences?.interests || []);
    }
  };

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const res = await fetch("/api/profile/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoadingOrders(false);
  }, []);

  const fetchSaved = useCallback(async () => {
    setLoadingSaved(true);
    const res = await fetch("/api/profile/saved");
    const data = await res.json();
    setSavedItems(data.savedItems || []);
    setLoadingSaved(false);
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    const res = await fetch("/api/profile/history");
    const data = await res.json();
    setHistory(data.history || []);
    setLoadingHistory(false);
  }, []);

  useEffect(() => {
    if (activeTab === "orders" && orders.length === 0) fetchOrders();
    if (activeTab === "saved") fetchSaved();
    if (activeTab === "history" && history.length === 0) fetchHistory();
  }, [activeTab]);

  const savePhone = async () => {
    setSavingPhone(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setSavingPhone(false);
    if (res.ok) toast.success("Phone updated!");
    else toast.error("Failed to update");
  };

  const savePreferences = async () => {
    setSavingPrefs(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age: age ? parseInt(String(age)) : null,
        gender,
        preferences: { healthConditions, interests },
      }),
    });
    setSavingPrefs(false);
    if (res.ok) toast.success("Preferences saved!");
    else toast.error("Failed to save");
  };

  const removeSaved = async (id: string) => {
    await fetch(`/api/profile/saved?id=${id}`, { method: "DELETE" });
    setSavedItems((prev) => prev.filter((s) => s.id !== id));
    toast.success("Removed from saved");
  };

  const clearHistory = async () => {
    await fetch("/api/profile/history", { method: "DELETE" });
    setHistory([]);
    toast.success("History cleared");
  };

  const addSavedToCart = async (item: any) => {
    if (item.item_type !== "product") {
      toast.error("Bundle saving not yet wired to cart");
      return;
    }
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: parseInt(item.item_id), quantity: 1 }),
    });
    if (res.ok) {
      toast.success("Added to cart!");
      router.push("/cart");
    } else toast.error("Failed to add to cart");
  };

  const toggleArray = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  if (status === "loading" || !profileData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="h-14 bg-white border-b border-slate-100 sticky top-0 z-30" />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 flex gap-5">
            <div className="w-20 h-20 rounded-full skeleton shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-1/4 skeleton" />
              <div className="h-4 w-1/3 skeleton" />
            </div>
            <div className="flex gap-6 shrink-0">
              <div className="w-12 h-10 skeleton" />
              <div className="w-12 h-10 skeleton" />
              <div className="w-12 h-10 skeleton" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="h-12 border-b border-slate-100 skeleton" />
            <div className="p-6 space-y-4">
              <div className="h-5 w-1/4 skeleton" />
              <div className="h-10 w-full skeleton" />
              <div className="h-10 w-full skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-1">
            <span className="font-sora text-xl font-bold text-navy">SolveKart</span>
            <div className="h-2 w-2 rounded-full bg-orange mt-1" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-sm font-medium text-slate-500 hover:text-navy">Cart</Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-orange/20" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange flex items-center justify-center text-white text-3xl font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-sora text-2xl font-bold text-navy">{session?.user?.name || "User"}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{session?.user?.email}</p>
            {profileData?.phone && <p className="text-slate-500 text-sm mt-0.5">📞 {profileData.phone}</p>}
          </div>
          <div className="flex gap-6 text-center shrink-0">
            <div>
              <div className="text-2xl font-bold text-navy">{orders.length || "—"}</div>
              <div className="text-xs text-slate-500 mt-0.5">Orders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">{savedItems.length || "—"}</div>
              <div className="text-xs text-slate-500 mt-0.5">Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">{profileData?.preferences?.interests?.length || "—"}</div>
              <div className="text-xs text-slate-500 mt-0.5">Interests</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Tab Nav */}
          <div className="flex overflow-x-auto border-b border-slate-100">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "border-orange text-orange"
                      : "border-transparent text-slate-500 hover:text-navy"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">

            {/* ── TAB 1: OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="space-y-6 max-w-lg">
                <div>
                  <h2 className="font-sora text-lg font-bold text-navy mb-4">Contact Info</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="email" value={session?.user?.email || ""} readOnly
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-slate-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                        />
                        <button
                          onClick={savePhone}
                          disabled={savingPhone}
                          className="px-4 py-2.5 bg-orange hover:bg-orange/90 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                        >
                          {savingPhone ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="font-sora text-lg font-bold text-navy mb-4">Quick Links</h2>
                  <div className="space-y-2">
                    {[
                      { label: "My Orders", tab: "orders", icon: Package },
                      { label: "Saved Items", tab: "saved", icon: Heart },
                      { label: "Search History", tab: "history", icon: Clock },
                      { label: "Preferences", tab: "preferences", icon: Star },
                    ].map((link) => {
                      const Icon = link.icon;
                      return (
                        <button
                          key={link.tab}
                          onClick={() => setActiveTab(link.tab)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                        >
                          <div className="w-9 h-9 bg-orange/10 rounded-full flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-orange" />
                          </div>
                          <span className="text-sm font-medium text-navy flex-1">{link.label}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: ORDERS ── */}
            {activeTab === "orders" && (
              <div>
                <h2 className="font-sora text-lg font-bold text-navy mb-5">Your Orders</h2>
                {loadingOrders ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-28 w-full skeleton" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No orders yet</p>
                    <Link href="/home" className="mt-4 inline-flex items-center gap-1 text-sm text-orange font-medium">
                      Start Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const products = order.products || [];
                      const displayId = order.delivery_address?.display_id || order.id?.slice(0, 8).toUpperCase();
                      return (
                        <div key={order.id} className="border border-slate-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-navy text-sm">#{displayId}</p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            {products.slice(0, 4).map((p: any, i: number) => (
                              <div key={i} className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                {p.image_url && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                            ))}
                            {products.length > 4 && (
                              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-medium">
                                +{products.length - 4}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-navy">₹{order.total_amount?.toLocaleString("en-IN")}</span>
                            <Link href={`/order/${order.id}`} className="text-xs text-orange font-medium flex items-center gap-1 hover:gap-2 transition-all">
                              View Details <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: SAVED ── */}
            {activeTab === "saved" && (
              <div>
                <h2 className="font-sora text-lg font-bold text-navy mb-5">Saved Items</h2>
                {loadingSaved ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 w-full skeleton" />)}
                  </div>
                ) : savedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Nothing saved yet</p>
                    <p className="text-sm text-slate-400 mt-1">Tap the bookmark icon on any product or bundle to save it here.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedItems.map((item) => (
                      <div key={item.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                        <div className="w-full h-32 bg-white rounded-xl overflow-hidden border border-slate-100">
                          {item.details?.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.details.image_url} alt={item.details?.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-navy text-sm leading-tight">{item.details?.name || "Unknown item"}</p>
                          {item.details?.brand && <p className="text-xs text-slate-500 mt-0.5">{item.details.brand}</p>}
                          {item.details?.price && (
                            <p className="font-bold text-orange mt-1 text-sm">₹{item.details.price.toLocaleString("en-IN")}</p>
                          )}
                          {item.details?.total_price && (
                            <p className="font-bold text-orange mt-1 text-sm">₹{item.details.total_price.toLocaleString("en-IN")}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addSavedToCart(item)}
                            className="flex-1 h-9 bg-orange hover:bg-orange/90 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeSaved(item.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 4: HISTORY ── */}
            {activeTab === "history" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-sora text-lg font-bold text-navy">Search History</h2>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Clear All
                    </button>
                  )}
                </div>
                {loadingHistory ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 w-full skeleton" />)}
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No search history</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((h) => (
                      <div key={h.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:shadow-sm transition-shadow">
                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                          <Search className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-navy text-sm truncate">{h.query}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                            <span>{new Date(h.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            {h.budget && <span>Budget: ₹{h.budget.toLocaleString("en-IN")}</span>}
                          </div>
                        </div>
                        <Link
                          href={`/home?q=${encodeURIComponent(h.query)}`}
                          className="text-xs font-medium text-orange flex items-center gap-1 hover:gap-2 transition-all shrink-0"
                        >
                          Search Again <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 5: PREFERENCES ── */}
            {activeTab === "preferences" && (
              <div className="max-w-xl space-y-6">
                <h2 className="font-sora text-lg font-bold text-navy">Your Preferences</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min={1} max={120}
                      placeholder="e.g. 25"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <div className="flex gap-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                            gender === g ? "border-orange bg-orange/5 text-orange" : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Health Conditions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {HEALTH_CONDITIONS.map((cond) => (
                      <label key={cond} className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        healthConditions.includes(cond) ? "border-orange bg-orange/5" : "border-slate-100 hover:border-slate-200"
                      }`}>
                        <input
                          type="checkbox"
                          checked={healthConditions.includes(cond)}
                          onChange={() => toggleArray(healthConditions, setHealthConditions, cond)}
                          className="hidden"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          healthConditions.includes(cond) ? "border-orange bg-orange" : "border-slate-300"
                        }`}>
                          {healthConditions.includes(cond) && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm font-medium ${healthConditions.includes(cond) ? "text-orange" : "text-slate-700"}`}>{cond}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleArray(interests, setInterests, interest)}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                          interests.includes(interest)
                            ? "border-orange bg-orange text-white"
                            : "border-slate-200 text-slate-600 hover:border-orange hover:text-orange"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={savePreferences}
                  disabled={savingPrefs}
                  className="w-full h-12 bg-orange hover:bg-orange/90 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 shadow-md"
                >
                  {savingPrefs ? "Saving…" : "Save Preferences"}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
