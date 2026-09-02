"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Calendar, Check, ClipboardList, Copy, MapPin, Receipt, X } from "lucide-react";
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
  /** The × in the corner — just closes the popup and leaves the visitor
   *  wherever they already were, unlike onPrimary/onHome which both
   *  navigate. */
  onDismiss: () => void;
}

// Fixed values (no Math.random) so the server and client markup match.
// Positioned as percentages of the icon/heading band specifically (see the
// `relative` wrapper around them below), not the whole card, so they read
// as scattered around the checkmark the way the desktop reference design
// has them rather than spread across the full popup.
const CONFETTI = [
  { top: "0%", left: "4%", color: "#FFB818", delay: "0s", dur: "1.3s" },
  { top: "10%", left: "92%", color: "#FF6B35", delay: "0.15s", dur: "1.5s" },
  { top: "55%", left: "0%", color: "#FFC558", delay: "0.3s", dur: "1.2s" },
  { top: "5%", left: "68%", color: "#FFD700", delay: "0.45s", dur: "1.35s" },
  { top: "70%", left: "96%", color: "#FFB818", delay: "0.6s", dur: "1.4s" },
  { top: "0%", left: "32%", color: "#FFC558", delay: "0.75s", dur: "1.5s" },
  { top: "60%", left: "14%", color: "#FF6B35", delay: "0.9s", dur: "1.25s" },
  { top: "20%", left: "82%", color: "#FFD700", delay: "1.05s", dur: "1.3s" },
] as const;

// Wider spread for the mobile layout's full-bleed dark banner (see the
// reference mobile design) — the desktop CONFETTI above is scoped to a
// small icon-sized wrapper instead, so it needs a tighter cluster.
const MOBILE_CONFETTI = [
  { top: "6%", left: "10%", color: "#FFB818", delay: "0s", dur: "1.3s" },
  { top: "12%", left: "82%", color: "#FF6B35", delay: "0.15s", dur: "1.5s" },
  { top: "26%", left: "6%", color: "#FFFFFF", delay: "0.3s", dur: "1.2s" },
  { top: "20%", left: "58%", color: "#FFC558", delay: "0.45s", dur: "1.35s" },
  { top: "40%", left: "88%", color: "#FFD700", delay: "0.6s", dur: "1.4s" },
  { top: "9%", left: "38%", color: "#FFB818", delay: "0.75s", dur: "1.5s" },
  { top: "46%", left: "18%", color: "#FF6B35", delay: "0.9s", dur: "1.25s" },
  { top: "33%", left: "68%", color: "#FFFFFF", delay: "1.05s", dur: "1.3s" },
  { top: "16%", left: "48%", color: "#FFD700", delay: "0.2s", dur: "1.45s" },
  { top: "52%", left: "78%", color: "#FFC558", delay: "0.35s", dur: "1.5s" },
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Insecure context / denied permission — the value is still on screen.
    }
  };

  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label="Copy"
      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#FBF1E4] text-[#8A5A2B] transition-colors hover:bg-[#F5E4C8] active:scale-95"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

/**
 * Mobile (below md:) keeps the original full-screen takeover — a dark
 * confetti banner up top with the checkmark, overlapped by a white details
 * card — rather than the centered popup desktop/tablet use (see the
 * `hidden md:flex` block right after this one). Not a routed page or
 * full-screen re-navigation either way — shown the instant checkout
 * settles, as a sibling of the cart <Sheet> (like CheckoutOverlay), so it
 * appears instantly with the data already in hand instead of redirecting
 * and re-fetching. No close button by design here, matching the reference
 * — mobile's own two buttons are the only way out (unlike the desktop
 * popup's ×, which just closes without navigating).
 */
function MobileBookingConfirmation({
  result,
  onPrimary,
  onHome,
}: Omit<BookingConfirmationProps, "onDismiss">) {
  const isSuccess = result.status === "success";
  const booking = isSuccess ? result.booking : null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-100 flex flex-col bg-white md:hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="relative overflow-hidden bg-[#0F0F0E] px-6 pt-16 pb-28 text-center">
          {isSuccess &&
            MOBILE_CONFETTI.map((dot) => (
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
              isSuccess ? "bg-[#FFC558]" : "bg-red-500"
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
                        <p className="mt-1.5 text-sm font-medium text-[#904720]">
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
                <div className="flex items-center justify-between px-3 py-3">
                  <span className="text-sm font-medium text-slate-900">Booking ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">
                      #{booking.id.slice(-8).toUpperCase()}
                    </span>
                    <CopyButton text={`#${booking.id.slice(-8).toUpperCase()}`} />
                  </div>
                </div>
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
          className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#25180F] py-3.5 text-[15px] font-medium text-white transition-all active:scale-[0.98]"
        >
          {isSuccess ? "Track Booking" : "Try Again"}
        </button>
        <button
          type="button"
          onClick={onHome}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-black/8 bg-white py-3.5 text-sm font-medium text-slate-900 transition-all active:scale-[0.98]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

/**
 * Desktop/tablet (md: and up) — a popup (centered dialog over a dark
 * backdrop) rather than mobile's full-screen takeover (see
 * MobileBookingConfirmation above).
 */
export default function BookingConfirmation({
  result,
  onPrimary,
  onHome,
  onDismiss,
}: BookingConfirmationProps) {
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
    <>
      <MobileBookingConfirmation result={result} onPrimary={onPrimary} onHome={onHome} />
      <div
      className="pointer-events-auto fixed inset-0 z-100 hidden items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:flex"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-5 top-5 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-slate-900 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex-1 overflow-y-auto px-6 pb-2 pt-12 sm:px-8">
          <div className="relative mx-auto flex h-16 w-20 items-center justify-center">
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
                    opacity: 0.8,
                  }}
                />
              ))}
            <div
              className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${
                isSuccess ? "bg-[#FBEBC8]" : "bg-red-50"
              }`}
            >
              {isSuccess ? (
                <Check className="h-7 w-7 text-[#904720]" strokeWidth={3} />
              ) : (
                <X className="h-7 w-7 text-red-500" strokeWidth={3} />
              )}
            </div>
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold text-slate-900">
            {isSuccess ? "Booking Confirmed!" : "Payment Failed"}
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-center text-sm text-slate-500">
            {isSuccess ? "We've sent the details to your email and SMS" : result.message}
          </p>

          {isSuccess && booking ? (
            <>
              <div className="mt-6 divide-y divide-black/[0.06] rounded-xl border border-black/[0.06]">
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
                        <p className="line-clamp-1 text-base font-semibold text-slate-900">
                          {item.serviceItemName}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#25180F]">
                          {formatBookingTime(booking.scheduledTime)} -{" "}
                          {formatBookingTime(booking.estimatedEndTime)}
                          <span className="h-1 w-1 rounded-full bg-slate-400" />
                          <span className="text-slate-500">At home</span>
                        </p>
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#904720]">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {formatBookingDate(booking.scheduledDate)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 divide-y divide-black/[0.06] rounded-xl border border-black/[0.06]">
                <div className="flex items-start justify-between gap-4 p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Address</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        {formatAddress(booking.address)}
                      </p>
                    </div>
                  </div>
                  <CopyButton text={formatAddress(booking.address)} />
                </div>
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-4 w-4 shrink-0 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-900">Booking ID</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500">
                      #{booking.id.slice(-8).toUpperCase()}
                    </span>
                    <CopyButton text={`#${booking.id.slice(-8).toUpperCase()}`} />
                  </div>
                </div>
              </div>
            </>
          ) : isSuccess ? (
            <div className="mt-6 rounded-xl border border-black/[0.06] px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-900">Your booking is being set up</p>
              <p className="mt-1 text-xs text-slate-500">
                It&apos;ll show under My Bookings in a moment — we&apos;ve emailed and texted you the
                details.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-black/[0.06] px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-900">You have not been charged</p>
              <p className="mt-1 text-xs text-slate-500">
                Any held slot has been released. You can try booking again whenever you&apos;re ready.
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 space-y-3 p-6 pt-4 sm:px-8">
          <button
            type="button"
            onClick={onPrimary}
            className="relative flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#25180F] py-3.5 text-[15px] font-medium text-white transition-all hover:bg-[#3a2518] active:scale-[0.98]"
          >
            {isSuccess ? "Track Booking" : "Try Again"}
            <ArrowRight className="absolute right-6 h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onHome}
            className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white py-3.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 active:scale-[0.98]"
          >
            Back to Home
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
