"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/src/components/ui/sheet";
import { useCart } from "@/src/context/CartContext";
import { addressApi, formatAddressLabel, type Address, type CreateAddressBody } from "@/src/services/addressApi";
import { useAddresses } from "@/src/hooks/queries/useAddresses";
import { queryKeys } from "@/src/hooks/queries/queryKeys";
import { cartApi } from "@/src/services/cartApi";
import { paymentApi } from "@/src/services/paymentApi";
import EmptyCart from "./Emptycart";
import CartView from "./CartView";
import BookingConfirmation from "./Bookingconfirmation";
import TrackBooking from "./Trackbooking";
import { generateBookingId, getTomorrowDateTime } from "@/src/utils/data/Booking";
import { BookingDetails, BookingStep } from "@/src/utils/types/booking";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: "payment.failed", handler: (response: { error?: { description?: string } }) => void) => void;
    };
  }
}

const formatAddress = formatAddressLabel;

const getUserIdFromToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as { userId?: string; sub?: string; id?: string };
    return payload.userId ?? payload.sub ?? payload.id ?? null;
  } catch {
    return null;
  }
};

const loadRazorpay = () => new Promise<boolean>((resolve) => {
  if (window.Razorpay) return resolve(true);
  const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  if (existing) { existing.addEventListener("load", () => resolve(true), { once: true }); existing.addEventListener("error", () => resolve(false), { once: true }); return; }
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function CartSheet() {
  const { isCartOpen, setIsCartOpen, cartItems, clearCart, addressId, updateCartAddress } = useCart();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<BookingStep>("cart");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { data: addressesData, error: addressesQueryError } = useAddresses();
  const addresses = addressesData ?? [];

  useEffect(() => {
    if (!isCartOpen) return;
    if (!localStorage.getItem("accessToken")) {
      setAddressError("Please log in to select a service address.");
      return;
    }
    if (addressesQueryError) {
      setAddressError(
        addressesQueryError instanceof Error
          ? addressesQueryError.message
          : "Unable to load saved addresses.",
      );
      return;
    }
    setAddressError(null);
    setSelectedAddress((current) =>
      current && addresses.some((item) => item.id === current.id)
        ? current
        : (addresses.find((item) => item.id === addressId) ??
          addresses.find((item) => item.isDefault) ??
          addresses[0] ??
          null),
    );
    // addresses is a new array reference every render (derived from
    // addressesData ?? []) — depending on addressesData directly avoids
    // re-running this on every render once the query has settled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartOpen, addressesData, addressesQueryError, addressId]);

  function handleOpenChange(open: boolean) {
    setIsCartOpen(open);
    if (!open) window.setTimeout(() => setStep("cart"), 300);
  }

  const handleCreateAddress = async (address: Omit<CreateAddressBody, "userId">) => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setAddressError("Please log in before adding an address."); return; }
    const userId = getUserIdFromToken(token);
    if (!userId) { setAddressError("Your session does not include a user ID. Please log in again."); return; }
    try {
      setIsSavingAddress(true);
      setAddressError(null);
      const response = await addressApi.create({ ...address, userId }, token);
      queryClient.setQueryData<Address[]>(queryKeys.addresses(), (current) => [
        ...(current ?? []),
        response.data,
      ]);
      setSelectedAddress(response.data);
      updateCartAddress(response.data.id);
      setIsAddressFormOpen(false);
    } catch (error) {
      setAddressError(error instanceof Error ? error.message : "Unable to save this address.");
    } finally { setIsSavingAddress(false); }
  };

  const handleUpdateAddress = async (addressId: string, address: Omit<CreateAddressBody, "userId">) => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setAddressError("Please log in before editing an address."); return; }
    try {
      setIsSavingAddress(true);
      setAddressError(null);
      const response = await addressApi.update(addressId, address, token);
      queryClient.setQueryData<Address[]>(queryKeys.addresses(), (current) =>
        (current ?? []).map((item) => (item.id === addressId ? response.data : item)),
      );
      setSelectedAddress((current) => (current?.id === addressId ? response.data : current));
      setIsAddressFormOpen(false);
    } catch (error) {
      setAddressError(error instanceof Error ? error.message : "Unable to update this address.");
    } finally { setIsSavingAddress(false); }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) { setIsAddressFormOpen(true); setAddressError("Add or select an address before checkout."); return; }
    const token = localStorage.getItem("accessToken");
    if (!token) { setAddressError("Please log in before checkout."); return; }

    // Set once checkout() has actually created a booking + Razorpay order —
    // everything from here on (a failed attempt, the user dismissing the
    // modal, or even the browser tab closing) leaves that booking sitting
    // PENDING_PAYMENT with slots held until BOOKING_TIMEOUT expires it.
    // Reporting the failure immediately via /payment/verify (same endpoint
    // the success handler already used, just with outcome: "failed") runs
    // the backend's existing confirmPaymentFailure path right away instead
    // of waiting on that timeout — releasing the held slot and notifying the
    // user without a delay.
    let orderId: string | undefined;
    // Guards against reporting a failure after the success handler has
    // already settled this same checkout (Razorpay doesn't fire ondismiss
    // after a successful handler, but payment.failed + ondismiss can both
    // fire for one abandoned attempt — this keeps that a single report).
    let settled = false;

    const reportFailure = async (message: string) => {
      if (settled) return;
      settled = true;
      setPaymentError(message);
      setIsCheckingOut(false);
      if (!orderId) return;
      try {
        await paymentApi.verify({ gateway: "razorpay", gatewayOrderId: orderId, outcome: "failed" }, token);
      } catch (error) {
        // The booking still self-expires via BOOKING_TIMEOUT either way —
        // this call is just for a faster release, so a failure here isn't
        // worth surfacing over the message already shown above.
        console.error("Failed to report payment failure to server", error);
      }
    };

    try {
      setIsCheckingOut(true);
      setPaymentError(null);
      // Ask the server what zone the cart is *actually* pinned to right now,
      // instead of trusting CartContext's cached cartZoneId. A just-picked
      // address or slot can still have its PATCH /cart in flight when the
      // user hits Checkout, and sending that stale zone here is exactly
      // what trips the backend's "Cart zone does not match the selected
      // address zone" check — that check compares the cart row against
      // whatever zone this request claims, so the two must come from the
      // same read.
      const freshCart = await cartApi.get(token);
      const resolvedZoneId = freshCart.data.zoneId;
      if (!resolvedZoneId) {
        // Thrown, not returned directly — this is inside the try block, so
        // an early return here would skip the catch below's
        // setIsCheckingOut(false) and leave the button stuck on "Opening
        // payment…".
        throw new Error("Your cart isn't linked to a service zone yet. Reselect your address and try again.");
      }
      const idempotencyKey = crypto.randomUUID();
      const checkout = await paymentApi.checkout({ gateway: "razorpay", idempotencyKey }, token, resolvedZoneId);
      orderId = checkout.data.gatewayOrderId ?? checkout.data.orderId;
      const key = checkout.data.keyId ?? checkout.data.key ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!orderId || !key || !checkout.data.amount) throw new Error("Payment configuration is incomplete. Please try again shortly.");
      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error("Unable to load Razorpay checkout. Please try again.");
      // Narrows to `string` for the closures below — `orderId` itself stays
      // `string | undefined` at the outer scope (see reportFailure above),
      // since TS can't see that those closures only ever run after this
      // guard has already passed.
      const confirmedOrderId = orderId;
      const razorpay = new window.Razorpay({
        key,
        amount: checkout.data.amount,
        currency: checkout.data.currency ?? "INR",
        name: "Eezit",
        order_id: orderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_signature: string; razorpay_order_id?: string }) => {
          settled = true;
          try {
            await paymentApi.verify({ gateway: "razorpay", gatewayOrderId: response.razorpay_order_id ?? confirmedOrderId, gatewayPaymentId: response.razorpay_payment_id, gatewaySignature: response.razorpay_signature, outcome: "success" }, token);
            setBooking({ id: generateBookingId(), dateTime: getTomorrowDateTime(), address: formatAddress(selectedAddress), items: cartItems });
            clearCart();
            setStep("confirmation");
          } catch (error) {
            setPaymentError(error instanceof Error ? error.message : "Payment verification failed. Please contact support if you were charged.");
          } finally { setIsCheckingOut(false); }
        },
        modal: {
          // Fires when the user closes the checkout modal themselves —
          // either before attempting a charge, or after Razorpay's own
          // in-modal retry UI following a failed attempt. Either way,
          // nothing was captured, so this is the point the abandoned
          // booking should actually be reported as failed.
          ondismiss: () => {
            void reportFailure("Payment was not completed. Your slot has been released — feel free to try again.");
          },
        },
      });

      // Fires when a charge attempt is declined (e.g. insufficient funds,
      // bank decline) while Razorpay keeps its own modal open for the user
      // to retry with another method. Reports the decline immediately with
      // Razorpay's own reason instead of waiting for the user to give up
      // and dismiss the modal.
      razorpay.on("payment.failed", (response: { error?: { description?: string } }) => {
        void reportFailure(response?.error?.description || "Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (error) {
      await reportFailure(error instanceof Error ? error.message : "Unable to start checkout.");
    }
  };

  const handleTrack = () => setStep("tracking");
  const handleHome = () => { clearCart(); setIsCartOpen(false); };
  const handleDone = () => { clearCart(); setIsCartOpen(false); };

  return <Sheet open={isCartOpen} onOpenChange={handleOpenChange}><SheetContent side="right" className="w-full! !h-full !max-w-full overflow-hidden border-l border-gray-100 bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:!h-full sm:!max-w-[420px]"><SheetHeader className="sr-only"><SheetTitle>{step === "cart" ? "Your Cart" : step === "confirmation" ? "Booking Confirmation" : "Track Booking"}</SheetTitle></SheetHeader>{step === "cart" ? (cartItems.length === 0 ? <EmptyCart /> : <CartView address={selectedAddress} addresses={addresses} addressError={addressError} isAddressFormOpen={isAddressFormOpen} isSavingAddress={isSavingAddress} isCheckingOut={isCheckingOut} paymentError={paymentError} onToggleAddressForm={() => setIsAddressFormOpen((open) => !open)} onSelectAddress={(address) => { setSelectedAddress(address); updateCartAddress(address.id); setIsAddressFormOpen(false); setAddressError(null); }} onCreateAddress={(address) => void handleCreateAddress(address)} onUpdateAddress={(addressId, address) => void handleUpdateAddress(addressId, address)} onContinue={() => void handleCheckout()} />) : step === "confirmation" && booking ? <BookingConfirmation booking={booking} onTrack={handleTrack} onHome={handleHome} onBack={() => setStep("cart")} onClose={() => setIsCartOpen(false)} /> : step === "tracking" && booking ? <TrackBooking booking={booking} onBack={() => setStep("confirmation")} onClose={handleDone} /> : null}</SheetContent></Sheet>;
}
