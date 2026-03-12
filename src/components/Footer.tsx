import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white border-t border-navy-800">
      <div className="container px-4 md:px-6 mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1 mb-6">
              <span className="font-sora text-3xl font-bold text-white tracking-tight">
                SolveKart
              </span>
              <div className="h-2 w-2 rounded-full bg-orange mt-2" />
            </Link>
            <p className="text-slate-300 max-w-sm text-lg leading-relaxed">
              Describe your problem. We&apos;ll solve it. We curate the perfect product bundles so you don&apos;t have to search.
            </p>
          </div>
          
          <div>
            <h4 className="font-sora font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-300 hover:text-orange transition-colors">Home</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-orange transition-colors">About</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-orange transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-sora font-semibold text-lg mb-6 text-white">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-300 hover:text-orange transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-orange transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} SolveKart. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
