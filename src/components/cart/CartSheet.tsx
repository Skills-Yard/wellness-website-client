"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { useCart } from "@/src/context/CartContext";
import { BookingDetails, BookingStep } from "@/src/utils/types/Booking";
import EmptyCart from "./Emptycart";
import CartView from "./CartView";
import BookingConfirmation from "./Bookingconfirmation";
import TrackBooking from "./Trackbooking";
import {
  generateBookingId,
  getTomorrowDateTime,
} from "@/src/utils/data/Booking";

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function CartSheet() {
  const { isCartOpen, setIsCartOpen, cartItems, clearCart, location } =
    useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<BookingStep>("cart");
  const [booking, setBooking] = useState<BookingDetails | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleOpenChange(open: boolean) {
    setIsCartOpen(open);
    if (!open) {
      // Reset step after the close animation completes
      setTimeout(() => setStep("cart"), 300);
    }
  }

  function handleContinue() {
    const details: BookingDetails = {
      id: generateBookingId(),
      dateTime: getTomorrowDateTime(),
      address: location || "Home, Delhi 110001",
    };
    setBooking(details);
    setStep("confirmation");
  }

  function handleTrack() {
    setStep("tracking");
  }

  function handleHome() {
    clearCart();
    setIsCartOpen(false);
  }

  function handleDone() {
    clearCart();
    setIsCartOpen(false);
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full! !max-w-full !h-full sm:!max-w-[420px] sm:!h-full p-6 flex flex-col bg-white border-l border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden"
      >
        {/* Visually hidden title for screen-reader accessibility */}
        <SheetHeader className="sr-only">
          <SheetTitle>
            {step === "cart"
              ? "Your Cart"
              : step === "confirmation"
                ? "Booking Confirmation"
                : "Track Booking"}
          </SheetTitle>
        </SheetHeader>

        {/* Step Router */}
        {!isMounted ? null : step === "cart" ? (
          cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <CartView onContinue={handleContinue} />
          )
        ) : step === "confirmation" && booking ? (
          <BookingConfirmation
            booking={booking}
            onTrack={handleTrack}
            onHome={handleHome}
            onBack={() => setStep("cart")}
            onClose={() => setIsCartOpen(false)}
          />
        ) : step === "tracking" && booking ? (
          <TrackBooking
            booking={booking}
            onBack={() => setStep("confirmation")}
            onClose={handleDone}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
