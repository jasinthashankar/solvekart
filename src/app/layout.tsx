import type { Metadata } from "next";
import "./globals.css";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import { Chatbot } from "@/components/Chatbot";
import { MobileNav } from "@/components/MobileNav";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "SolveKart — Describe your problem. We'll solve it.",
  description: "Don't search for products — describe your problem. SolveKart curates the perfect product bundle for your needs.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${jakarta.variable} font-body antialiased bg-white text-navy`}>
        <Providers>
          <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
          <div className="animate-fade-in pb-20 md:pb-0">
            {children}
          </div>
          <Chatbot />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
