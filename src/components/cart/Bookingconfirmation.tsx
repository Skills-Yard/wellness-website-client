"use client";

import Image from "next/image";
import { CheckCircle2, Clock, ArrowLeft, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { BookingDetails } from "@/src/utils/types/booking";

interface BookingConfirmationProps {
  booking: BookingDetails;
  onTrack: () => void;
  onHome: () => void;
  onBack: () => void;
  onClose: () => void;
}

/** Step 2 — Booking Confirmation */
export default function BookingConfirmation({
  booking,
  onTrack,
  onHome,
  onBack,
  onClose,
}: BookingConfirmationProps) {
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
      {/* Celebration Hero — flush with top of sheet, no gap */}
      <div className="relative -mx-6 -mt-6 mb-5 bg-[#1A1108] rounded-b-[32px] overflow-hidden pt-14 pb-8 px-6 flex flex-col items-center">
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-5 left-5 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-white" />
        </button>

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
        <p className="relative z-10 text-[13px] text-white/60 text-center max-w-55">
          We&apos;ve sent the details to your email and SMS
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Booked Items */}
        <div className="space-y-2">
          {booking.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAFAFA] border border-[#F0EDEA]"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
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
              <span className="text-[12px] font-semibold text-gray-800 text-right max-w-45">
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
