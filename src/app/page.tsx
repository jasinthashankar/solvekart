import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedBundles } from "@/components/FeaturedBundles";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col pt-0">
      <Header />
      <div className="flex-1">
        <Hero />
        <HowItWorks />
        <FeaturedBundles />
      </div>
      <Footer />
    </main>
  );
}
