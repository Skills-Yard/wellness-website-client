"use client";

import {
  ServiceAddOn,
  ServiceDuration,
  ServicePackage,
} from "@/src/types/serviceDetailTypes";
import { DynamicService } from "@/src/utils/types/spabooking";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import StepsSection from "../StepSection/SectionSteps";
import { useCart } from "@/src/context/CartContext";
import {
  getAddOnsTotal,
  getDurationPricing,
  getPackPricing,
} from "@/src/utils/pricing";

type ServiceDetails = {
  durations: ServiceDuration[];
  packages: ServicePackage[];
  addOns: ServiceAddOn[];
};

// Sort key for "low to high" duration ordering. durationMinutes is the
// clean source when the admin panel sets it; otherwise fall back to
// whatever number is embedded in the label text (e.g. "60 mins" → 60), and
// finally to price as a last resort — longer sessions are reliably pricier
// even when neither of the above is populated.
const getDurationMinutes = (duration: ServiceDuration): number => {
  if (typeof duration.durationMinutes === "number") {
    return duration.durationMinutes;
  }
  const text = String(duration.duration ?? duration.label ?? duration.title ?? "");
  const parsed = parseInt(text.replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(parsed) ? Number(duration.price ?? 0) : parsed;
};

interface RequirementSelectorProps {
  service: DynamicService;
  serviceDetails: ServiceDetails;
  onSelectionChange?: (data: any) => void;
  onAddedToCart?: () => void;
}

export default function RequirementSelector({
  service,
  serviceDetails,
  onSelectionChange,
  onAddedToCart,
}: RequirementSelectorProps) {
  const { addToCart } = useCart();
  const { addOns } = serviceDetails;
  // Low to high — duration by length, packs by session count. Sorted here
  // (not trusted from the API order) so default selection (durations[0]/
  // packages[0] below) and every render downstream see the same order.
  const durations = useMemo(
    () =>
      [...serviceDetails.durations].sort(
        (a, b) => getDurationMinutes(a) - getDurationMinutes(b),
      ),
    [serviceDetails.durations],
  );
  const packages = useMemo(
    () =>
      [...serviceDetails.packages].sort(
        (a, b) => Number(a.sessions ?? 0) - Number(b.sessions ?? 0),
      ),
    [serviceDetails.packages],
  );
  // State for selections based on the image's layout
  const [selectedDurationId, setSelectedDurationId] = useState<string | null>(
    durations[0]?.id ?? null,
  );
  // Guards against a rapid double click/tap firing addToCart (and its
  // PATCH /cart sync) twice in quick succession — addToCart itself is
  // fire-and-forget (CartContext doesn't expose completion), so this just
  // latches on first click rather than trying to track when the request
  // actually finishes; the popup closes shortly after anyway (onAddedToCart).
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    packages[0]?.id ?? null,
  );

  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Since the scrollbar itself is hidden on the duration row, this is the
  // only signal that there's more to scroll to — an edge fade (rendered
  // below) that shows on whichever side still has hidden content and
  // disappears once you've scrolled that direction as far as it goes.
  const durationScrollRef = useRef<HTMLDivElement | null>(null);
  const [durationScrollEdges, setDurationScrollEdges] = useState({
    atStart: true,
    atEnd: true,
  });

  useEffect(() => {
    const el = durationScrollRef.current;
    if (!el) return;

    const updateEdges = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setDurationScrollEdges({
        atStart: scrollLeft <= 1,
        // -1 for rounding — sub-pixel widths can leave scrollLeft a hair
        // short of the true max, which would otherwise never read as "end".
        atEnd: scrollLeft + clientWidth >= scrollWidth - 1,
      });
    };

    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [durations.length]);

  // Real content from the service item — see ServiceItem in serviceItemTypes.ts
  // for where each of these comes from and what the admin panel actually edits.
  const features = service.features ?? [];
  const overviewText = service.overview?.text;
  const overviewGallery = service.overview?.gallery ?? [];
  const procedureSteps = (service.procedureSteps ?? []).map((step, index) => ({
    id: step.id ?? String(index),
    title: step.title,
    description: step.subtitle ?? "",
    image: step.image,
  }));
  const disclaimerItems = service.disclaimer ?? [];
  const itemsUsed = service.itemsUsed ?? [];
  const skilledPros = service.skilledPros ?? [];
  const prePostCare = service.prePostCare ?? [];
  const whatsIncluded = service.whatsIncluded ?? [];
  const faqs = (service.faqs ?? [])
    .map((faq) => ({ question: faq.question ?? faq.q, answer: faq.answer ?? faq.a }))
    .filter((faq): faq is { question: string; answer: string } => !!faq.question && !!faq.answer);
  const trustedLoved = service.trustedLoved ?? [];
  const customReviews = service.customReviews ?? [];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Calculate Total Dynamic Price (Selected Pack + Selected Addons)
  const selectedDuration = durations.find(
    (duration) => duration.id === selectedDurationId,
  );
  // displayPrice, not the flat price field — if the duration itself is
  // discounted, that's what a single session actually costs today, so
  // that's what pack totals below should be built from.
  const durationPrice = selectedDuration
    ? getDurationPricing(selectedDuration).displayPrice
    : 0;

  const selectedPackage = packages.find(
    (pack) => pack.id === selectedPackageId,
  );
  // Same formula the pack cards render with (see getPackPricing) — keeps
  // what's charged in sync with what's shown, instead of pulling a
  // possibly-stale price straight off the package record.
  const packagePrice = selectedPackage
    ? getPackPricing(selectedPackage, durationPrice).discountedTotal
    : 0;

  const addonsPrice = getAddOnsTotal(addOns, selectedAddonIds);

  // Rounded once here — packagePrice can be fractional (e.g. a 10% cut off
  // an odd-numbered total), and this is the number charged/displayed.
  const totalPrice = Math.round(packagePrice + addonsPrice);

  const handleAddToCart = () => {
    if (!selectedDurationId || !selectedPackageId || isAddingToCart) return;
    setIsAddingToCart(true);

    addToCart({
      id: `${service.id}-${selectedDurationId}-${selectedPackageId}-${selectedAddonIds.join("-")}`,
      serviceItemId: service.id,
      durationId: selectedDurationId,
      packageId: selectedPackageId,
      addOnIds: selectedAddonIds,
      title: service.title,
      price: totalPrice,
      // Sent up to the backend as `addOnsTotal` on every cart write (see
      // syncCart in CartContext) — kept alongside `price` since the
      // flattened cart item has no raw add-on catalog to recompute this
      // breakdown from later.
      addOnsTotal: Math.round(addonsPrice),
      image: service.media,
      duration:
        selectedDuration?.label ??
        selectedDuration?.name ??
        selectedDuration?.title ??
        selectedDuration?.duration ??
        service.duration,
    });
    onAddedToCart?.();
  };

  const currentPrice = `₹${totalPrice.toLocaleString("en-IN")}`;

  return (
    <>
      {/* Bottom padding clears the fixed price/CTA bar below, which stacks
          price above the button on mobile (taller) and sits side-by-side
          from sm: up (shorter) — sized per breakpoint with margin to spare
          so the last bit of content is never hidden behind it. */}
      <section className="mx-auto w-full bg-white font-sans text-slate-800 pb-56 sm:pb-44 md:pb-36">
        {/* Responsive container with proper padding */}
        <div className="px-4 sm:px-4 md:px-6 lg:px-8 pt-6 md:max-w-4xl lg:max-w-6xl md:mx-auto">
          {/* --- DESKTOP GRID CONTAINER --- */}
          <div className="flex flex-col md:flex-row md:gap-8 lg:gap-10">
            {/* --- LEFT COLUMN (Selections) --- */}
            <div className="flex-1 w-full flex flex-col">
              {/* --- DURATION SECTION --- */}
              {durations.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-base sm:text-lg md:text-lg lg:text-xl font-semibold text-black">
                    Select duration
                  </h3>
                  {/* shrink-0 + a fixed width keeps every duration button
                      readable — flex-1 used to squeeze them all to fit the
                      row, so more than 3-4 durations turned into unreadable
                      slivers. hide-scrollbar (globals.css) keeps the native
                      scrollbar off while the row itself still scrolls. */}
                  <div className="relative">
                    <div
                      ref={durationScrollRef}
                      className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar"
                    >
                      {durations.map((duration) => {
                        const isSelected = selectedDurationId === duration.id;
                        const pricing = getDurationPricing(duration);

                        return (
                          <button
                            key={duration.id}
                            type="button"
                            onClick={() => setSelectedDurationId(duration.id)}
                            className={`flex shrink-0 flex-col h-16 sm:h-20 md:h-20 w-[86px] sm:w-28 md:w-32 rounded-lg items-start border p-3 text-left transition-colors ${
                              isSelected
                                ? "border-[#D38516] bg-[#FDFBF8]"
                                : "border-black/25 bg-transparent hover:border-slate-400"
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-medium text-black">
                              {duration.label ?? duration.title ?? duration.duration}
                            </span>

                            <div className="mt-auto flex flex-col items-start">
                              {pricing.hasDiscount && (
                                <span className="text-[10px] leading-tight text-[#808080] line-through">
                                  ₹{Math.round(pricing.price).toLocaleString("en-IN")}
                                </span>
                              )}
                              <span
                                className={`text-sm md:text-base font-semibold leading-tight ${
                                  isSelected ? "text-[#D38516]" : "text-[#666666]"
                                }`}
                              >
                                ₹{Math.round(pricing.displayPrice).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* With the scrollbar hidden, these edge fades are the
                        only cue that there's more to scroll — each one only
                        shows on the side that still has hidden content, and
                        clears once you've scrolled that direction as far as
                        it goes. pointer-events-none so they never block a
                        tap on the button underneath. */}
                    {!durationScrollEdges.atStart && (
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex w-8 items-center bg-gradient-to-r from-white via-white/80 to-transparent">
                        <ChevronLeft className="h-4 w-4 text-black/40" strokeWidth={2.5} />
                      </div>
                    )}
                    {!durationScrollEdges.atEnd && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex w-8 items-center justify-end bg-gradient-to-l from-white via-white/80 to-transparent">
                        <ChevronRight className="h-4 w-4 text-black/40" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- PACK SECTION --- */}
              {packages.length > 0 && (
                <div className="w-full font-sans bg-white">
                  {/* Title Header */}
                  <div className="flex flex-row items-center justify-start gap-1 p-0 mb-4">
                    <h3 className="text-lg sm:text-lg md:text-xl font-semibold leading-tight text-black">
                      Select a pack
                    </h3>
                    <span className="text-xs sm:text-sm font-medium leading-tight text-[#904720]">
                      (Save more)
                    </span>
                  </div>

                  {/* Cards Container - Responsive */}
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {packages.map((pack) => {
                      const isSelected = selectedPackageId === pack.id;
                      const pricing = getPackPricing(pack, durationPrice);
                      const hasDiscount = pricing.savingsPercent > 0;

                      return (
                        <button
                          key={pack.id}
                          type="button"
                          onClick={() => setSelectedPackageId(pack.id)}
                          className={`box-border flex flex-col items-start shrink-0 w-28 sm:w-32 md:w-36 min-h-32 p-3 sm:p-4 rounded-lg text-left transition-colors ${
                            isSelected
                              ? "bg-[#FDFBF8] border border-[#904720] gap-2"
                              : "bg-white border border-[#BFBFBF] justify-center gap-2"
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-medium text-black">
                            {pack.label ?? pack.name ?? pack.title}
                          </span>

                          <span className="text-sm sm:text-base font-medium text-black">
                            ₹{Math.round(pricing.discountedTotal).toLocaleString("en-IN")}
                          </span>

                          {hasDiscount && (
                            <span className="text-xs text-[#808080] line-through">
                              ₹{Math.round(pricing.originalTotal).toLocaleString("en-IN")}
                            </span>
                          )}

                          {hasDiscount && (
                            <span className="text-xs text-[#1E9E13]">
                              {pricing.savingsPercent}% off
                            </span>
                          )}

                          <span className="text-xs text-[#666666]">
                            (₹{Math.round(pricing.perSessionPrice).toLocaleString("en-IN")}/session)
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tailwind Utility for hiding scrollbar */}
                  <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                    .scrollbar-hide {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                  `}</style>
                </div>
              )}

              {/* --- ADD-ONS SECTION --- */}
              {addOns.length > 0 && (
                <div className="mt-6 sm:mt-8 md:mt-10">
                  <h3 className="mb-3 text-base sm:text-lg md:text-lg font-semibold text-slate-900 flex items-center gap-2">
                    Add-ons
                    <span className="text-xs sm:text-sm font-normal text-slate-400">
                      (Optional)
                    </span>
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {addOns.map((addon) => {
                      const isSelected = selectedAddonIds.includes(addon.id);

                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => {
                            setSelectedAddonIds((prev) =>
                              prev.includes(addon.id)
                                ? prev.filter((id) => id !== addon.id)
                                : [...prev, addon.id],
                            );
                          }}
                          className={`flex w-full h-12 sm:h-14 items-center justify-between rounded-lg border p-3 sm:p-4 transition-colors ${
                            isSelected
                              ? "border-amber-400 bg-amber-50/30"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-sm sm:text-base font-medium text-slate-700">
                            {addon.name ?? addon.title}
                          </span>

                          <span className="text-xs sm:text-sm font-semibold text-slate-800">
                            +₹{Number(addon.price ?? 0).toLocaleString("en-IN")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* --- RIGHT COLUMN (Meta & Highlights for Desktop) --- */}
            {features.length > 0 && (
              <div className="w-full md:w-72 lg:w-96 shrink-0 mt-8 md:mt-0 flex flex-col md:sticky md:top-24 self-start">
                {/* --- FEATURES SECTION --- */}
                <div className="rounded-xl md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-sm">
                  <h3 className="mb-3 text-lg sm:text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
                    Features
                  </h3>
                  <ul className="space-y-3 sm:space-y-2 mt-3">
                    {features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm sm:text-base text-slate-700"
                      >
                        <ChevronRight
                          className="h-4 w-4 text-amber-500 shrink-0"
                          strokeWidth={3}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* --- OVERVIEW SECTION --- */}
          {(overviewText || overviewGallery.length > 0) && (
            <>
              <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />
              <section className="font-sans w-full bg-white">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-black mb-3">
                  Overview
                </h2>

                {overviewText && (
                  <p className="text-sm sm:text-base font-medium leading-relaxed text-[#666666] mb-6 sm:mb-8">
                    {overviewText}
                  </p>
                )}

                {overviewGallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {overviewGallery.map((item, index) => (
                      <div
                        key={item.id ?? index}
                        className="flex flex-col items-center w-full"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-20 sm:h-24 md:h-32 object-cover rounded-lg"
                        />
                        <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base font-medium leading-tight text-black text-center w-full">
                          {item.title}
                        </h3>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* --- PROCEDURE STEPS COMPONENT --- */}
          {procedureSteps.length > 0 && (
            <>
              <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />
              <div className="w-full">
                <StepsSection steps={procedureSteps} />
              </div>
            </>
          )}

          {/* --- DISCLAIMER --- */}
          {disclaimerItems.length > 0 && (
            <>
              <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />
              <div className="w-full flex flex-col items-start gap-4 sm:gap-6 bg-white font-sans">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-black">
                  Disclaimer
                </h3>

                <ul className="w-full p-0 m-0 space-y-3 sm:space-y-4 list-none">
                  {disclaimerItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base font-medium leading-relaxed text-black"
                    >
                      <Check
                        className="mt-0.5 h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-[#8B5A2B]"
                        strokeWidth={2.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* --- ITEMS USED --- */}
          {itemsUsed.length > 0 && (
            <>
              <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />
              <div className="w-full bg-white font-sans">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-5">
                  Items Used
                </h2>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {itemsUsed.map((item, index) => (
                    <div key={item.id ?? index} className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-[#FEF4F4] rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg sm:rounded-xl mix-blend-multiply p-2"
                        />
                      </div>

                      <span className="text-xs sm:text-sm font-medium text-black text-center leading-tight">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* --- SKILLED PROFESSIONALS & PRE/POST CARE --- */}
          {(skilledPros.length > 0 || prePostCare.length > 0) && (
            <>
              <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />
              <div className="w-full flex flex-col font-sans bg-white">
                {skilledPros.length > 0 && (
                  <>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-black mb-4 sm:mb-6">
                      Our Skilled Professionals
                    </h2>

                    <div className="relative w-full rounded-xl sm:rounded-2xl px-4 sm:px-5 py-5 sm:py-6 bg-gradient-to-r from-[#FFF0E6] to-[#FADBD8] mb-6 sm:mb-8 overflow-hidden">
                      <div className="inline-block bg-white text-[#8A4A24] text-xs font-bold tracking-wide px-3 py-1.5 rounded-md mb-3 sm:mb-4 shadow-sm">
                        VELLORA EXPERTS
                      </div>

                      <ul className="flex flex-col gap-2 sm:gap-3 w-full md:w-2/3 relative z-10">
                        {skilledPros.map((text, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs sm:text-sm font-medium text-[#8A4A24] leading-relaxed"
                          >
                            <svg
                              className="w-4 h-4 shrink-0 mt-1 text-[#8A4A24]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>{text}</span>
                          </li>
                        ))}
                      </ul>

                      <img
                        src="/images/subDetail/skilledProfessional.png"
                        className="absolute bottom-0 right-0 w-1/3 h-full object-cover object-top rounded-br-xl opacity-80 sm:opacity-100"
                      />
                    </div>
                  </>
                )}

                {prePostCare.length > 0 && (
                  <>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-black mb-4">
                      Pre & Post Care
                    </h2>

                    <ul className="flex flex-col gap-3 sm:gap-4 w-full">
                      {prePostCare.map((text, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm md:text-base font-medium text-black leading-relaxed"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-1 text-[#904720]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </>
          )}

          {/* --- WHAT'S INCLUDED & FAQs --- */}
          {(whatsIncluded.length > 0 || faqs.length > 0) && (
            <>
              <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />
              <div className="w-full bg-white font-sans">
                {whatsIncluded.length > 0 && (
                  <>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-black mb-4 sm:mb-5">
                      What&apos;s Included
                    </h2>

                    <div className="flex flex-col gap-5 sm:gap-6 w-full mb-6 sm:mb-8">
                      {whatsIncluded.map((item, index) => (
                        <div
                          key={item.id ?? index}
                          className="flex flex-row justify-between items-center gap-4 sm:gap-6"
                        >
                          <div className="flex flex-col flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-medium text-black mb-1">
                              {item.title}
                            </h3>
                            {item.subtitle && (
                              <p className="text-sm font-medium text-[#666666] leading-[1.38]">
                                {item.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-gradient-to-b from-[#FFDBDB]/43 via-[#FFECEC]/43 to-white/43 rounded-lg flex items-center justify-center p-2">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {whatsIncluded.length > 0 && faqs.length > 0 && (
                  <div className="w-full h-px bg-[#F0F0F0] my-6 sm:my-8"></div>
                )}

                {faqs.length > 0 && (
                  <>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-black mb-3 sm:mb-4 tracking-tight">
                      FAQs
                    </h2>

                    <div className="flex flex-col">
                      {faqs.map((faq, index) => {
                        const isOpen = openFaq === index;

                        return (
                          <div key={index} className="border-b border-[#F0F0F0]">
                            <div
                              className="flex items-center justify-between py-3 sm:py-4 cursor-pointer gap-2"
                              onClick={() => toggleFaq(index)}
                            >
                              <span className="text-xs sm:text-sm font-semibold text-black flex-1">
                                {faq.question}
                              </span>
                              <svg
                                className={`w-4 h-4 text-black shrink-0 transition-transform duration-300 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>

                            <div
                              className={`grid transition-all duration-300 ease-in-out ${
                                isOpen
                                  ? "grid-rows-[1fr] opacity-100 pb-3 sm:pb-4"
                                  : "grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <p className="text-xs sm:text-sm font-medium text-[#666666] leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* --- TRUSTED & LOVED --- */}
          {(trustedLoved.length > 0 || customReviews.length > 0) && (
            <>
              <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />
              <div className="w-full bg-white font-sans">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-4 sm:mb-5 tracking-tight">
                  Trusted & loved
                </h2>

                {trustedLoved.length > 0 && (
                  <ul className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {trustedLoved.map((text, i) => (
                      <li key={i} className="flex items-center gap-2 sm:gap-3">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#8E4A23] shrink-0" strokeWidth={2.5} />
                        <span className="text-sm sm:text-base font-medium text-black">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {customReviews.map((review, index) => (
                  <div
                    key={review.id ?? index}
                    className="w-full border border-[#F0F0F0] rounded-xl bg-gradient-to-br from-[#FFF0F0] via-white to-white p-3 sm:p-4 shadow-sm mb-3 sm:mb-4 last:mb-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {review.image && (
                          <img
                            src={review.image}
                            alt={review.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                          />
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-semibold text-black leading-tight">
                            {review.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-black leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* --- FLOATING BOTTOM ACTION BAR --- */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <div className="w-full max-w-md sm:max-w-none md:max-w-6xl mx-auto">
          <div className="flex h-auto py-3 sm:py-4 w-full flex-col items-start justify-center gap-3 sm:gap-4 border-t border-black/25 bg-white px-4 sm:px-6 md:px-8 md:rounded-none shadow-2xl md:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3 sm:gap-4">
              {/* Dynamic Price Display */}
              <div className="flex flex-col items-start justify-center gap-1">
                <span className="text-lg sm:text-xl font-medium text-black">
                  {currentPrice}
                </span>
                <span className="text-xs sm:text-sm font-normal text-[#666666]">
                  Total Amount
                </span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedDurationId || !selectedPackageId || isAddingToCart}
                className="flex w-full sm:w-auto h-11 sm:h-12 items-center justify-center gap-2 rounded-lg bg-[#0F0F0E] px-6 sm:px-8 py-3 transition-transform active:scale-95 hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-sm sm:text-base font-medium text-white whitespace-nowrap">
                  {isAddingToCart ? "Adding…" : "Add to cart"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
