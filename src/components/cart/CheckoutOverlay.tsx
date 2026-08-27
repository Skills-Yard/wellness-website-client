"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

export type CheckoutStepState = "done" | "active" | "pending";

export interface CheckoutOverlayStep {
  label: string;
  state: CheckoutStepState;
}

interface CheckoutOverlayProps {
  steps: CheckoutOverlayStep[];
}

/**
 * Fully opaque, full-screen takeover spanning the entire checkout — from
 * the instant "Checkout" is clicked (CartSheet sets the first stage before
 * any network call) through to the booking actually being fetched back.
 * Deliberately has no dismiss affordance: it only ever goes away because
 * CartSheet flips checkoutStage back to "idle" itself, either once
 * waitForConfirmedBooking resolves or a failure sends the user back to the
 * cart — never from something the user clicks here.
 *
 * Renders as a sibling of <Sheet> in CartSheet, not inside it, so it stays
 * up across the moment the cart drawer itself closes (right when payment
 * is confirmed) and covers whatever page is underneath either way.
 *
 * The one gap this can't cover: Razorpay's own checkout popup needs the
 * user's actual input (card/UPI/OTP), so CartSheet hides this overlay
 * (checkoutStage -> "idle") for that window and brings it back once
 * Razorpay's handler/failure callback fires — there's no way to stay
 * opaque through a step that requires the user to interact with something
 * else on top of it.
 */
export default function CheckoutOverlay({ steps }: CheckoutOverlayProps) {
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-100 flex items-center justify-center bg-white px-6"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">Just a moment…</h2>
        <p className="mt-1 text-sm text-stone-500">Please don&apos;t close or refresh this page.</p>

        <div className="mt-6 space-y-3 text-left">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              {step.state === "done" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              ) : step.state === "active" ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-amber-500" />
              ) : (
                <span className="h-5 w-5 shrink-0 rounded-full border-2 border-stone-200" />
              )}
              <span
                className={`text-sm ${
                  step.state === "pending" ? "text-stone-400" : "font-semibold text-stone-800"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
