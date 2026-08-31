"use client";

import Link from "next/link";
import { Calendar, Home, ShoppingCart } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useCart } from "@/src/context/CartContext";

interface BottomNavProps {
  /** Which tab represents the page this instance is rendered on, if any —
   *  Home and Bookings are real pages a user can "be on". Omitted entirely
   *  on pages that are neither (profile, notifications, devices, ...).
   *  Cart isn't part of this — it highlights itself directly off whether
   *  the cart sheet is actually open, since that can be true regardless of
   *  which page is underneath it. */
  activeTab?: "home" | "bookings";
  /** "Home" is the one tab whose behavior actually depends on where this
   *  is rendered — scroll-to-top on the home page itself, navigate there
   *  from everywhere else. Bookings/Cart behave identically regardless of
   *  page, so they're wired internally instead of needing a prop each. */
  onHomeClick: () => void;
}

export default function BottomNav({ activeTab, onHomeClick }: BottomNavProps) {
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 mx-auto flex w-[90%] max-w-[700px] items-center justify-around gap-4 rounded-[38px] border border-black/12 bg-white px-6 py-1.5 shadow-lg">
      <button
        type="button"
        onClick={onHomeClick}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-1 transition-transform active:scale-90",
          activeTab === "home" ? "text-[#CB7D14]" : "text-black/36",
        )}
        aria-label="Home"
      >
        <Home className="h-5.5 w-5.5" />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <Link
        href="/bookings"
        className={cn(
          "flex cursor-pointer flex-col items-center gap-1 transition-transform active:scale-90",
          activeTab === "bookings" ? "text-[#CB7D14]" : "text-black/36",
        )}
      >
        <Calendar className="h-5.5 w-5.5" />
        <span className="text-[10px] font-medium">Bookings</span>
      </Link>

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className={cn(
          "relative flex cursor-pointer flex-col items-center gap-1 transition-transform active:scale-90",
          isCartOpen ? "text-[#CB7D14]" : "text-black/36",
        )}
        aria-label="Cart"
      >
        <ShoppingCart className="h-5.5 w-5.5" />
        <span className="text-[10px] font-medium">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white ring-2 ring-white">
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
}
