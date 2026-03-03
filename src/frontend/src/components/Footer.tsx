import { Link } from "@tanstack/react-router";
import { Fish, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="mt-auto bg-ocean-deep text-white/80">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Fish className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                FishMarket
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Premium fresh seafood delivered to your door. Sustainably sourced
              from the world's finest waters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/my-orders"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                My Orders
              </Link>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Freshness Promise</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>🐟 Fresh catch, delivered daily</li>
              <li>🌊 Sustainably sourced</li>
              <li>❄️ Temperature controlled delivery</li>
              <li>✅ Quality guaranteed</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/40">
            © {year}. Built with{" "}
            <Heart className="inline h-3.5 w-3.5 text-coral fill-coral" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-white/30">
            All seafood is sourced from sustainable, certified fisheries.
          </p>
        </div>
      </div>
    </footer>
  );
}
