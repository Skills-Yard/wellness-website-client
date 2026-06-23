import React, { useState } from "react";
import Image from "next/image";
import { categories, services } from "@/utils/data/detailPage";
import SubDetailPopUp from "./subdetail/mainfile";
import Link from "next/link";

export default function SpaBookingLayout() {
    const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto max-w-[1300px] px-4 py-8">
      {/* 3-Column Grid Layout */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* ========================================== */}
        {/* LEFT COLUMN: Absolute/Sticky Sidebar */}
        {/* ========================================== */}
        <div className="w-full shrink-0 lg:sticky lg:top-8 lg:w-[280px]">
          {/* Header Title */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Spa Prime</h1>
              <p className="mt-1 flex items-center text-sm text-slate-600">
                <span className="mr-1 text-black">★</span> 4.82 (3.7 M bookings)
              </p>
            </div>
          </div>

          {/* Categories Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-medium text-slate-500 relative">
              <span className="bg-white pr-2 relative z-10">
                Select a service
              </span>
              <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-0" />
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="flex cursor-pointer flex-col items-center gap-2 text-center group"
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 transition-transform group-hover:scale-105">
                    {/* Placeholder div for category image */}
                    <Image
                      src="/images/detail/section4.png"
                      alt="Category name" // Always use descriptive alt text instead of just "image"
                      fill
                      sizes="56px" // Optional but highly recommended for performance (h-14 = 56px)
                      className="bg-slate-200 object-fit"
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
          {/* We group services by category to render them in sections */}
          {categories.map((category) => {
            const categoryServices = services.filter(
              (s) => s.category === category.name,
            );
            if (categoryServices.length === 0) return null;

            return (
              <div key={category.id} id={category.id} className="space-y-6 scroll-mt-36">
                <h2 className="text-3xl font-bold text-slate-900">
                  {category.name}
                </h2>

                <div className="space-y-8">
                  {categoryServices.map((service, index) => (
                    <div key={service.id} onClick={() => setOpen(true)} className=" cursor-pointer ">


                      {/* === SPOTLIGHT LAYOUT (Video on top) === */}
                      {service.isSpotlight ? (
                        <div className="flex flex-col">
                          {/* Large Media/Video Placeholder */}
                          <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-400 shadow-sm">
                            <div className="absolute inset-0 flex items-center justify-center">
                              {/* Play Button Icon */}
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                                ▶
                              </div>
                            </div>
                          </div>

                          {/* Content below Video */}
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
                            <button className="rounded-lg border border-indigo-200 bg-white px-8 py-2 font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50">
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
                        /* === STANDARD LAYOUT (Image right, Button half overlapping) === */
                        <div className="flex justify-between gap-6">
                          {/* Details (Left Side) */}
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
                                <span className="text-slate-400 line-through mr-1">
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

                          {/* Image & Overlapping Add Button (Right Side) */}
                          <div className="relative mt-2 h-[130px] w-[130px] shrink-0">
                            <div className="h-full w-full overflow-hidden rounded-2xl bg-slate-200">
                              <Image
                                src="/images/detail/detailPage.png"
                                alt="Category name" // Always use descriptive alt text instead of just "image"
                                fill
                                sizes="56px" // Optional but highly recommended for performance (h-14 = 56px)
                                className="bg-slate-200 object-fit"
                              />
                            </div>

                            {/* Absolute Button Half on Image */}
                            <button className="absolute -bottom-4 left-1/2 flex w-10/12 -translate-x-1/2 items-center justify-center rounded-lg border border-indigo-200 bg-white py-2 text-sm font-semibold text-indigo-600 shadow-md transition-colors hover:bg-indigo-50">
                              Add
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Divider */}
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
          {/* Cart Box */}
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl text-slate-300">🛒</div>
            <p className="text-sm text-slate-500">No items in your cart</p>
          </div>

          {/* UC Promise Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">UC Promise</h3>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-800">
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
    </div>
  );
}
