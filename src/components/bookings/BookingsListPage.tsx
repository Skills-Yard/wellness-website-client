"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  CalendarOff,
  ChevronRight,
  ClipboardList,
  Clock,
  History,
  MapPin,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { bookingApi } from "@/src/services/bookingApi";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";
import { LoadMoreButton } from "@/src/components/ui/load-more-button";
import type { Booking } from "@/src/types/booking";
import {
  formatBookingDateLong,
  formatBookingTime,
  getStatusMeta,
  isRescheduleStatus,
  resolveImageSrc,
} from "./bookingStatus";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import BottomNav from "@/src/components/home/mobile/Bottomnav";
import LazyAuthModal from "@/src/components/auth/LazyAuthModal";
import { Skeleton } from "@/src/components/ui/skeleton";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const bookingTitle = (booking: Booking) =>
  booking.items.length === 1
    ? booking.items[0].serviceItemName
    : `${booking.items[0]?.serviceItemName ?? "Service"} + ${booking.items.length - 1} more`;

const bookingLocality = (booking: Booking) =>
  [booking.address.customLabel, booking.address.line1, booking.address.city]
    .filter(Boolean)
    .join(", ");

function BookingCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-lg border border-black/8 bg-white p-3">
      <Skeleton className="h-20 w-24 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
        <Skeleton className="mt-3 h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-1.5 text-[#904720]">
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}

function BookingThumb({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className: string;
}) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-stone-100 ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-stone-300">
          <ClipboardList className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

/** The prominent card at the top — the soonest upcoming booking. */
function ActiveBookingCard({
  booking,
  onOpen,
  onReschedule,
}: {
  booking: Booking;
  onOpen: () => void;
  onReschedule: () => void;
}) {
  const status = getStatusMeta(booking.status);
  const thumbnail = resolveImageSrc(booking.items[0]?.serviceItem?.thumbnailKey);
  const title = bookingTitle(booking);
  const canReschedule =
    isRescheduleStatus(booking.status) && booking.bookingType !== "ON_DEMAND";

  return (
    <div>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full gap-3 rounded-xl border border-black/8 bg-white p-3 text-left"
      >
        <BookingThumb src={thumbnail} alt={title} className="h-[152px] w-[120px]" />

        <div className="flex min-w-0 flex-1 flex-col gap-3 py-0.5">
          <p className="line-clamp-2 text-base font-medium text-slate-900">{title}</p>

          <div className="flex items-center gap-1.5 text-xs text-[#25180F]">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-[#904720]" />
            <span className="truncate">{formatBookingDateLong(booking.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#25180F]">
            <Clock className="h-3.5 w-3.5 shrink-0 text-[#904720]" />
            <span className="truncate">
              {formatBookingTime(booking.scheduledTime)} -{" "}
              {formatBookingTime(booking.estimatedEndTime)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#25180F]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#904720]" />
            <span className="truncate">{bookingLocality(booking)}</span>
          </div>

          <span className={`w-fit rounded-lg px-3 py-1 text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        </div>
      </button>

      <div className="mt-3 flex gap-3">
        {canReschedule && (
          <button
            type="button"
            onClick={onReschedule}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-black/8 bg-[#F9EEE3] py-3.5 text-sm font-medium text-[#25180F] cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Reschedule
          </button>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#25180F] py-3.5 text-sm font-medium text-white cursor-pointer"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function NoActiveBooking({ onBook }: { onBook: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-black/8 bg-white px-4 py-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F9EEE3] text-[#904720]">
        <CalendarOff className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <p className="text-[15px] font-medium text-slate-900">No Active Bookings</p>
      <p className="text-xs text-slate-500">You don&apos;t have any upcoming appointments.</p>
      <button
        type="button"
        onClick={onBook}
        className="mt-1 flex items-center gap-1 rounded-lg bg-[#25180F] px-6 py-3.5 text-sm font-medium text-white cursor-pointer"
      >
        Book a Service
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Compact row used for booking history and any extra upcoming bookings. */
function CompactBookingCard({ booking, onOpen }: { booking: Booking; onOpen: () => void }) {
  const status = getStatusMeta(booking.status);
  const thumbnail = resolveImageSrc(booking.items[0]?.serviceItem?.thumbnailKey);
  const title = bookingTitle(booking);

  return (
    <div className="flex items-stretch gap-3">
      <BookingThumb src={thumbnail} alt={title} className="h-[83px] w-[120px]" />

      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 flex-col items-start gap-2 py-0.5 text-left"
      >
        <p className="line-clamp-1 text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">
          {formatBookingDateLong(booking.scheduledDate)} -{" "}
          {formatBookingTime(booking.scheduledTime)}
        </p>
        <span className={`rounded-lg px-3 py-1 text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </button>

      <button
        type="button"
        onClick={onOpen}
        aria-label="View booking"
        className="flex w-9 shrink-0 items-center justify-center rounded-lg bg-[#F9EEE3] text-[#25180F] cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function BookingsListPage() {
  const router = useRouter();
  const { isMounted, isLoggedIn, showAuthModal, setShowAuthModal, handleAuthComplete } =
    useRequireAuth();

  // Two independent scoped fetches now that the tab switcher is gone: the
  // soonest UPCOMING booking is featured at the top, PAST fills the history
  // list. `scope` still maps straight to the backend's status-group filter
  // (see BOOKING_SCOPE_STATUSES) so each list's paging stays exact.
  const upcoming = usePaginatedList<Booking>(
    ["bookings", "UPCOMING"],
    (page, limit) => {
      const accessToken = getAccessToken();
      if (!accessToken) return Promise.resolve({ data: [] });
      return bookingApi.findAllPage(accessToken, page, limit, { scope: "UPCOMING" });
    },
    { limit: 20, enabled: isLoggedIn },
  );

  const past = usePaginatedList<Booking>(
    ["bookings", "PAST"],
    (page, limit) => {
      const accessToken = getAccessToken();
      if (!accessToken) return Promise.resolve({ data: [] });
      return bookingApi.findAllPage(accessToken, page, limit, { scope: "PAST" });
    },
    { limit: 20, enabled: isLoggedIn },
  );

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <ClipboardList className="mb-4 h-10 w-10 text-stone-300" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-bold text-slate-900">Log in to see your bookings</h2>
        <p className="mb-6 max-w-xs text-sm text-slate-500">
          Your upcoming and past appointments will show up here once you&apos;re logged in.
        </p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="rounded-2xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-amber-500/90"
        >
          Log in
        </button>
        {showAuthModal && (
          <LazyAuthModal
            onClose={() => setShowAuthModal(false)}
            onComplete={handleAuthComplete}
            redirectToProfile={false}
          />
        )}
      </div>
    );
  }

  const [activeBooking, ...otherUpcoming] = upcoming.items;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-10">
      <div className="mx-auto max-w-2xl bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="rounded-full p-1.5 hover:bg-slate-100 cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bookings</h1>
        </div>

        <section className="mb-8">
          <SectionLabel icon={Calendar}>Active Booking</SectionLabel>

          {upcoming.isLoading ? (
            <BookingCardSkeleton />
          ) : activeBooking ? (
            <ActiveBookingCard
              booking={activeBooking}
              onOpen={() => router.push(`/bookings/${activeBooking.id}`)}
              onReschedule={() =>
                router.push(`/bookings/${activeBooking.id}?action=reschedule`)
              }
            />
          ) : (
            <NoActiveBooking onBook={() => router.push("/")} />
          )}

          {otherUpcoming.length > 0 && (
            <div className="mt-4 space-y-4">
              {otherUpcoming.map((booking) => (
                <CompactBookingCard
                  key={booking.id}
                  booking={booking}
                  onOpen={() => router.push(`/bookings/${booking.id}`)}
                />
              ))}
              {upcoming.hasMore && (
                <LoadMoreButton
                  onClick={upcoming.loadMore}
                  loading={upcoming.isFetchingNextPage}
                />
              )}
            </div>
          )}
        </section>

        <section>
          <SectionLabel icon={History}>Booking History</SectionLabel>

          {past.isLoading ? (
            <div className="space-y-4">
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </div>
          ) : past.items.length === 0 ? (
            <div className="rounded-lg border border-black/8 bg-white px-4 py-10 text-center text-sm text-slate-500">
              No past bookings yet.
            </div>
          ) : (
            <div className="space-y-4">
              {past.items.map((booking) => (
                <CompactBookingCard
                  key={booking.id}
                  booking={booking}
                  onOpen={() => router.push(`/bookings/${booking.id}`)}
                />
              ))}
            </div>
          )}

          {past.hasMore && (
            <div className="mt-4">
              <LoadMoreButton onClick={past.loadMore} loading={past.isFetchingNextPage} />
            </div>
          )}
        </section>
      </div>

      <div className="block md:hidden">
        <BottomNav activeTab="bookings" onHomeClick={() => router.push("/")} />
      </div>
    </div>
  );
}
