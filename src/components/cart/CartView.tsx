"use client";

import Image from "next/image";
import {
  ShoppingCart,
  X,
  MapPin,
  Calendar,
  ChevronRight,
  Ticket,
  Clock,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/context/CartContext";

interface CartViewProps {
  onContinue: () => void;
}

/** Step 1 — Cart view */
export default function CartView({ onContinue }: CartViewProps) {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    location,
  } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F3EFEB] mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-gray-900 leading-tight">
              My Cart
            </h2>
            <p className="text-xs text-gray-400">
              {cartCount} {cartCount === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>

        {/* Clear all button */}
        <button
          onClick={clearCart}
          title="Clear all items"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all cursor-pointer border border-red-100 hover:border-red-200"
        >
          <Trash2 className="w-3 h-3" />
          Clear all
        </button>
      </div>

      {/* Items + address + date + coupon */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAFAFA] border border-[#F0EDEA]"
          >
            <div className="relative w-[64px] h-[64px] rounded-xl overflow-hidden shrink-0 bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <h4 className="text-[13px] font-bold text-gray-900 leading-snug truncate max-w-[150px]">
                  {item.title}
                </h4>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.duration} • At home
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[13px] font-extrabold text-[#D38516]">
                  ₹{item.price.toLocaleString("en-IN")}
                </span>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-md px-1 py-0.5">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                    className="w-5 h-5 flex items-center justify-center rounded bg-white text-gray-600 shadow-sm hover:bg-gray-50 active:scale-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] font-bold text-gray-800 w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="w-5 h-5 flex items-center justify-center rounded bg-white text-gray-600 shadow-sm hover:bg-gray-50 active:scale-90 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Address */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Address
                </p>
                <p className="text-[12px] font-semibold text-gray-800 leading-snug">
                  {location || "Home"}
                </p>
              </div>
            </div>
            <button className="text-[12px] font-semibold text-amber-600 flex items-center gap-0.5 hover:opacity-75 transition-opacity cursor-pointer">
              Change <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Date & Time */}
        <div className="rounded-2xl border border-[#F0EDEA] overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Date &amp; Time
                </p>
                <p className="text-[12px] font-semibold text-gray-800">
                  Tomorrow
                </p>
                <p className="text-[11px] text-gray-400">
                  11:00 AM — 12:00 PM
                </p>
              </div>
            </div>
            <button className="text-[12px] font-semibold text-amber-600 flex items-center gap-0.5 hover:opacity-75 transition-opacity cursor-pointer">
              Change <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Coupon */}
        <button className="w-full rounded-2xl border border-dashed border-[#E8CCBE] px-4 py-3 flex items-center justify-between hover:bg-amber-50/40 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-4 h-4 text-amber-500" />
            <span className="text-[13px] font-semibold text-gray-700">
              Apply Coupon
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-[#F3EFEB] mt-2 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-gray-500 font-medium">
            Total ({cartCount} {cartCount === 1 ? "Item" : "Items"})
          </span>
          <span className="text-[20px] font-extrabold text-gray-900">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        <Button
          onClick={onContinue}
          className="w-full bg-[#25180F] hover:bg-[#3a2518] text-white font-bold h-12 rounded-2xl cursor-pointer shadow-lg active:scale-[0.98] transition-all border-none text-[15px]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}