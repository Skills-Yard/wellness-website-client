"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Star,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/context/CartContext";
import TrackStep from "./Trackstep ";
import { BookingDetails } from "@/src/utils/types/booking";


interface TrackBookingProps {
  booking: BookingDetails;
  onBack: () => void;
  onClose: () => void;
}

/** Step 3 — Track Booking */
export default function TrackBooking({
  booking,
  onBack,
  onClose,
}: TrackBookingProps) {
  const { cartItems } = useCart();

  const trackSteps = [
    { label: "Confirmed", done: true, active: false },
    { label: "On the way", done: false, active: true },
    { label: "Arriving Soon", done: false, active: false },
    { label: "Started", done: false, active: false },
    { label: "Completed", done: false, active: false },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#F3EFEB] mb-4">
        <button
          onClick={onBack}
          className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h2 className="text-[17px] font-bold text-gray-900">Booking Details</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Status Banner */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-100">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">On the way</p>
            <p className="text-[11px] text-gray-500">
              Your therapist is on the way
            </p>
          </div>
        </div>

        {/* Progress Track */}
        <div className="px-3 py-4 rounded-2xl border border-[#F0EDEA] bg-white">
          <div className="relative flex items-start justify-between">
            {/* Background line */}
            <div className="absolute top-[9px] left-[10px] right-[10px] h-0.5 bg-gray-100 z-0" />
            {/* Filled portion */}
            <div
              className="absolute top-[9px] left-[10px] h-0.5 bg-amber-400 z-0"
              style={{ width: "22%" }}
            />
            {trackSteps.map((s, i) => (
              <div key={i} className="relative z-10">
                <TrackStep label={s.label} active={s.active} done={s.done} />
              </div>
            ))}
          </div>
        </div>

        {/* Therapist Details */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Therapist Details
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-[14px] shrink-0">
                  NS
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">
                    Neha Sharma
                  </p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-700">4.9</span>
                    <span className="text-gray-300">•</span>
                    5 yrs exp
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-xl border border-[#F0EDEA] flex items-center justify-center hover:bg-amber-50 transition-colors cursor-pointer">
                  <Phone className="w-4 h-4 text-amber-500" />
                </button>
                <button className="w-9 h-9 rounded-xl border border-[#F0EDEA] flex items-center justify-center hover:bg-amber-50 transition-colors cursor-pointer">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Services Booked
            </p>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[12px] font-semibold text-gray-800 truncate">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Booking Details
            </p>
            <div className="divide-y divide-[#F3EFEB]">
              <div className="py-2.5 flex items-start justify-between gap-2">
                <span className="text-[12px] text-gray-400 shrink-0 pt-0.5">
                  Date &amp; Time
                </span>
                <span className="text-[12px] font-semibold text-gray-800 text-right">
                  {booking.dateTime}
                </span>
              </div>
              <div className="py-2.5 flex items-start justify-between gap-2">
                <span className="text-[12px] text-gray-400 shrink-0 pt-0.5">
                  Address
                </span>
                <span className="text-[12px] font-semibold text-gray-800 text-right max-w-[180px]">
                  {booking.address}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-[12px] text-gray-400">Booking ID</span>
                <span className="text-[12px] font-bold text-[#D38516] font-mono">
                  {booking.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Help note */}
        <div className="flex items-start gap-2.5 px-3 py-3 rounded-2xl bg-blue-50 border border-blue-100">
          <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-snug">
            Our representative will call you within 30 minutes to confirm your
            appointment.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-[#F3EFEB] mt-2">
        <Button
          onClick={onClose}
          className="w-full bg-[#25180F] hover:bg-[#3a2518] text-white font-bold h-12 rounded-2xl cursor-pointer shadow-lg active:scale-[0.98] transition-all border-none text-[15px]"
        >
          Done
        </Button>
      </div>
    </div>
  );
}