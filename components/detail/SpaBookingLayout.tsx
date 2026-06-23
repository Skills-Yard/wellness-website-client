import React, { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { DYNAMIC_DETAILS } from "@/utils/data/detailPage";
import { useCart } from "@/context/CartContext";
import SubDetailPopUp from "./subdetail/mainfile";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SpaBookingLayout() {
  const [open, setOpen] = useState(false);
  const [selectedSubService, setSelectedSubService] = useState<any>(null);
  
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "massage";
  
  const { addToCart } = useCart();

  const normalizedType = typeParam === "physiotherapy" || typeParam === "physio" ? "physio" : typeParam;
  const detailData = DYNAMIC_DETAILS[normalizedType] || DYNAMIC_DETAILS["massage"];

  const activeCategories = detailData.categories;
  const activeServices = detailData.services;

  const handleOpenDetail = (service: any) => {
    setSelectedSubService(service);
    setOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* ========================================== */}
        {/* LEFT COLUMN: Absolute/Sticky Sidebar */}
        {/* ========================================== */}
        <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[280px]">
          {/* Header Title */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                {detailData.title}
              </h1>
              <p className="mt-1.5 flex items-center text-sm text-slate-600">
                <span className="mr-1.5 text-yellow-500 text-base">★</span>{" "}
                <span className="font-semibold text-slate-900 mr-1">
                  {detailData.rating}
                </span>{" "}
                ({detailData.reviews})
              </p>
            </div>
          </div>

          {/* Categories Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider relative">
              <span className="bg-white pr-2 relative z-10">Select Section</span>
              <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-0" />
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {activeCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="flex cursor-pointer flex-col items-center gap-2 text-center group"
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 transition-transform group-hover:scale-105">
                    <Image
                      src={detailData.media}
                      alt={cat.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-medium leading-tight text-slate-700 break-words max-w-[70px]">
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
          {activeCategories.map((category) => {
            const categoryServices = activeServices.filter(
              (s) => s.category === category.name,
            );
            if (categoryServices.length === 0) return null;

            return (
              <div
                key={category.id}
                id={category.id}
                className="space-y-6 scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                  {category.name}
                </h2>

                <div className="space-y-8">
                  {categoryServices.map((service, index) => {
                    const hasDiscount = !!(service.originalPrice && service.originalPrice !== service.price);
                    
                    return (
                      <div
                        key={service.id}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenDetail(service);
                        }}
                        className="cursor-pointer transition-opacity active:opacity-90 block"
                      >
                        {/* === SPOTLIGHT LAYOUT === */}
                        {service.isSpotlight ? (
                          <div className="flex flex-col group/item">
                            {/* Large Media Image */}
                            <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-xs">
                              <Image
                                src={service.media}
                                alt={service.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                              />
                              <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-amber-600 shadow-md backdrop-blur-xs text-sm font-bold animate-pulse">
                                  INFO
                                </div>
                              </div>
                            </div>

                            {/* Content below Media */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                {service.tag && (
                                  <span className="mb-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                                    {service.tag}
                                  </span>
                                )}
                                <h3 className="text-xl font-bold text-slate-900 group-hover/item:text-amber-500 transition-colors">
                                  {service.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
                                  <span className="text-yellow-500 font-bold">
                                    ★ {service.rating}
                                  </span>{" "}
                                  • <span>{service.reviews}</span>
                                </p>
                                <p className="mt-2 text-sm text-slate-800 font-medium">
                                  Starts at{" "}
                                  <span className="font-extrabold text-amber-600 text-base">
                                    {service.price}
                                  </span>{" "}
                                  {hasDiscount && (
                                    <span className="text-slate-400 line-through text-xs ml-1 font-normal">
                                      {service.originalPrice}
                                    </span>
                                  )}
                                  {" "}• {service.duration}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart({
                                    id: service.id,
                                    title: service.title,
                                    price: parseInt(service.price.replace(/[^\d]/g, "")),
                                    image: service.media,
                                    duration: service.duration,
                                  });
                                }}
                                className="rounded-xl border border-amber-200 bg-amber-50 px-8 py-2.5 font-bold text-xs text-amber-600 shadow-xs transition-all hover:bg-amber-100 cursor-pointer active:scale-95 shrink-0"
                              >
                                ADD
                              </button>
                            </div>

                            <ul className="mt-4 list-inside list-disc space-y-1.5 text-xs text-slate-500">
                              {service.features.map((feat, i) => (
                                <li key={i}>{feat}</li>
                              ))}
                            </ul>
                            <button className="mt-4 self-start text-xs font-bold text-amber-600 hover:text-amber-700">
                              View details
                            </button>
                          </div>
                        ) : (
                          /* === STANDARD LAYOUT === */
                          <div className="flex justify-between gap-6 group/item">
                            {/* Details (Left Side) */}
                            <div className="flex-1">
                              {service.tag && (
                                <span className="mb-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                                  {service.tag}
                                </span>
                              )}
                              <h3 className="text-xl font-bold text-slate-900 group-hover/item:text-amber-500 transition-colors">
                                {service.title}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
                                <span className="text-yellow-500 font-bold">
                                  ★ {service.rating}
                                </span>{" "}
                                • <span>{service.reviews}</span>
                              </p>
                              <p className="mt-2 text-sm text-slate-800 font-medium">
                                Starts at{" "}
                                <span className="font-extrabold text-amber-600 text-base">
                                  {service.price}
                                </span>{" "}
                                {hasDiscount && (
                                  <span className="text-slate-400 line-through text-xs ml-1 font-normal">
                                    {service.originalPrice}
                                  </span>
                                )}
                                {" "}• {service.duration}
                              </p>
                              <ul className="mt-4 list-inside list-disc space-y-1.5 text-xs text-slate-500">
                                {service.features.map((feat, i) => (
                                  <li key={i}>{feat}</li>
                                ))}
                              </ul>
                              <button className="mt-4 text-xs font-bold text-amber-600 hover:text-amber-700">
                                View details
                              </button>
                            </div>

                            {/* Image & Overlapping Add Button (Right Side) */}
                            <div className="relative mt-2 h-[130px] w-[130px] shrink-0">
                              <div className="h-full w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                                <Image
                                  src={service.media}
                                  alt={service.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              {/* Absolute Button Half on Image */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart({
                                    id: service.id,
                                    title: service.title,
                                    price: parseInt(service.price.replace(/[^\d]/g, "")),
                                    image: service.media,
                                    duration: service.duration,
                                  });
                                }}
                                className="absolute -bottom-4 left-1/2 flex w-10/12 -translate-x-1/2 items-center justify-center rounded-xl border border-amber-200 bg-white py-2 text-xs font-bold text-amber-600 shadow-md transition-all hover:bg-amber-50 cursor-pointer active:scale-95"
                              >
                                ADD
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Divider */}
                        {index !== categoryServices.length - 1 && (
                          <div className="my-8 h-px w-full bg-slate-100" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: Fixed Cart & Promise Box */}
        {/* ========================================== */}
        <div className="hidden w-full shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:flex lg:w-[320px]">
          {/* promise box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Velora Promise</h3>
              <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-[10px] font-extrabold text-amber-600">
                100%
              </div>
            </div>
            <ul className="space-y-3 text-xs font-medium text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-amber-500 font-extrabold">✓</span> 4.8+ Rated Certified Therapists
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500 font-extrabold">✓</span> Complete Relaxation Assured
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500 font-extrabold">✓</span> Natural & Skin-Safe Organic Products
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500 font-extrabold">✓</span> Single-Use Disposables for Hygiene
              </li>
            </ul>
          </div>
        </div>
      </div>

      {open && selectedSubService && (
        <SubDetailPopUp
          service={selectedSubService}
          steps={detailData.steps}
          onClose={() => {
            setOpen(false);
            setSelectedSubService(null);
          }}
        />
      )}
    </div>
  );
}
