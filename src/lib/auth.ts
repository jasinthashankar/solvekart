import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import jwt from "jsonwebtoken";
import { supabaseAdmin } from "./supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Upsert the user into public.users table manually
      // This bypasses the need for the strict SupabaseAdapter schema
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();

      if (!existingUser) {
        const generatedId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        const { data: newUser } = await supabaseAdmin
          .from("users")
          .insert({
            id: generatedId,
            email: user.email,
            name: user.name || "",
            avatar_url: user.image || "",
          })
          .select("id")
          .single();
        
        if (newUser) {
          user.id = newUser.id;
        } else {
          user.id = generatedId;
        }
      } else {
        user.id = existingUser.id;
      }
      
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        // Expose user ID in session
        (session.user as { id?: string }).id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      let realId = token.sub;

      // If this is a new sign in, OR if the existing token has a bad (non-UUID) sub
      if (user || (token.sub && token.sub.length !== 36 && token.email)) {
        const emailToLookup = user?.email || token.email;
        
        const { data: dbUser } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", emailToLookup)
          .single();
          
        if (dbUser) {
          realId = dbUser.id;
        } else if (emailToLookup) {
          // Recreate missing user to ensure they have a valid UUID
          const generatedId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
          await supabaseAdmin.from("users").insert({
            id: generatedId,
            email: emailToLookup,
            name: token.name || user?.name || "",
            avatar_url: token.picture || user?.image || ""
          });
          realId = generatedId;
        }
        
        token.sub = realId;
      }

      // Add a Supabase JWT token to access Supabase securely
      if (realId) {
        token.supabaseAccessToken = jwt.sign(
          {
            aud: "authenticated",
            exp: Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 7, // 7 days
            sub: realId,
            email: token.email,
            role: "authenticated",
          },
          process.env.SUPABASE_SERVICE_ROLE_KEY || ""
        );
      }
      return token;
    },
  },
};
