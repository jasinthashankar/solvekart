"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, Mic, ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const chips = [
    "My back hurts",
    "Starting college",
    "Going to gym",
    "Friend's birthday",
    "New home",
    "Can't sleep",
  ];

  const handleSolve = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // Redirect to results page with all bundle IDs
      const ids = (data.bundleIds as string[]).join(",");
      router.push(`/results?ids=${ids}&q=${encodeURIComponent(query)}`);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-orange/5 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-navy/5 pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-orange/10 text-orange px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-orange/20">
          <Sparkles className="w-4 h-4" />
          Powered by AI — describes any problem
        </div>

        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight max-w-4xl mb-6 leading-tight">
          What&apos;s your problem today?
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-[600px] font-medium">
          Don&apos;t search for products — describe your problem
        </p>

        <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-3 items-center mb-6">
          <div className="relative w-full flex-1">
            <input
              type="text"
              className="w-full h-16 pl-6 pr-24 rounded-full border-2 border-slate-200 shadow-sm focus:outline-none focus:border-orange focus:ring-4 focus:ring-orange/20 text-lg transition-all disabled:opacity-60"
              placeholder="e.g. My back hurts after long work sessions..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSolve()}
              disabled={loading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400">
              <button disabled={loading} className="p-1 hover:text-slate-700 transition-colors" aria-label="Camera"><Camera size={24} /></button>
              <button disabled={loading} className="p-1 hover:text-slate-700 transition-colors" aria-label="Mic"><Mic size={24} /></button>
            </div>
          </div>
          <Button
            onClick={handleSolve}
            disabled={loading || !query.trim()}
            className="h-16 px-8 rounded-full bg-orange hover:bg-orange/90 text-white font-semibold text-xl w-full sm:w-auto shrink-0 shadow-lg transition-transform hover:scale-105 flex items-center gap-2 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Solving...
              </>
            ) : (
              <>Solve It <ArrowRight className="h-6 w-6" /></>
            )}
          </Button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-orange font-medium mb-4 animate-pulse">
            <Sparkles className="w-4 h-4" />
            AI is curating 3 perfect solution bundles for you...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mb-4 bg-red-50 px-5 py-3 rounded-xl border border-red-100 max-w-xl">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => { setQuery(chip); setError(""); }}
              disabled={loading}
              className="px-5 py-2.5 rounded-full border border-slate-200 bg-white text-sm md:text-base font-medium text-slate-600 hover:border-orange hover:text-orange hover:shadow-md transition-all disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
