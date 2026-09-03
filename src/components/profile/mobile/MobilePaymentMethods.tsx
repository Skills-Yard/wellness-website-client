"use client";

import { CreditCard, Plus, Smartphone } from "lucide-react";
import { toast } from "react-toastify";
import { MobileScreenHeader } from "./shared";

// There's no saved-payment-methods API yet (paymentApi.ts only does
// checkout/verify for a single Razorpay order) — so this screen shows the
// real (empty) state rather than inventing sample cards/UPI IDs that would
// look like the user's actual saved data. "Add" just flags that it's not
// wired up yet instead of silently doing nothing.
export default function MobilePaymentMethods({ onBack }: { onBack: () => void }) {
  const notReady = () => toast.info("Saving payment methods isn't available yet.");

  return (
    <div>
      <MobileScreenHeader title="Payment Methods" onBack={onBack} />

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-sm font-medium text-espresso">Saved Cards</h2>
          <p className="rounded-lg border border-dashed border-black/10 px-4 py-6 text-center text-xs text-[#999]">
            No saved cards yet.
          </p>
          <button
            type="button"
            onClick={notReady}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-black/8 py-4 text-xs font-medium text-espresso"
          >
            <Plus className="h-4.5 w-4.5 text-amber-600" />
            Add a New Card
          </button>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-espresso">UPI ID</h2>
          <p className="rounded-lg border border-dashed border-black/10 px-4 py-6 text-center text-xs text-[#999]">
            No UPI ID linked yet.
          </p>
          <button
            type="button"
            onClick={notReady}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-black/8 py-4 text-xs font-medium text-espresso"
          >
            <Smartphone className="h-4.5 w-4.5 text-amber-600" />
            Add UPI ID
          </button>
        </div>

        <p className="flex items-start gap-2 rounded-lg bg-[#FBF7ED] px-3 py-2.5 text-[11px] text-[#8a5a20]">
          <CreditCard className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          You can still pay by card or UPI at checkout — saving a method here for faster
          checkout is coming soon.
        </p>
      </div>
    </div>
  );
}
