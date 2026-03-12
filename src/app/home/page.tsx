"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Search, Camera, Mic, ArrowRight, ShoppingCart, Bell,
  ChevronDown, User, Package, LogOut, Clock, X, Sparkles, CheckCircle, Lightbulb, LayoutDashboard
} from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";

/* ─────────────────── Types ─────────────────── */
interface SearchHistoryItem {
  id: string;
  query: string;
  created_at: string;
}

// Web Speech API minimal types (not in standard TS lib)
interface SpeechRecognitionResult {
  readonly 0: { transcript: string };
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  readonly length: number;
}
interface SpeechRecognitionEvt extends Event {
  results: SpeechRecognitionResultList;
}
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: SpeechRecognitionEvt) => void) | null;
  start(): void;
  stop(): void;
}
type SpeechRecognitionConstructor = new () => ISpeechRecognition;

/* ─────────────────── Skeleton Card ─────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
      <div className="h-3 w-1/3 bg-slate-200 rounded-full mb-4" />
      <div className="h-6 w-3/4 bg-slate-200 rounded-full mb-3" />
      <div className="h-4 w-full bg-slate-100 rounded-full mb-2" />
      <div className="h-4 w-2/3 bg-slate-100 rounded-full mb-6" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-14 bg-slate-100 rounded-xl" />
        ))}
      </div>
      <div className="mt-4 h-12 w-full bg-orange-100 rounded-xl" />
    </div>
  );
}

/* ─────────────────── Camera Modal ─────────────────── */
function CameraModal({
  onClose,
  onImage,
}: {
  onClose: () => void;
  onImage: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-navy mb-4 text-center">Add Image</h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-orange/40 hover:border-orange hover:bg-orange/5 transition-colors"
          >
            <Camera className="w-6 h-6 text-orange" />
            <span className="font-medium text-slate-700">Take Photo</span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            <Package className="w-6 h-6 text-slate-500" />
            <span className="font-medium text-slate-700">Upload Image</span>
          </button>
        </div>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onImage(f); }}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onImage(f); }}
        />
      </div>
    </div>
  );
}

/* ─────────────────── Main Home Page ─────────────────── */
export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Search state
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Voice state
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [imageThumb, setImageThumb] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);

  // Profile dropdown
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Recent searches
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const chips = [
    "Back pain", "Study setup", "Gym starter",
    "Birthday gift", "New home", "YouTube setup",
  ];

  /* ── Fetch recent searches ── */
  useEffect(() => {
    // authOptions exposes user.id in the session
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    
    // Fetch recent searches
    fetch(`/api/search-history?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then(({ searches }) => setRecentSearches(searches || []));

    // Fetch smart recommendations
    setLoadingSuggestions(true);
    fetch("/api/recommendations")
      .then((r) => r.text()) // Fetch as text first
      .then((text) => {
        // Extract JSON array from response - more robustly
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonStr = text.substring(jsonStart, jsonEnd + 1);
          const suggestions = JSON.parse(jsonStr);
          setSmartSuggestions(suggestions.slice(0, 3)); // Assuming suggestions is an array
        } else {
          console.error("Could not find JSON array in recommendations response:", text);
          setSmartSuggestions([]);
        }
        setLoadingSuggestions(false);
      })
      .catch((error) => {
        console.error("Error fetching smart recommendations:", error);
        setLoadingSuggestions(false);
      });
  }, [session]);

  /* ── Close profile dropdown on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── Inject slider CSS ── */
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none;
        width: 20px; height: 20px; border-radius: 50%;
        background: #f97316; cursor: pointer;
        border: 2px solid white; box-shadow: 0 2px 6px rgba(249,115,22,0.4);
      }
      input[type="range"]::-moz-range-thumb {
        width: 20px; height: 20px; border-radius: 50%;
        background: #f97316; cursor: pointer;
        border: 2px solid white; box-shadow: 0 2px 6px rgba(249,115,22,0.4);
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  /* ── Voice Input ── */
  const startVoice = useCallback(() => {
    const w = window as unknown as Record<string, SpeechRecognitionConstructor | undefined>;
    const SpeechRec = w["SpeechRecognition"] || w["webkitSpeechRecognition"];

    if (!SpeechRec) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    const rec = new SpeechRec();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-IN";

    rec.onstart = () => {
      setListening(true);
      toast("Listening… speak your problem", { icon: "🎤" });
    };

    rec.onresult = (e: SpeechRecognitionEvt) => {
      const transcript = Array.from({ length: e.results.length })
        .map((_, i) => e.results[i][0].transcript)
        .join("");
      setQuery(transcript);
    };

    rec.onend = () => setListening(false);
    rec.onerror = () => {
      setListening(false);
      toast.error("Microphone error. Please try again.");
    };

    rec.start();
    recognitionRef.current = rec;
  }, []);

  /* ── Image Analysis ── */
  const handleImage = async (file: File) => {
    setShowCamera(false);
    const url = URL.createObjectURL(file);
    setImageThumb(url);
    setAnalyzingImage(true);
    setQuery("Analyzing your image…");

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch("/api/analyze-image", { method: "POST", body: fd });
      const { description } = await res.json();
      setQuery(description || "I need help finding the right products");
    } catch {
      setQuery("I need help finding the right products");
    } finally {
      setAnalyzingImage(false);
    }
  };

  /* ── Search Submit ── */
  const handleSolve = async (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");

    // Save to history
    const userId = (session?.user as any)?.id;
    if (userId) {
      fetch("/api/search-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, query: q }),
      });
    }

    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, budget }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      const ids = (data.bundleIds as string[]).join(",");
      router.push(`/results?ids=${ids}&q=${encodeURIComponent(q)}`);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      setLoading(false);
    }
  };

  /* ── Clear history ── */
  const clearHistory = async () => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    await fetch(`/api/search-history?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
    setRecentSearches([]);
  };

  /* ── Cart count (placeholder) ── */
  const cartCount = 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ══════════════ STICKY HEADER ══════════════ */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="font-sora text-xl font-bold text-[#0f1c33]">SolveKart</span>
            <div className="h-2 w-2 rounded-full bg-orange mt-1" />
          </Link>

          {/* Center mini search */}
          <div className="flex-1 mx-4 hidden md:block">
            <div className="relative max-w-sm mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search a problem…"
                className="w-full h-9 pl-9 pr-4 rounded-full bg-slate-100 border border-slate-200 text-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) { setQuery(val); handleSolve(val); }
                  }
                }}
              />
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2 ml-4 shrink-0 pr-2">
            {/* Bell Notifications */}
            <NotificationBell />

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : session ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfile((v) => !v)}
                  className="flex items-center gap-1.5 hover:bg-slate-100 rounded-full px-2 py-1 transition-colors"
                >
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-bold text-sm">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <p className="px-4 py-2 text-xs text-slate-400 truncate">{session.user?.email}</p>
                    <hr className="border-slate-100 mx-2 mb-1" />
                    {session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-orange hover:bg-orange/5 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors">
                      <User className="w-4 h-4 text-slate-500" /> Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors">
                      <Package className="w-4 h-4 text-slate-500" /> Orders
                    </Link>
                    <hr className="border-slate-100 mx-2 my-1" />
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="bg-orange hover:bg-orange/90 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-12 flex flex-col items-center">

        {/* Tagline */}
        <div className="inline-flex items-center gap-2 bg-orange/10 text-orange px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-orange/20">
          <Sparkles className="w-4 h-4" />
          Powered by AI — describe any problem
        </div>

        <h1 className="font-sora text-4xl md:text-5xl font-extrabold text-[#0f1c33] text-center mb-3 leading-tight">
          What&apos;s your problem today?
        </h1>
        <p className="text-slate-500 text-lg text-center mb-10">
          Don&apos;t search for products — describe your problem
        </p>

        {/* ── BIG SEARCH BAR ── */}
        <div className="w-full flex flex-col sm:flex-row gap-3 items-center mb-5">
          <div className="relative w-full flex-1">
            {/* Image thumbnail preview */}
            {imageThumb && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageThumb} alt="preview" className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
              </div>
            )}
            <Search className={`absolute ${imageThumb ? "left-14" : "left-5"} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
            <input
              type="text"
              className={`w-full h-16 ${imageThumb ? "pl-24" : "pl-14"} pr-28 rounded-full border-2 border-slate-200 shadow-sm focus:outline-none focus:border-orange focus:ring-4 focus:ring-orange/20 text-lg transition-all disabled:opacity-60`}
              placeholder="e.g. My back hurts after long work sessions…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSolve()}
              disabled={loading || analyzingImage}
            />

            {/* Camera + Mic icons inside input */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                disabled={loading}
                onClick={() => setShowCamera(true)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Camera"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button
                disabled={loading}
                onClick={startVoice}
                className={`p-2 rounded-full transition-all ${
                  listening
                    ? "bg-red-100 text-red-500 animate-pulse ring-4 ring-red-200"
                    : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                }`}
                aria-label="Mic"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Solve button */}
          <button
            onClick={() => handleSolve()}
            disabled={loading || !query.trim() || analyzingImage}
            className="h-16 px-8 rounded-full bg-orange hover:bg-orange/90 text-white font-semibold text-lg w-full sm:w-auto shrink-0 shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <><ArrowRight className="h-5 w-5" /> Solve It</>
            )}
          </button>
        </div>

        {/* ── BUDGET SLIDER ── */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Budget</span>
            <span className="text-sm font-bold text-orange">₹{budget.toLocaleString("en-IN")}</span>
          </div>
          <div className="relative w-full">
            <input
              type="range"
              min={100}
              max={50000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f97316 0%, #f97316 ${((budget - 100) / (50000 - 100)) * 100}%, #e2e8f0 ${((budget - 100) / (50000 - 100)) * 100}%, #e2e8f0 100%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>₹100</span><span>₹50,000</span>
          </div>
        </div>

        {/* ── QUICK CHIPS ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => { setQuery(chip); handleSolve(chip); }}
              disabled={loading}
              className="px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-orange hover:text-orange hover:shadow-md transition-all disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ── SMART RECOMMENDATIONS ── */}
        {!loading && smartSuggestions.length > 0 && (
          <div className="w-full mb-8">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Lightbulb className="w-4 h-4 text-orange" />
              <span className="text-sm font-semibold text-slate-600">You might also need...</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {smartSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => { setQuery(suggestion); handleSolve(suggestion); }}
                  className="px-4 py-2 rounded-xl bg-orange/5 border border-orange/20 text-sm font-medium text-orange hover:bg-orange/10 hover:border-orange/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="w-full text-red-500 text-sm mb-4 bg-red-50 px-5 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* ── SKELETON LOADING CARDS ── */}
        {loading && (
          <div className="w-full space-y-4">
            <div className="flex items-center gap-2 text-orange font-medium mb-2 animate-pulse justify-center">
              <Sparkles className="w-4 h-4" />
              AI is analyzing your problem…
            </div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* ── RECENT SEARCHES ── */}
        {!loading && recentSearches.length > 0 && (
          <div className="w-full mt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-600">Recent Searches</span>
              <button
                onClick={clearHistory}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Clear history
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSolve(s.query)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-600 hover:border-orange hover:text-orange transition-all"
                >
                  <Clock className="w-3 h-3 text-slate-400" />
                  {s.query}
                </button>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ══════════════ CAMERA MODAL ══════════════ */}
      {showCamera && (
        <CameraModal onClose={() => setShowCamera(false)} onImage={handleImage} />
      )}

    </div>
  );
}
