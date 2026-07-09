"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  X,
  MapPin,
  Calendar,
  ChevronRight,
  Ticket,
  CheckCircle2,
  ArrowLeft,
  Phone,
  MessageSquare,
  Star,
  Clock,
  Truck,
  AlertCircle,
  Trash2,
  Sparkles,
  Leaf,
  Shield,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/context/CartContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type BookingStep = "cart" | "confirmation" | "tracking";

interface BookingDetails {
  id: string;
  dateTime: string;
  address: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateBookingId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "#";
  for (let i = 0; i < 10; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function getTomorrowDateTime() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const day = d.getDate();
  const month = d.toLocaleString("en-IN", { month: "long" });
  return `${day} ${month} ${d.getFullYear()}, 11:00 AM`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Step 1 — Cart view */
function CartView({ onContinue }: { onContinue: () => void }) {
  const { cartItems, cartCount, removeFromCart, clearCart, location } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F3EFEB] mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-gray-900 leading-tight">
              My Cart
            </h2>
            <p className="text-xs text-gray-400">
              {cartCount} {cartCount === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>

        {/* Clear all button */}
        <button
          onClick={clearCart}
          title="Clear all items"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all cursor-pointer border border-red-100 hover:border-red-200"
        >
          <Trash2 className="w-3 h-3" />
          Clear all
        </button>
      </div>

      {/* Items + address + date + coupon */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAFAFA] border border-[#F0EDEA]"
          >
            <div className="relative w-[64px] h-[64px] rounded-xl overflow-hidden shrink-0 bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <h4 className="text-[13px] font-bold text-gray-900 leading-snug truncate max-w-[150px]">
                  {item.title}
                </h4>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.duration} • At home
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[13px] font-extrabold text-[#D38516]">
                  ₹{item.price.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                  Qty {item.quantity}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Address */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Address
                </p>
                <p className="text-[12px] font-semibold text-gray-800 leading-snug">
                  {location || "Home"}
                </p>
              </div>
            </div>
            <button className="text-[12px] font-semibold text-amber-600 flex items-center gap-0.5 hover:opacity-75 transition-opacity cursor-pointer">
              Change <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Date & Time */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Date &amp; Time
                </p>
                <p className="text-[12px] font-semibold text-gray-800">
                  Tomorrow
                </p>
                <p className="text-[11px] text-gray-400">
                  11:00 AM — 12:00 PM
                </p>
              </div>
            </div>
            <button className="text-[12px] font-semibold text-amber-600 flex items-center gap-0.5 hover:opacity-75 transition-opacity cursor-pointer">
              Change <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Coupon */}
        <button className="w-full rounded-2xl border border-dashed border-[#E8CCBE] px-4 py-3 flex items-center justify-between hover:bg-amber-50/40 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-4 h-4 text-amber-500" />
            <span className="text-[13px] font-semibold text-gray-700">
              Apply Coupon
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-[#F3EFEB] mt-2 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-gray-500 font-medium">
            Total ({cartCount} {cartCount === 1 ? "Item" : "Items"})
          </span>
          <span className="text-[20px] font-extrabold text-gray-900">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        <Button
          onClick={onContinue}
          className="w-full bg-[#25180F] hover:bg-[#3a2518] text-white font-bold h-12 rounded-2xl cursor-pointer shadow-lg active:scale-[0.98] transition-all border-none text-[15px]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

/** Step 2 — Booking Confirmation */
function BookingConfirmation({
  booking,
  onTrack,
  onHome,
}: {
  booking: BookingDetails;
  onTrack: () => void;
  onHome: () => void;
}) {
  const { cartItems } = useCart();

  // Stable confetti dots (avoid hydration mismatch by using fixed values)
  const confettiDots = [
    { top: "8%", left: "12%", color: "#FFB818", delay: "0s", dur: "1.2s" },
    { top: "15%", left: "78%", color: "#FF6B35", delay: "0.15s", dur: "1.5s" },
    { top: "30%", left: "5%", color: "#FFF", delay: "0.3s", dur: "1.3s" },
    { top: "22%", left: "55%", color: "#D38516", delay: "0.45s", dur: "1.2s" },
    { top: "45%", left: "90%", color: "#FFD700", delay: "0.6s", dur: "1.4s" },
    { top: "10%", left: "35%", color: "#FFB818", delay: "0.75s", dur: "1.5s" },
    { top: "50%", left: "20%", color: "#FF6B35", delay: "0.9s", dur: "1.2s" },
    { top: "38%", left: "65%", color: "#FFF", delay: "1.05s", dur: "1.3s" },
    { top: "18%", left: "48%", color: "#FFD700", delay: "0.2s", dur: "1.4s" },
    { top: "55%", left: "82%", color: "#D38516", delay: "0.35s", dur: "1.5s" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Celebration Hero */}
      <div className="relative -mx-6 mb-5 bg-[#1A1108] rounded-b-[32px] overflow-hidden pt-10 pb-8 px-6 flex flex-col items-center">
        {confettiDots.map((dot, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full animate-bounce"
            style={{
              backgroundColor: dot.color,
              top: dot.top,
              left: dot.left,
              animationDelay: dot.delay,
              animationDuration: dot.dur,
              opacity: 0.75,
            }}
          />
        ))}

        <div className="relative z-10 w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-[0_0_0_6px_rgba(255,184,24,0.25)] mb-4">
          <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="relative z-10 text-[22px] font-extrabold text-white text-center leading-tight mb-1">
          Booking Confirmed!
        </h2>
        <p className="relative z-10 text-[13px] text-white/60 text-center max-w-[220px]">
          We&apos;ve sent the details to your email and SMS
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Booked Items */}
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAFAFA] border border-[#F0EDEA]"
            >
              <div className="relative w-[56px] h-[56px] rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-bold text-gray-900 truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {item.duration} • At home
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Details Card */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="divide-y divide-[#F3EFEB]">
            <div className="px-4 py-3 flex items-start justify-between gap-2">
              <span className="text-[12px] text-gray-400 font-medium shrink-0 pt-0.5">
                Date &amp; Time
              </span>
              <span className="text-[12px] font-semibold text-gray-800 text-right">
                {booking.dateTime}
              </span>
            </div>
            <div className="px-4 py-3 flex items-start justify-between gap-2">
              <span className="text-[12px] text-gray-400 font-medium shrink-0 pt-0.5">
                Address
              </span>
              <span className="text-[12px] font-semibold text-gray-800 text-right max-w-[180px]">
                {booking.address}
              </span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-2">
              <span className="text-[12px] text-gray-400 font-medium">
                Booking ID
              </span>
              <span className="text-[12px] font-bold text-[#D38516] font-mono">
                {booking.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="pt-4 border-t border-[#F3EFEB] mt-2 space-y-2.5">
        <Button
          onClick={onTrack}
          className="w-full bg-[#25180F] hover:bg-[#3a2518] text-white font-bold h-12 rounded-2xl cursor-pointer shadow-lg active:scale-[0.98] transition-all border-none text-[15px]"
        >
          Track Booking
        </Button>
        <button
          onClick={onHome}
          className="w-full h-10 text-[14px] font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

/** Tracking stepper dot */
function TrackStep({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          done
            ? "border-amber-500 bg-amber-500"
            : active
            ? "border-amber-500 bg-white"
            : "border-gray-200 bg-white"
        }`}
      >
        {done && (
          <svg
            viewBox="0 0 10 10"
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              d="M1.5 5 L4 7.5 L8.5 2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {active && !done && (
          <div className="w-2 h-2 rounded-full bg-amber-500" />
        )}
      </div>
      <span
        className={`text-[9px] font-semibold text-center leading-tight max-w-[48px] ${
          done || active ? "text-gray-800" : "text-gray-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/** Step 3 — Track Booking */
function TrackBooking({
  booking,
  onBack,
  onClose,
}: {
  booking: BookingDetails;
  onBack: () => void;
  onClose: () => void;
}) {
  const { cartItems } = useCart();

  const trackSteps = [
    { label: "Confirmed", done: true, active: false },
    { label: "On the way", done: false, active: true },
    { label: "Arriving Soon", done: false, active: false },
    { label: "Started", done: false, active: false },
    { label: "Completed", done: false, active: false },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#F3EFEB] mb-4">
        <button
          onClick={onBack}
          className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h2 className="text-[17px] font-bold text-gray-900">Booking Details</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Status Banner */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-100">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">On the way</p>
            <p className="text-[11px] text-gray-500">
              Your therapist is on the way
            </p>
          </div>
        </div>

        {/* Progress Track */}
        <div className="px-3 py-4 rounded-2xl border border-[#F0EDEA] bg-white">
          <div className="relative flex items-start justify-between">
            {/* Background line */}
            <div className="absolute top-[9px] left-[10px] right-[10px] h-0.5 bg-gray-100 z-0" />
            {/* Filled portion */}
            <div
              className="absolute top-[9px] left-[10px] h-0.5 bg-amber-400 z-0"
              style={{ width: "22%" }}
            />
            {trackSteps.map((s, i) => (
              <div key={i} className="relative z-10">
                <TrackStep label={s.label} active={s.active} done={s.done} />
              </div>
            ))}
          </div>
        </div>

        {/* Therapist Details */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Therapist Details
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-[14px] shrink-0">
                  NS
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">
                    Neha Sharma
                  </p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-700">4.9</span>
                    <span className="text-gray-300">•</span>
                    5 yrs exp
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-xl border border-[#F0EDEA] flex items-center justify-center hover:bg-amber-50 transition-colors cursor-pointer">
                  <Phone className="w-4 h-4 text-amber-500" />
                </button>
                <button className="w-9 h-9 rounded-xl border border-[#F0EDEA] flex items-center justify-center hover:bg-amber-50 transition-colors cursor-pointer">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Services Booked
            </p>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[12px] font-semibold text-gray-800 truncate">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Booking Details
            </p>
            <div className="divide-y divide-[#F3EFEB]">
              <div className="py-2.5 flex items-start justify-between gap-2">
                <span className="text-[12px] text-gray-400 shrink-0 pt-0.5">
                  Date &amp; Time
                </span>
                <span className="text-[12px] font-semibold text-gray-800 text-right">
                  {booking.dateTime}
                </span>
              </div>
              <div className="py-2.5 flex items-start justify-between gap-2">
                <span className="text-[12px] text-gray-400 shrink-0 pt-0.5">
                  Address
                </span>
                <span className="text-[12px] font-semibold text-gray-800 text-right max-w-[180px]">
                  {booking.address}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-[12px] text-gray-400">Booking ID</span>
                <span className="text-[12px] font-bold text-[#D38516] font-mono">
                  {booking.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Help note */}
        <div className="flex items-start gap-2.5 px-3 py-3 rounded-2xl bg-blue-50 border border-blue-100">
          <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-snug">
            Our representative will call you within 30 minutes to confirm your
            appointment.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-[#F3EFEB] mt-2">
        <Button
          onClick={onClose}
          className="w-full bg-[#25180F] hover:bg-[#3a2518] text-white font-bold h-12 rounded-2xl cursor-pointer shadow-lg active:scale-[0.98] transition-all border-none text-[15px]"
        >
          Done
        </Button>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyCart() {
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
        className="!w-full !max-w-full !h-full sm:!max-w-[420px] sm:!h-full p-6 flex flex-col bg-white border-l border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden"
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
