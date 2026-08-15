/** Hand-maintained types mirroring what the backend's `bookingDetailsInclude`
 *  actually returns (see eezit-backend's booking.repository.ts) — this repo
 *  has no shared types package with the backend, same precedent as
 *  src/types/notification.ts. Only the fields the UI actually reads are
 *  modeled; anything else on the real payload is simply ignored by callers.
 *
 *  Money fields (subtotal/discountAmount/totalAmount/platformFee/
 *  partnerEarning/Payment.amount) are plain rupee integers, matching how
 *  ServiceDuration.price/BookingItem.price are already formatted elsewhere
 *  in this app (see formatPrice in category-services/index.tsx) — NOT paise,
 *  despite the misleading "minor units" comment on the backend's Payment
 *  model (nothing in BookingService ever multiplies/divides by 100).
 */

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "EXPIRED"
  | "CONFIRMED"
  | "BROADCASTED"
  | "ACCEPTED"
  | "NO_PARTNER_FOUND"
  | "PARTNER_EN_ROUTE"
  | "PARTNER_ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED_BY_CLIENT"
  | "CANCELLED_BY_PARTNER"
  | "CANCELLED_BY_ADMIN"
  | "PENDING_RESCHEDULE"
  | "RESCHEDULED"
  | "DISPUTED";

/** Statuses that still represent "the booking is coming up" from the
 *  client's point of view — everything else (COMPLETED, any CANCELLED_*,
 *  a resolved DISPUTED) belongs in the Past tab. */
export const UPCOMING_BOOKING_STATUSES: readonly BookingStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "BROADCASTED",
  "ACCEPTED",
  "PARTNER_EN_ROUTE",
  "PARTNER_ARRIVED",
  "IN_PROGRESS",
  "PENDING_RESCHEDULE",
  "RESCHEDULED",
];

/** Statuses where the partner has an active arrival code the client should
 *  be able to see and share. */
export const OTP_VISIBLE_STATUSES: readonly BookingStatus[] = [
  "PARTNER_EN_ROUTE",
  "PARTNER_ARRIVED",
];

export type BookingAddress = {
  id: string;
  label?: string;
  customLabel?: string | null;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
};

/** Partner summary as surfaced to the client — deliberately excludes
 *  phoneEncrypted/phoneBlindIndex, which the backend's client-facing
 *  booking routes return raw and unscrubbed today; this app never renders
 *  them. */
export type BookingPartnerSummary = {
  id: string;
  name?: string | null;
  profilePhotoKey?: string | null;
  averageRating?: number;
  totalReviews?: number;
  yearsOfExperience?: number | null;
};

export type BookingServiceItemSummary = {
  id: string;
  name?: string;
  cardTitle?: string;
  thumbnailKey?: string | null;
};

export type BookingItem = {
  id: string;
  serviceItemId: string;
  serviceItemName: string;
  durationLabel?: string | null;
  price: number;
  durationMinutes: number;
  quantity: number;
  serviceItem?: BookingServiceItemSummary;
};

export type BookingReview = {
  id: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
  tags: string[];
  partnerReply?: string | null;
  partnerRepliedAt?: string | null;
  createdAt: string;
};

export type BookingPayment = {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  paymentMethod?: string | null;
};

export type Booking = {
  id: string;
  userId: string;
  partnerId?: string | null;
  partner?: BookingPartnerSummary | null;
  addressId: string;
  address: BookingAddress;
  bookingType: "ON_DEMAND" | "SCHEDULED" | "RECURRING_INSTANCE";
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  estimatedEndTime: string;
  estimatedDurationMinutes: number;
  clientNotes?: string | null;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  platformFee: number;
  partnerEarning: number;
  arrivalOtp?: string | null;
  arrivalOtpVerifiedAt?: string | null;
  cancellationReason?: string | null;
  cancelledByRole?: "CLIENT" | "PARTNER" | "ADMIN" | null;
  disputeReason?: string | null;
  disputeRaisedAt?: string | null;
  disputeResolution?: string | null;
  disputeResolvedAt?: string | null;
  rescheduleCount: number;
  createdAt: string;
  updatedAt: string;
  items: BookingItem[];
  payment?: BookingPayment | null;
  review?: BookingReview | null;
};

export type CancelBookingBody = { reason?: string };
export type RaiseDisputeBody = { reason: string };
export type RescheduleBookingBody = { scheduledDate: string; scheduledTime: string };

export type SubmitReviewBody = {
  rating: number;
  comment?: string;
  tags?: string[];
  serviceItemId?: string;
};

export type UpdateReviewBody = {
  rating?: number;
  comment?: string;
  tags?: string[];
};
