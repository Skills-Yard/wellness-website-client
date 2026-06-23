import React from "react";

// Define the expected props for the component
interface FloatingCartProps {
  cartCount: number;
  cartTotal: number;
  onViewCart: () => void;
}

export default function FloatingCart({
  cartCount,
  cartTotal,
  onViewCart,
}: FloatingCartProps) {
  // Don't render the cart if it's empty
  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[60] w-full max-w-[calc(100%-2rem)] sm:max-w-md -translate-x-1/2 transition-all duration-300 animate-slideUp">
      <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-6 py-4 shadow-2xl ring-1 ring-white/10">
        
        {/* Cart Details */}
        <div className="flex flex-col">
          <span className="text-xs font-medium tracking-wide text-slate-400">
            {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}
          </span>
          <span className="text-lg font-bold text-white">
            ₹{cartTotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={onViewCart}
          className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-400 active:scale-95"
        >
          View Cart
        </button>
      </div>
    </div>
  );
}