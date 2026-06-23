"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories, services } from "@/utils/data/detailPage"; // Adjust path as needed
import SubDetailPopUp from "./subdetail/mainfile";
import FloatingCart from "../FloatingCart";

// Helper function to convert price strings like "₹1,319" to numbers (1319)
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
};

export default function SpaBookingLayout() {
  const [open, setOpen] = useState<boolean>(false);

  // Explicitly type the state as an array of strings
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);

  // Type the event properly to access stopPropagation without TS errors
  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    serviceId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation(); // Stops the modal from opening!

    setCartItemIds((prev) => [...prev, serviceId]);
  };

  // Calculate cart total
  const cartTotal = cartItemIds.reduce((total, id) => {
    const service = services.find((s) => s.id === id);
    return total + (service ? parsePrice(service.price) : 0);
  }, 0);

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-8 pb-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* ========================================== */}
        {/* LEFT COLUMN: Absolute/Sticky Sidebar */}
        {/* ========================================== */}
        <div className="w-full shrink-0 lg:sticky lg:top-8 lg:w-[280px]">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Spa Prime</h1>
              <p className="mt-1 flex items-center text-sm text-slate-600">
                <span className="mr-1 text-black">★</span> 4.82 (3.7 M bookings)
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 relative text-sm font-medium text-slate-500">
              <span className="relative z-10 bg-white pr-2">
                Select a service
              </span>
              <div className="absolute left-0 top-1/2 -z-0 h-px w-full bg-slate-200" />
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="group flex cursor-pointer flex-col items-center gap-2 text-center"
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 transition-transform group-hover:scale-105">
                    <Image
                      src={cat.image || "/images/detail/section4.png"}
                      alt={cat.name}
                      fill
                      sizes="56px"
                      className="bg-slate-200 object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-medium leading-tight text-slate-700">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* CENTER COLUMN: Scrollable Content */}
        {/* ========================================== */}
        <div className="flex-1 space-y-12">
          {categories.map((category) => {
            const categoryServices = services.filter(
              (s) => s.category === category.name,
            );
            if (categoryServices.length === 0) return null;

            return (
              <div
                key={category.id}
                id={category.id}
                className="scroll-mt-36 space-y-6"
              >
                <h2 className="text-3xl font-bold text-slate-900">
                  {category.name}
                </h2>

                <div className="space-y-8">
                  {categoryServices.map((service, index) => (
                    <div
                      key={service.id}
                      // Explicitly typing the div click event
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(true);
                      }}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer transition-opacity active:opacity-70"
                    >
                      {service.isSpotlight ? (
                        <div className="flex flex-col">
                          <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-400 shadow-sm">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                                ▶
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start justify-between">
                            <div className="flex flex-col">
                              {service.tag && (
                                <span className="mb-1 text-xs font-bold tracking-wide text-green-700">
                                  🟩 {service.tag}
                                </span>
                              )}
                              <h3 className="text-xl font-bold text-slate-900">
                                {service.title}
                              </h3>
                              <p className="mt-1 text-sm text-slate-600">
                                <span className="text-indigo-600">
                                  ★ {service.rating}
                                </span>{" "}
                                ({service.reviews})
                              </p>
                              <p className="mt-2 text-sm text-slate-800">
                                Starts at{" "}
                                <span className="font-semibold">
                                  {service.price}
                                </span>{" "}
                                • {service.duration}
                              </p>
                            </div>

                            <button
                              onClick={(e) => handleAddToCart(e, service.id)}
                              className="rounded-lg border border-indigo-200 bg-white px-8 py-2 font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 active:scale-95"
                            >
                              Add
                            </button>
                          </div>

                          <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-600">
                            {service.features.map((feat, i) => (
                              <li key={i}>{feat}</li>
                            ))}
                          </ul>
                          <button className="mt-4 self-start text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                            View details
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between gap-6">
                          <div className="flex-1">
                            {service.tag && (
                              <span className="mb-1 block text-xs font-bold tracking-wide text-green-700">
                                🟩 {service.tag}
                              </span>
                            )}
                            <h3 className="text-xl font-bold text-slate-900">
                              {service.title}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                              <span className="text-indigo-600">
                                ★ {service.rating}
                              </span>{" "}
                              ({service.reviews})
                            </p>
                            <p className="mt-2 text-sm text-slate-800">
                              Starts at{" "}
                              <span className="font-semibold">
                                {service.price}
                              </span>{" "}
                              {service.originalPrice && (
                                <span className="mr-1 text-slate-400 line-through">
                                  {service.originalPrice}
                                </span>
                              )}
                              • {service.duration}
                            </p>
                            <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-600">
                              {service.features.map((feat, i) => (
                                <li key={i}>{feat}</li>
                              ))}
                            </ul>
                            <button className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                              View details
                            </button>
                          </div>

                          <div className="relative mt-2 h-[130px] w-[130px] shrink-0">
                            <div className="h-full w-full overflow-hidden rounded-2xl bg-slate-200">
                              <Image
                                src={
                                  service.media ||
                                  "/images/detail/detailPage.png"
                                }
                                alt={service.title}
                                fill
                                sizes="130px"
                                className="bg-slate-200 object-cover"
                              />
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(e, service.id)}
                              className="absolute -bottom-4 left-1/2 flex w-10/12 -translate-x-1/2 items-center justify-center rounded-lg border border-indigo-200 bg-white py-2 text-sm font-semibold text-indigo-600 shadow-md transition-colors hover:bg-indigo-50 active:scale-95"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}

                      {index !== categoryServices.length - 1 && (
                        <div className="my-8 h-px w-full bg-slate-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: Fixed Cart & Promise Box */}
        {/* ========================================== */}
        <div className="hidden w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:flex lg:w-[320px]">
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl text-slate-300">🛒</div>
            <p className="text-sm text-slate-500">No items in your cart</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">UC Promise</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">
                QA
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="text-black">✓</span> 4.5+ Rated Therapists
              </li>
              <li className="flex items-center gap-2">
                <span className="text-black">✓</span> Relaxation Assured
              </li>
              <li className="flex items-center gap-2">
                <span className="text-black">✓</span> Specialized Premium Oils
              </li>
            </ul>
          </div>
        </div>
      </div>

      {open && <SubDetailPopUp onClose={() => setOpen(false)} />}

      <FloatingCart
        cartCount={cartItemIds.length}
        cartTotal={cartTotal}
        onViewCart={() => alert("Navigate to cart page!")}
      />
    </div>
  );
}
