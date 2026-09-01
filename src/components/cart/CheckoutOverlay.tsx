"use client";

import { Check, ClipboardList, Loader2, ShieldCheck, Sparkles, Timer } from "lucide-react";

export type CheckoutStepState = "done" | "active" | "pending";

export interface CheckoutOverlayStep {
  label: string;
  description: string;
  state: CheckoutStepState;
  /** Set once this step is first reached (done or active) — undefined for
   *  steps still pending, same as the reference design showing no
   *  timestamp yet for those. */
  time?: string;
}

interface CheckoutOverlayProps {
  steps: CheckoutOverlayStep[];
}

/**
 * A popup (centered dialog over a dark backdrop) spanning the whole
 * checkout — from the instant "Checkout" is clicked (CartSheet sets the
 * first stage before any network call) through to the booking actually
 * being fetched back.
 *
 * Deliberately has no dismiss control: this is showing an in-progress,
 * uninterruptible step (payment/booking is actively being created), not a
 * finished result — closing it wouldn't stop anything running underneath,
 * it would just leave the visitor with no indication that it's still
 * happening (exactly what "Please don't close or refresh this page" below
 * is trying to prevent), and no way to bring it back short of the whole
 * checkout finishing on its own. Only CartSheet clears it (checkoutStage ->
 * "idle"), once there's an actual outcome to show instead.
 *
 * Renders as a sibling of <Sheet> in CartSheet, not inside it, so it stays
 * up across the moment the cart drawer itself closes (right when payment
 * is confirmed) and covers whatever page is underneath either way.
 *
 * The one gap this can't cover: Razorpay's own checkout popup needs the
 * user's actual input (card/UPI/OTP), so CartSheet hides this overlay
 * (checkoutStage -> "idle") for that window and brings it back once
 * Razorpay's handler/failure callback fires — there's no way to stay up
 * through a step that requires the user to interact with something else
 * on top of it.
 */
export default function CheckoutOverlay({ steps }: CheckoutOverlayProps) {
  return (
    // p-0 md:p-4 / h-full md:h-auto / rounded-none md:rounded-3xl — full-
    // screen takeover below md: (no visible backdrop margin, no rounded
    // corners, fills the viewport exactly like the mobile booking-
    // confirmation screen does), the same centered popup as before from
    // md: up, untouched.
    <div
      className="pointer-events-auto fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-0 backdrop-blur-sm md:p-4"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-full w-full max-w-lg overflow-y-auto rounded-none bg-white p-6 shadow-2xl sm:p-8 md:h-auto md:max-h-[90vh] md:rounded-3xl">
        {/* Illustration — a clipboard (the booking) with a stopwatch badge
            (the wait), a couple of sparkle dots for the same "glory" touch
            the rest of the app uses on its icon badges. */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-50" />
          <Sparkles className="absolute -top-1 left-1 h-3.5 w-3.5 text-amber-300" />
          <Sparkles className="absolute right-0 top-3 h-2.5 w-2.5 text-amber-300" />
          <ClipboardList className="relative z-10 h-11 w-11 text-amber-500" strokeWidth={1.5} />
          <span className="absolute -bottom-1 -right-1 z-20 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-amber-400 shadow-sm">
            <Timer className="h-4 w-4 text-white" />
          </span>
        </div>

        <h2 className="mt-4 text-center text-xl font-bold text-stone-900">Please wait…</h2>
        <p className="mt-1 text-center text-sm text-stone-500">We are processing your booking.</p>

        {/* Pipeline — same connecting-line pattern as the service detail
            popup's Procedure section (SectionSteps.tsx): a status circle
            per step, joined by a vertical line to the next. */}
        <div className="mt-6">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (
              <div key={step.label} className="flex gap-3">
                <div className="flex shrink-0 flex-col items-center">
                  {step.state === "done" ? (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  ) : step.state === "active" ? (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50">
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-stone-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                    </span>
                  )}
                  {!isLast && <span className="my-1 w-px flex-1 bg-stone-200" />}
                </div>

                <div className={`flex flex-1 items-start justify-between gap-3 ${isLast ? "pb-0" : "pb-5"}`}>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        step.state === "pending" ? "text-stone-400" : "text-stone-900"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`mt-0.5 text-xs ${
                        step.state === "active"
                          ? "text-amber-600"
                          : step.state === "done"
                            ? "text-stone-400"
                            : "text-stone-300"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {step.time && (
                    <span className="shrink-0 pt-0.5 text-xs text-stone-400">{step.time}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-[#FBF1E0] p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-amber-500">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-900">Your booking is safe with us.</p>
            <p className="text-xs text-stone-500">Please don&apos;t close or refresh this page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
