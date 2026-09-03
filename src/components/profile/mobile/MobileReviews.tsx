"use client";

import { Droplets, Handshake, Home, Star } from "lucide-react";
import { useBookings } from "@/src/hooks/queries/useBookings";
import { MobileScreenHeader } from "./shared";

const GOAL = 3;

const TIPS = [
  {
    icon: Droplets,
    title: "Empathize",
    body: "Show you care by offering water. It will help raise their spirit.",
  },
  {
    icon: Home,
    title: "Support",
    body: "Provide access to the washroom (if required).",
  },
  {
    icon: Handshake,
    title: "Respect",
    body: "Treat professionals the way you'd expect to be treated.",
  },
];

/** There's no customer-rating system on the backend yet — professionals
 *  don't rate clients anywhere in this app today. This screen shows the
 *  real, honest state ("no reviews yet") with a genuine progress count off
 *  the user's actual completed bookings, rather than faking a rating. */
export default function MobileReviews({ onBack }: { onBack: () => void }) {
  const { data: bookings } = useBookings();
  const completed = Math.min(
    (bookings ?? []).filter((b) => b.status === "COMPLETED").length,
    GOAL,
  );

  return (
    <div>
      <MobileScreenHeader title="My Reviews" onBack={onBack} />

      <div className="flex flex-col items-center gap-2 rounded-lg px-6 py-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FBF7ED] text-amber-600">
          <Star className="h-7 w-7" />
        </span>
        <p className="text-sm font-medium text-espresso">No reviews yet</p>
        <p className="text-[11px] text-[#666]">Complete 3 bookings to unlock your Eezit rating</p>
      </div>

      <div className="mt-2 rounded-lg border border-black/8 bg-[#FAF5F0] px-4 py-4.5">
        <p className="text-sm font-medium text-espresso">Rating Progress</p>
        <p className="text-[11px] text-[#666]">Complete 3 bookings to get rated</p>

        <div className="relative mt-6 flex items-center justify-between px-1">
          <div className="absolute top-1/2 right-4 left-4 h-px -translate-y-1/2 bg-black/8" />
          {Array.from({ length: GOAL }, (_, i) => i + 1).map((step) => {
            const done = step <= completed;
            return (
              <div key={step} className="relative flex flex-col items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-medium ${
                    done
                      ? "border-espresso bg-espresso text-white"
                      : "border-black/8 bg-white text-espresso"
                  }`}
                >
                  {step}
                </span>
                <span className={`text-[11px] font-medium ${done ? "text-espresso" : "text-[#666]"}`}>
                  Booking {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="mt-6 mb-3 text-sm font-medium text-espresso">How to be a 5-Star Customer</h2>
      <div className="space-y-3">
        {TIPS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-center gap-3 rounded-lg border border-black/8 p-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FBF7ED] text-amber-600">
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-espresso">{title}</p>
              <p className="mt-1 text-[11px] text-[#666]">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-lg border border-black/8 bg-[#FAF5F0] px-4 py-4.5 text-xs">
        <span className="font-medium text-amber-600">How is customer rating calculated?</span>
        <span className="mt-2 block text-[#666]">
          Your aggregate rating is a simple average of all the ratings you&apos;ve received from
          our professionals. Ratings are anonymous and visible after 3 completed bookings.
        </span>
      </p>
    </div>
  );
}
