"use client";

import { ShoppingCart, Sparkles, Leaf, Shield, Star } from "lucide-react";
import { useCart } from "@/src/context/CartContext";

// ─── Empty State ──────────────────────────────────────────────────────────────
export default function EmptyCart() {
  const { setIsCartOpen } = useCart();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-6">
      {/* Decorative background blobs */}
      <div className="relative w-full flex items-center justify-center mb-8">
        {/* Outer glow ring */}
        <div className="absolute w-44 h-44 rounded-full bg-amber-50 opacity-60" />
        <div className="absolute w-32 h-32 rounded-full bg-amber-100 opacity-40" />

        {/* Floating sparkle dots */}
        <span className="absolute top-2 left-[28%] w-2 h-2 rounded-full bg-amber-300 opacity-60 animate-bounce" style={{ animationDuration: "2.1s" }} />
        <span className="absolute top-6 right-[24%] w-1.5 h-1.5 rounded-full bg-[#D38516] opacity-50 animate-bounce" style={{ animationDuration: "1.7s", animationDelay: "0.3s" }} />
        <span className="absolute bottom-3 left-[22%] w-1.5 h-1.5 rounded-full bg-amber-400 opacity-40 animate-bounce" style={{ animationDuration: "2.4s", animationDelay: "0.6s" }} />
        <span className="absolute bottom-2 right-[26%] w-2 h-2 rounded-full bg-amber-200 opacity-70 animate-bounce" style={{ animationDuration: "1.9s", animationDelay: "0.9s" }} />

        {/* Icon container */}
        <div className="relative z-10 w-24 h-24 rounded-[28px] bg-gradient-to-br from-amber-400 to-[#D38516] flex items-center justify-center shadow-[0_8px_32px_rgba(211,133,22,0.35)] rotate-3">
          <ShoppingCart className="w-11 h-11 text-white" strokeWidth={1.8} />
          {/* Sparkle badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Text */}
      <h3 className="text-[19px] font-extrabold text-gray-900 leading-tight mb-2">
        Your cart is empty
      </h3>
      <p className="text-[13px] text-gray-400 max-w-[210px] mx-auto leading-relaxed mb-7">
        Discover premium at-home spa &amp; wellness treatments crafted for you.
      </p>

      {/* Feature hints */}
      <div className="w-full space-y-2.5 mb-8">
        {[
          { icon: Leaf, label: "Natural & organic products", color: "text-emerald-500", bg: "bg-emerald-50" },
          { icon: Shield, label: "Certified expert therapists", color: "text-blue-500", bg: "bg-blue-50" },
          { icon: Star, label: "4.8+ rated by 10,000+ users", color: "text-amber-500", bg: "bg-amber-50" },
        ].map(({ icon: Icon, label, color, bg }) => (
          <div key={label} className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl ${bg} border border-white/60`}>
            <div className={`w-7 h-7 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0`}>
              <Icon className={`w-3.5 h-3.5 ${color}`} />
            </div>
            <span className="text-[12px] font-semibold text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => setIsCartOpen(false)}
        className="w-full h-12 rounded-2xl bg-[#25180F] hover:bg-[#3a2518] text-white text-[14px] font-bold shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-4 h-4" />
        Browse Services
      </button>
    </div>
  );
}