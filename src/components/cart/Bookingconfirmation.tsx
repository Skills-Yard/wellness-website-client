"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, ClipboardList, Copy, X } from "lucide-react";
import type { Booking } from "@/src/types/booking";
import {
  formatBookingDate,
  formatBookingTime,
  resolveImageSrc,
} from "@/src/components/bookings/bookingStatus";

/** What CartSheet hands this screen the instant Razorpay settles — a
 *  confirmed booking (or null if GET /bookings hasn't caught up yet), or a
 *  failed/abandoned payment with a reason to show. */
export type PaymentResult =
  | { status: "success"; booking: Booking | null }
  | { status: "failed"; message: string };

interface BookingConfirmationProps {
  result: PaymentResult;
  /** Success → "Track Booking"; failed → "Try Again". */
  onPrimary: () => void;
  onHome: () => void;
}

// Fixed values (no Math.random) so the server and client markup match.
const CONFETTI = [
  { top: "6%", left: "10%", color: "#FFB818", delay: "0s", dur: "1.3s" },
  { top: "12%", left: "82%", color: "#FF6B35", delay: "0.15s", dur: "1.5s" },
  { top: "26%", left: "6%", color: "#FFFFFF", delay: "0.3s", dur: "1.2s" },
  { top: "20%", left: "58%", color: "#D38516", delay: "0.45s", dur: "1.35s" },
  { top: "40%", left: "88%", color: "#FFD700", delay: "0.6s", dur: "1.4s" },
  { top: "9%", left: "38%", color: "#FFB818", delay: "0.75s", dur: "1.5s" },
  { top: "46%", left: "18%", color: "#FF6B35", delay: "0.9s", dur: "1.25s" },
  { top: "33%", left: "68%", color: "#FFFFFF", delay: "1.05s", dur: "1.3s" },
  { top: "16%", left: "48%", color: "#FFD700", delay: "0.2s", dur: "1.45s" },
  { top: "52%", left: "78%", color: "#D38516", delay: "0.35s", dur: "1.5s" },
] as const;

const formatAddress = (address: Booking["address"]) =>
  [
    address.customLabel,
    address.line1,
    address.line2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

function BookingIdRow({ id }: { id: string }) {
  const shortId = `#${id.slice(-8).toUpperCase()}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shortId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Insecure context / denied permission — the id is still on screen.
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-3">
      <span className="text-sm font-medium text-slate-900">Booking ID</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-500">{shortId}</span>
        <button
          type="button"
          onClick={() => void copy()}
          aria-label="Copy booking ID"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF5F0] text-[#25180F] cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

/**
 * Full-screen payment-result takeover, shown the moment checkout settles —
 * a sibling of the cart <Sheet> (like CheckoutOverlay), not a routed page,
 * so it appears instantly with the data already in hand instead of
 * redirecting and re-fetching.
 */
export default function BookingConfirmation({ result, onPrimary, onHome }: BookingConfirmationProps) {
  const isSuccess = result.status === "success";
  const booking = isSuccess ? result.booking : null;

  // The cart <Sheet> that ran this checkout is a modal Radix dialog; when
  // it closes programmatically from the Razorpay handler it can leave
  // `document.body` at `pointer-events: none`. By the time this screen is
  // up, payment is done and nothing underneath needs to stay frozen — so
  // clear the lock on mount, and again on unmount for the page we hand off
  // to (bookings detail / home).
  useEffect(() => {
    const unlock = () => {
      if (document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "";
      }
    };
    unlock();
    return unlock;
  }, []);

  return (
    <div className="pointer-events-auto fixed inset-0 z-100 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="relative overflow-hidden bg-[#0F0F0E] px-6 pt-16 pb-28 text-center">
          {isSuccess &&
            CONFETTI.map((dot) => (
              <span
                key={`${dot.top}-${dot.left}`}
                className="absolute h-1.5 w-1.5 rounded-full animate-bounce"
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

          <div
            className={`relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
              isSuccess ? "bg-[#D38516]" : "bg-red-500"
            }`}
          >
            {isSuccess ? (
              <Check className="h-7 w-7 text-white" strokeWidth={3} />
            ) : (
              <X className="h-7 w-7 text-white" strokeWidth={3} />
            )}
          </div>

          <h1 className="relative z-10 mt-5 text-xl font-semibold text-white">
            {isSuccess ? "Booking Confirmed!" : "Payment Failed"}
          </h1>
          <p className="relative z-10 mx-auto mt-2 max-w-[273px] text-[15px] text-white/90">
            {isSuccess ? "We've sent the details to your email and SMS" : result.message}
          </p>
        </div>

        <div className="relative z-10 mx-4 -mt-20 mb-6 rounded-lg border border-black/[0.04] bg-white shadow-[3px_2px_24px_rgba(0,0,0,0.08)]">
          {isSuccess && booking ? (
            <>
              <div className="divide-y divide-black/[0.04]">
                {booking.items.map((item) => {
                  const thumb = resolveImageSrc(item.serviceItem?.thumbnailKey);
                  return (
                    <div key={item.id} className="flex gap-3 p-3">
                      <div className="relative h-[86px] w-[119px] shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={item.serviceItemName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-stone-300">
                            <ClipboardList className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <p className="line-clamp-1 text-sm font-medium text-slate-900">
                          {item.serviceItemName}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#25180F]">
                          {formatBookingTime(booking.scheduledTime)} -{" "}
                          {formatBookingTime(booking.estimatedEndTime)}
                          <span className="h-1 w-1 rounded-full bg-slate-400" />
                          <span className="text-slate-500">At home</span>
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-[#D38516]">
                          {formatBookingDate(booking.scheduledDate)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="divide-y divide-black/[0.04] border-t border-black/[0.04]">
                <div className="flex items-start justify-between gap-6 px-3 py-3">
                  <span className="shrink-0 text-sm font-medium text-slate-900">Address</span>
                  <span className="text-right text-xs text-slate-500">
                    {formatAddress(booking.address)}
                  </span>
                </div>
                <BookingIdRow id={booking.id} />
              </div>
            </>
          ) : isSuccess ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-900">Your booking is being set up</p>
              <p className="mt-1 text-xs text-slate-500">
                It&apos;ll show under My Bookings in a moment — we&apos;ve emailed and texted you the
                details.
              </p>
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-900">You have not been charged</p>
              <p className="mt-1 text-xs text-slate-500">
                Any held slot has been released. You can try booking again whenever you&apos;re ready.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 space-y-3 border-t border-black/[0.06] bg-white p-4">
        <button
          type="button"
          onClick={onPrimary}
          className="flex w-full items-center justify-center rounded-lg bg-[#25180F] py-3.5 text-[15px] font-medium text-white cursor-pointer"
        >
          {isSuccess ? "Track Booking" : "Try Again"}
        </button>
        <button
          type="button"
          onClick={onHome}
          className="flex w-full items-center justify-center rounded-lg border border-black/8 bg-white py-3.5 text-sm font-medium text-slate-900 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
