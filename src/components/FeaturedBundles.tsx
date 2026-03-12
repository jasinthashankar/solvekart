import { Button } from "@/components/ui/button";
import { Star, PackageIcon, ShoppingCart } from "lucide-react";

export function FeaturedBundles() {
  const bundles = [
    {
      id: 1,
      title: "Back Pain Relief Kit",
      itemCount: 3,
      price: "1,429",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      description: "Ergonomic cushion, heat patch, and posture corrector.",
    },
    {
      id: 2,
      title: "Study Focus Setup",
      itemCount: 4,
      price: "3,196",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
      description: "Noise-cancelling earbuds, desk organizer, lamp, timer.",
    },
    {
      id: 3,
      title: "Gym Starter Kit",
      itemCount: 4,
      price: "3,246",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800",
      description: "Protein shaker, microfibre towel, grip gloves, duffel bag.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-sora text-3xl md:text-4xl font-bold text-navy mb-4">
              Trending Problem Solvers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Curated bundles for common challenges people face.
            </p>
          </div>
          <Button variant="outline" className="font-medium text-navy border-slate-300 hover:bg-slate-100">
            View All Bundles
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle) => (
            <div key={bundle.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-56 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={bundle.image} 
                  alt={bundle.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold text-navy shadow-sm">
                  <Star className="w-4 h-4 fill-orange text-orange" />
                  {bundle.rating}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-sora text-xl font-bold text-navy line-clamp-1">{bundle.title}</h3>
                </div>
                
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{bundle.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-6 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                  <PackageIcon className="w-4 h-4 text-orange" />
                  <span className="font-medium">{bundle.itemCount} products</span>
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-sm text-slate-500">Total Bundle</span>
                    <div className="font-sora text-2xl font-bold text-navy">₹{bundle.price}</div>
                  </div>
                  <Button className="bg-navy hover:bg-navy/90 text-white rounded-xl w-12 h-12 p-0 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
