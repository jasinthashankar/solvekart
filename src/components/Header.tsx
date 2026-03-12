"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserCircle, LogOut } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container px-4 md:px-6 mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-sora text-2xl font-bold text-navy">
            SolveKart
          </span>
          <div className="h-2 w-2 rounded-full bg-orange mt-2" />
        </Link>
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-9 w-24 bg-slate-200 animate-pulse rounded-full" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded-full transition-colors">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <UserCircle className="w-8 h-8 text-slate-500" />
                )}
                <span className="text-sm font-medium hidden sm:inline-block">
                  {session.user?.name || "Profile"}
                </span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => signOut()}
                className="text-slate-500 hover:text-red-500"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button 
              className="bg-orange hover:bg-orange/90 text-white font-medium rounded-full px-6"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
