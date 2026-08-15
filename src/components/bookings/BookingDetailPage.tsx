"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  Check,
  Clipboard,
  ClipboardList,
  MapPin,
  Star,
  User,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import {
  useBooking,
  useCancelBooking,
  useRaiseDispute,
  useRescheduleBooking,
  useSubmitReview,
  useUpdateReview,
} from "@/src/hooks/queries/useBookings";
import { OTP_VISIBLE_STATUSES, type BookingStatus } from "@/src/types/booking";
import {
  formatBookingAmount,
  formatBookingDate,
  formatBookingTime,
  getStatusMeta,
  isCancellableStatus,
  isDisputableStatus,
  isRescheduleStatus,
  resolveImageSrc,
} from "./bookingStatus";
import ReviewForm from "./ReviewForm";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import BottomNav from "@/src/components/home/mobile/Bottomnav";
import { useIsLoggedIn } from "./useIsLoggedIn";

const STEP_ORDER: BookingStatus[] = [
  "CONFIRMED",
  "PARTNER_EN_ROUTE",
  "PARTNER_ARRIVED",
  "IN_PROGRESS",
  "COMPLETED",
];
const STEP_LABELS = ["Confirmed", "On the way", "Arrived", "In progress", "Completed"];

/** Statuses that count as "at or past" a given step even though they aren't
 *  literally that step's value (matching / broadcast phases all read as
 *  "Confirmed" to the client). */
const stepIndexForStatus = (status: BookingStatus) => {
  if (["CONFIRMED", "BROADCASTED", "ACCEPTED"].includes(status)) return 0;
  const index = STEP_ORDER.indexOf(status);
  return index;
};

function ReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  placeholder,
  confirmLabel,
  isSubmitting,
  requireReason,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  placeholder: string;
  confirmLabel: string;
  isSubmitting: boolean;
  requireReason: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setReason("");
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-slate-500">{description}</p>
        </DialogHeader>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-amber-400"
        />
        <DialogFooter>
          <Button
            disabled={isSubmitting || (requireReason && reason.trim().length === 0)}
            onClick={() => onConfirm(reason.trim())}
            className="h-11 rounded-2xl bg-amber-500 font-bold text-white hover:bg-amber-500/90"
          >
            {isSubmitting ? "Submitting…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OtpCard({ otp }: { otp: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can fail (permissions/insecure context) — the code
      // is still visible on screen, so this is a non-blocking nicety.
    }
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">
        Share this code with your partner
      </p>
      <p className="mb-3 text-xs text-amber-700/80">
        Give this code when they arrive, and again to start the service.
      </p>
      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="font-mono text-4xl font-extrabold tracking-[0.3em] text-amber-900">
          {otp}
        </span>
      </div>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm hover:bg-amber-100 cursor-pointer"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy code"}
      </button>
    </div>
  );
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isMounted, isLoggedIn } = useIsLoggedIn();

  const { data: booking, isLoading } = useBooking(id);
  const cancelMutation = useCancelBooking();
  const disputeMutation = useRaiseDispute();
  const rescheduleMutation = useRescheduleBooking();
  const submitReviewMutation = useSubmitReview();
  const updateReviewMutation = useUpdateReview();

  const [activeDialog, setActiveDialog] = useState<
    null | "cancel" | "dispute" | "reschedule" | "review" | "editReview"
  >(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <ClipboardList className="mb-4 h-10 w-10 text-stone-300" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-bold text-slate-900">Log in to see this booking</h2>
        <button
          onClick={() => router.push("/profile")}
          className="rounded-2xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-amber-500/90"
        >
          Go to profile
        </button>
      </div>
    );
  }

  if (isLoading || !booking) {
    return <p className="px-4 py-20 text-center text-sm text-slate-400">Loading…</p>;
  }

  const status = getStatusMeta(booking.status);
  const stepIndex = stepIndexForStatus(booking.status);
  const showOtp = OTP_VISIBLE_STATUSES.includes(booking.status) && !!booking.arrivalOtp;
  const canCancel = isCancellableStatus(booking.status);
  const canReschedule = isRescheduleStatus(booking.status) && booking.bookingType !== "ON_DEMAND";
  const canDispute = isDisputableStatus(booking.status);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-10">
      <ToastContainer position="top-center" />
      <div className="mx-auto max-w-2xl bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.push("/bookings")}
            className="rounded-full p-1.5 hover:bg-slate-100 cursor-pointer"
            aria-label="Back to bookings"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Booking Details</h1>
        </div>

        <div className="space-y-4">
          {/* Status banner */}
          <div className={`flex items-center justify-between rounded-2xl px-4 py-3 ${status.className}`}>
            <span className="text-sm font-bold">{status.label}</span>
            <span className="font-mono text-xs opacity-70">#{booking.id.slice(-8)}</span>
          </div>

          {/* Step tracker — only for the linear happy-path statuses */}
          {stepIndex >= 0 && (
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="relative flex items-start justify-between">
                <div className="absolute top-[9px] left-[10px] right-[10px] h-0.5 bg-slate-100" />
                <div
                  className="absolute top-[9px] left-[10px] h-0.5 bg-amber-400 transition-all"
                  style={{ width: `${(stepIndex / (STEP_ORDER.length - 1)) * 100}%` }}
                />
                {STEP_LABELS.map((label, index) => (
                  <div key={label} className="relative z-10 flex flex-col items-center gap-1">
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        index <= stepIndex
                          ? "border-amber-500 bg-amber-500"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    <span className="w-14 text-center text-[10px] font-medium text-slate-500">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showOtp && booking.arrivalOtp && <OtpCard otp={booking.arrivalOtp} />}

          {booking.status === "CANCELLED_BY_CLIENT" ||
          booking.status === "CANCELLED_BY_PARTNER" ||
          booking.status === "CANCELLED_BY_ADMIN" ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-bold">Booking cancelled</p>
              {booking.cancellationReason && <p className="mt-1">{booking.cancellationReason}</p>}
            </div>
          ) : null}

          {booking.disputeReason && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-bold">Dispute raised</p>
              <p className="mt-1">{booking.disputeReason}</p>
              {booking.disputeResolution && (
                <p className="mt-2 text-red-600">
                  <span className="font-semibold">Resolution: </span>
                  {booking.disputeResolution}
                </p>
              )}
            </div>
          )}

          {/* Partner */}
          {booking.partner && (
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Your Partner
              </p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-amber-100">
                  {resolveImageSrc(booking.partner.profilePhotoKey) ? (
                    <Image
                      src={resolveImageSrc(booking.partner.profilePhotoKey) as string}
                      alt={booking.partner.name ?? "Partner"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-amber-600">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {booking.partner.name ?? "Assigned partner"}
                  </p>
                  {!!booking.partner.averageRating && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-700">
                        {booking.partner.averageRating.toFixed(1)}
                      </span>
                      {!!booking.partner.yearsOfExperience && (
                        <>
                          <span className="text-slate-300">•</span>
                          {booking.partner.yearsOfExperience} yrs exp
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Services Booked
            </p>
            <div className="space-y-2">
              {booking.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.serviceItemName}
                      {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                    </p>
                    {item.durationLabel && (
                      <p className="text-xs text-slate-400">{item.durationLabel}</p>
                    )}
                  </div>
                  <span className="font-semibold text-slate-700">
                    {formatBookingAmount(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address + schedule */}
          <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-start gap-2.5 text-sm">
              <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span className="text-slate-700">
                {formatBookingDate(booking.scheduledDate)} • {formatBookingTime(booking.scheduledTime)}
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span className="text-slate-700">
                {[
                  booking.address.customLabel,
                  booking.address.line1,
                  booking.address.line2,
                  booking.address.landmark,
                  booking.address.city,
                  booking.address.state,
                  booking.address.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Price Details
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatBookingAmount(booking.subtotal)}</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatBookingAmount(booking.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold text-slate-900">
                <span>Total Paid</span>
                <span>{formatBookingAmount(booking.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Review */}
          {booking.status === "COMPLETED" && (
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Your Review
              </p>
              {booking.review ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`h-4 w-4 ${
                          value <= booking.review!.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  {booking.review.comment && (
                    <p className="text-sm text-slate-600">{booking.review.comment}</p>
                  )}
                  {booking.review.partnerReply && (
                    <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                      <p className="mb-1 font-semibold text-slate-700">Partner replied:</p>
                      {booking.review.partnerReply}
                    </div>
                  )}
                  <button
                    onClick={() => setActiveDialog("editReview")}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    Edit review
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => setActiveDialog("review")}
                  className="h-11 w-full rounded-2xl bg-amber-500 font-bold text-white hover:bg-amber-500/90"
                >
                  Leave a review
                </Button>
              )}
            </div>
          )}

          {/* Actions */}
          {(canReschedule || canDispute || canCancel) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {canReschedule && (
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-2xl"
                  onClick={() => {
                    setRescheduleDate(booking.scheduledDate.slice(0, 10));
                    setRescheduleTime(booking.scheduledTime);
                    setActiveDialog("reschedule");
                  }}
                >
                  Reschedule
                </Button>
              )}
              {canDispute && (
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-2xl"
                  onClick={() => setActiveDialog("dispute")}
                >
                  Raise a dispute
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-2xl border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setActiveDialog("cancel")}
                >
                  Cancel booking
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="block md:hidden">
        <BottomNav
          activeTab="profile"
          onTabClick={(tabId) => {
            if (tabId === "top" || tabId === "home") router.push("/");
            else router.push(`/?tab=${tabId}`);
          }}
        />
      </div>

      <ReasonDialog
        open={activeDialog === "cancel"}
        onOpenChange={(open) => setActiveDialog(open ? "cancel" : null)}
        title="Cancel this booking?"
        description="Refund amount depends on how close we are to the scheduled time."
        placeholder="Let us know why (optional)"
        confirmLabel="Confirm cancellation"
        isSubmitting={cancelMutation.isPending}
        requireReason={false}
        onConfirm={(reason) =>
          cancelMutation.mutate(
            { id: booking.id, body: { reason: reason || undefined } },
            {
              onSuccess: () => {
                toast.success("Booking cancelled.");
                setActiveDialog(null);
              },
              onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't cancel this booking."),
            },
          )
        }
      />

      <ReasonDialog
        open={activeDialog === "dispute"}
        onOpenChange={(open) => setActiveDialog(open ? "dispute" : null)}
        title="Raise a dispute"
        description="Tell us what went wrong — our team will review it."
        placeholder="Describe the issue"
        confirmLabel="Submit dispute"
        isSubmitting={disputeMutation.isPending}
        requireReason
        onConfirm={(reason) =>
          disputeMutation.mutate(
            { id: booking.id, body: { reason } },
            {
              onSuccess: () => {
                toast.success("Dispute submitted. We'll get back to you.");
                setActiveDialog(null);
              },
              onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't submit the dispute."),
            },
          )
        }
      />

      <Dialog open={activeDialog === "reschedule"} onOpenChange={(open) => setActiveDialog(open ? "reschedule" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule booking</DialogTitle>
            <p className="text-sm text-slate-500">Pick a new date and time.</p>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(event) => setRescheduleDate(event.target.value)}
                  className="w-full text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Time</label>
              <input
                type="time"
                value={rescheduleTime}
                onChange={(event) => setRescheduleTime(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!rescheduleDate || !rescheduleTime || rescheduleMutation.isPending}
              onClick={() =>
                rescheduleMutation.mutate(
                  {
                    id: booking.id,
                    body: { scheduledDate: rescheduleDate, scheduledTime: rescheduleTime },
                  },
                  {
                    onSuccess: () => {
                      toast.success("Booking rescheduled.");
                      setActiveDialog(null);
                    },
                    onError: (err) =>
                      toast.error(err instanceof Error ? err.message : "Couldn't reschedule this booking."),
                  },
                )
              }
              className="h-11 rounded-2xl bg-amber-500 font-bold text-white hover:bg-amber-500/90"
            >
              {rescheduleMutation.isPending ? "Saving…" : "Confirm new time"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "review"} onOpenChange={(open) => setActiveDialog(open ? "review" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate your experience</DialogTitle>
          </DialogHeader>
          <ReviewForm
            submitLabel="Submit review"
            isSubmitting={submitReviewMutation.isPending}
            onSubmit={(values) =>
              submitReviewMutation.mutate(
                { id: booking.id, body: values },
                {
                  onSuccess: () => {
                    toast.success("Thanks for your review!");
                    setActiveDialog(null);
                  },
                  onError: (err) =>
                    toast.error(err instanceof Error ? err.message : "Couldn't submit your review."),
                },
              )
            }
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeDialog === "editReview"}
        onOpenChange={(open) => setActiveDialog(open ? "editReview" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your review</DialogTitle>
          </DialogHeader>
          <ReviewForm
            submitLabel="Save changes"
            initialRating={booking.review?.rating}
            initialComment={booking.review?.comment ?? ""}
            isSubmitting={updateReviewMutation.isPending}
            onSubmit={(values) =>
              updateReviewMutation.mutate(
                { id: booking.id, body: values },
                {
                  onSuccess: () => {
                    toast.success("Review updated.");
                    setActiveDialog(null);
                  },
                  onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update your review."),
                },
              )
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
