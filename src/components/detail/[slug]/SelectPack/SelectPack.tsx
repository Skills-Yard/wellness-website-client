"use client";

import {
  ServiceAddOn,
  ServiceDuration,
  ServicePackage,
} from "@/src/types/serviceDetailTypes";
import { DynamicService } from "@/src/utils/types/spabooking";
import { DynamicStep } from "@/src/utils/data/detailPage";
import { ChevronRight, Check } from "lucide-react";
import { useState } from "react";
import StepsSection from "../StepSection/SectionSteps";
import { useCart } from "@/src/context/CartContext";

type ServiceDetails = {
  durations: ServiceDuration[];
  packages: ServicePackage[];
  addOns: ServiceAddOn[];
};

interface RequirementSelectorProps {
  service: DynamicService;
  serviceDetails: ServiceDetails;
  steps: DynamicStep[];
  onSelectionChange?: (data: any) => void;
  onAddedToCart?: () => void;
}

export default function RequirementSelector({
  service,
  serviceDetails,
  steps,
  onSelectionChange,
  onAddedToCart,
}: RequirementSelectorProps) {
  const { addToCart } = useCart();
  const { durations, packages, addOns } = serviceDetails;
  // State for selections based on the image's layout
  const [selectedDurationId, setSelectedDurationId] = useState<string | null>(
    durations[0]?.id ?? null,
  );

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    packages[0]?.id ?? null,
  );

  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState(null);

  const treatments = [
    {
      id: 1,
      title: "Skin Preparation",
      imgSrc:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "Exfoliation Therapy",
      imgSrc:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "Scrub Application",
      imgSrc:
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      title: "Moisture & Relaxation",
      imgSrc:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const disclaimerItems = [
    "Avoid with active rashes, cuts, or skin sensitivity.",
    "Choose comfortable clothing for a relaxing experience.",
    "Hydrate your skin and avoid strong skincare products.",
  ];

  const items = [
    {
      name: "Essential Oils",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Linen Towels",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Nourishing Scrub",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Moisturizer",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Props",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
  ];

  // Dummy data representing the "What's Included" items
  const includedItems = [
    {
      title: "Miraquill Sensory Oil",
      description: "Infused with Lavendar Essential Oil to calm the senses.",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Head Massage Oil",
      description: "Infused with Lavendar Essential Oil to calm the senses.",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Hydrating Gel",
      description: "Infused with Lavendar Essential Oil to calm the senses.",
      img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Relief Balm",
      description: "Infused with Lavendar Essential Oil to calm the senses.",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
  ];

  // Dummy data representing the FAQs
  const faqs = [
    {
      question: "How often should I get this spa?",
      answer:
        "For optimal results and relaxation, we recommend getting this spa treatment once every 2 to 4 weeks.",
    },
    {
      question: "What are the benefits of this spa?",
      answer:
        "It deeply hydrates your skin, relieves muscle tension, reduces stress, and improves blood circulation.",
    },
    {
      question: "Is it suitable for sensitive skin?",
      answer:
        "Yes, our products are infused with natural lavender essential oils which are generally safe and soothing for sensitive skin.",
    },
    {
      question: "Can I shower immediately after?",
      answer:
        "We recommend waiting at least 2 hours before taking a shower with lukewarm water to let the oils absorb.",
    },
  ];

  const toggleFaq = (index: any) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Calculate Total Dynamic Price (Selected Pack + Selected Addons)
  const selectedPackage = packages.find(
    (pack) => pack.id === selectedPackageId,
  );
  const selectedDuration = durations.find(
    (duration) => duration.id === selectedDurationId,
  );

  const selectedAddons = addOns.filter((addon) =>
    selectedAddonIds.includes(addon.id),
  );

  const packagePrice = Number(selectedPackage?.price ?? 0);

  const addonsPrice = selectedAddons.reduce(
    (total, addon) => total + Number(addon.price ?? 0),
    0,
  );

  const totalPrice = packagePrice + addonsPrice;

  const handleAddToCart = () => {
    if (!selectedDurationId || !selectedPackageId) return;

    addToCart({
      id: `${service.id}-${selectedDurationId}-${selectedPackageId}-${selectedAddonIds.join("-")}`,
      serviceItemId: service.id,
      durationId: selectedDurationId,
      packageId: selectedPackageId,
      addOnIds: selectedAddonIds,
      title: service.label,
      price: totalPrice,
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

  // Helper to toggle add-ons
  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  return (
    <>
      <section className="mx-auto w-full bg-white font-sans text-slate-800 pb-[100px] md:pb-[90px]">
        {/* Responsive container with proper padding */}
        <div className="px-4 sm:px-4 md:px-6 lg:px-8 pt-6 md:max-w-4xl lg:max-w-6xl md:mx-auto">
          {/* --- DESKTOP GRID CONTAINER --- */}
          <div className="flex flex-col md:flex-row md:gap-8 lg:gap-10">
            {/* --- LEFT COLUMN (Selections) --- */}
            <div className="flex-1 w-full flex flex-col">
              {/* --- DURATION SECTION --- */}
              <div className="mb-6">
                <h3 className="mb-3 text-base sm:text-lg md:text-lg lg:text-xl font-semibold text-black">
                  Select duration
                </h3>
                <div className="flex gap-3 sm:gap-3">
                  {durations.map((duration) => {
                    const isSelected = selectedDurationId === duration.id;

                    return (
                      <button
                        key={duration.id}
                        type="button"
                        onClick={() => setSelectedDurationId(duration.id)}
                        className={`flex flex-col flex-1 sm:flex-none h-16 sm:h-20 md:h-20 sm:w-28 md:w-32 rounded-lg items-start border p-3 text-left transition-colors ${
                          isSelected
                            ? "border-[#D38516] bg-[#FDFBF8]"
                            : "border-black/25 bg-[#FDFBF8] hover:border-slate-400"
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-medium text-black">
                          {duration.label ?? duration.title ?? duration.duration}
                        </span>

                        <span
                          className={`text-sm md:text-base font-semibold mt-auto ${
                            isSelected ? "text-[#D38516]" : "text-[#666666]"
                          }`}
                        >
                          ₹{Number(duration.price ?? 0).toLocaleString("en-IN")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* --- PACK SECTION --- */}
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
                          ₹{Number(pack.price ?? 0).toLocaleString("en-IN")}
                        </span>

                        {pack.originalPrice && (
                          <span className="text-xs text-[#808080] line-through">
                            ₹
                            {Number(pack.originalPrice).toLocaleString("en-IN")}
                          </span>
                        )}

                        {(pack.discount ?? pack.savingsPercent ?? pack.savings) && (
                          <span className="text-xs text-[#1E9E13]">
                            {pack.discount ?? (pack.savingsPercent ? `Save ${pack.savingsPercent}%` : `Save ₹${Number(pack.savings).toLocaleString("en-IN")}`)}
                          </span>
                        )}
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

              {/* --- ADD-ONS SECTION --- */}
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
            </div>

            {/* --- RIGHT COLUMN (Meta & Highlights for Desktop) --- */}
            <div className="w-full md:w-72 lg:w-96 shrink-0 mt-8 md:mt-0 flex flex-col md:sticky md:top-24 self-start">
              {/* --- FEATURES SECTION --- */}
              <div className="rounded-xl md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-sm">
                <h3 className="mb-3 text-lg sm:text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
                  Features
                </h3>
                <ul className="space-y-3 sm:space-y-2 mt-3">
                  {[
                    "Certified yoga experts",
                    "Personalized session at home",
                    "Safe for all age groups",
                  ].map((feature, idx) => (
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
          </div>

          {/* --- SEPARATOR --- */}
          <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />

          {/* --- OVERVIEW SECTION --- */}
          <section className="font-sans w-full bg-white">
            {/* Overview Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-black mb-3">
              Overview
            </h2>

            {/* Overview Description */}
            <p className="text-sm sm:text-base font-medium leading-relaxed text-[#666666] mb-6 sm:mb-8">
              Luxurious full body spa including head & feet massage using Guasha
              techniques to relax muscles, detoxify, and reduce stress.
            </p>

            {/* Services Grid - Responsive columns */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {treatments.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center w-full"
                >
                  <img
                    src={item.imgSrc}
                    alt={item.title}
                    className="w-full h-20 sm:h-24 md:h-32 object-cover rounded-lg"
                  />
                  <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base font-medium leading-tight text-black text-center w-full">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          {/* --- PROCEDURE STEPS COMPONENT --- */}
          <div className="w-full">
            <StepsSection steps={steps} />
          </div>

          {/* --- SEPARATOR --- */}
          <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />

          {/* --- DISCLAIMER --- */}
          <div className="w-full flex flex-col items-start gap-4 sm:gap-6 bg-white font-sans">
            {/* Disclaimer Title */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-black">
              Disclaimer
            </h3>

            {/* Lists Layout */}
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

          {/* --- SEPARATOR --- */}
          <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />

          {/* --- ITEMS USED --- */}
          <div className="w-full bg-white font-sans">
            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-5">
              Items Used
            </h2>

            {/* Responsive Grid - 3 cols on desktop, 3 on tablet, 3 on mobile */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Image Container */}
                  <div className="w-full aspect-square bg-[#FEF4F4] rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl mix-blend-multiply p-2"
                    />
                  </div>

                  {/* Item Label */}
                  <span className="text-xs sm:text-sm font-medium text-black text-center leading-tight">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="mt-6 sm:mt-8 border-b border-gray-100 w-full"></div>
          </div>

          {/* --- SEPARATOR --- */}
          <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />

          {/* --- SKILLED PROFESSIONALS --- */}
          <div className="w-full flex flex-col font-sans bg-white">
            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-black mb-4 sm:mb-6">
              Our Skilled Professionals
            </h2>

            {/* Card Container */}
            <div className="relative w-full rounded-xl sm:rounded-2xl px-4 sm:px-5 py-5 sm:py-6 bg-gradient-to-r from-[#FFF0E6] to-[#FADBD8] mb-6 sm:mb-8 overflow-hidden">
              {/* Badge */}
              <div className="inline-block bg-white text-[#8A4A24] text-xs font-bold tracking-wide px-3 py-1.5 rounded-md mb-3 sm:mb-4 shadow-sm">
                VELLORA EXPERTS
              </div>

              {/* Card List Items */}
              <ul className="flex flex-col gap-2 sm:gap-3 w-full md:w-2/3 relative z-10">
                {[
                  "Trained & experienced professionals",
                  "Customize Service as per your preference",
                  "Certified Experts",
                ].map((text, i) => (
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

              {/* Image */}
              <img
                src="/images/subDetail/skilledProfessional.png"
                className="absolute bottom-0 right-0 w-1/3 h-full object-cover object-top rounded-br-xl opacity-80 sm:opacity-100"
              />
            </div>

            {/* --- PRE & POST CARE --- */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-black mb-4">
              Pre & Post Care
            </h2>

            <ul className="flex flex-col gap-3 sm:gap-4 w-full">
              {[
                "Avoid heavy meal before & after massage.",
                "Drink plenty of water before & after the service.",
                "Shower after 2 hours with lukewarm water.",
              ].map((text, i) => (
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
          </div>

          {/* --- SEPARATOR --- */}
          <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />

          {/* --- WHAT'S INCLUDED & FAQs --- */}
          <div className="w-full bg-white font-sans">
            {/* --- What's Included --- */}
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-black mb-4 sm:mb-5 tracking-tight">
              What&apos;s Included
            </h2>

            <div className="flex flex-col gap-4 sm:gap-5 w-full mb-6 sm:mb-8">
              {includedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4"
                >
                  {/* Text Content */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-black mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-[#666666] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Image Box */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#FEF4F4] rounded-lg sm:rounded-xl flex items-center justify-center p-1">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* --- Divider --- */}
            <div className="w-full h-px bg-[#F0F0F0] my-6 sm:my-8"></div>

            {/* --- FAQs --- */}
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-black mb-3 sm:mb-4 tracking-tight">
              FAQs
            </h2>

            <div className="flex flex-col">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div key={index} className="border-b border-[#F0F0F0]">
                    {/* Question Header */}
                    <div
                      className="flex items-center justify-between py-3 sm:py-4 cursor-pointer gap-2"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="text-xs sm:text-sm font-semibold text-black flex-1">
                        {faq.question}
                      </span>
                      {/* Chevron Icon */}
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

                    {/* Answer Content */}
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
          </div>

          {/* --- SEPARATOR --- */}
          <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-[#F3EFEB]" />

          {/* --- TRUSTED & LOVED --- */}
          <div className="w-full bg-white font-sans">
            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-4 sm:mb-5 tracking-tight">
              Trusted & loved
            </h2>

            {/* Bullet Points */}
            <ul className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                "Gentle yoga postures",
                "Certified and experienced experts",
                "4.8 average customer rating",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2 sm:gap-3">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#8E4A23] shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {i === 0 && (
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    )}
                    {i === 1 && (
                      <path d="M12 1L9 5H4v5L1 12l3 4v5h5l3 4 3-4h5v-5l3-4-3-4V5h-5L12 1zm0 15c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1-6.5v1H9v1h2v1h1v-1h2v-1h-2v-1h-1z" />
                    )}
                    {i === 2 && (
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    )}
                  </svg>
                  <span className="text-sm sm:text-base font-medium text-black">
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Review Card */}
            <div className="w-full border border-[#F0F0F0] rounded-xl bg-gradient-to-br from-[#FFF0F0] via-white to-white p-3 sm:p-4 shadow-sm">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-2">
                {/* User Info */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80"
                    alt="Karan Sharma"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-black leading-tight">
                      Karan Sharma
                    </span>
                    <span className="text-xs font-medium text-[#666666] leading-tight">
                      Jun 18, 2026
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 shrink-0">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF9900]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="text-xs font-medium text-[#666666]">
                    4.7
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-black leading-relaxed">
                Amazing experience! The instructor was patient and explained
                every pose so well. Felt so relaxed and light.
              </p>
            </div>
          </div>
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
                disabled={!selectedDurationId || !selectedPackageId}
                className="flex w-full sm:w-auto h-11 sm:h-12 items-center justify-center gap-2 rounded-lg bg-[#0F0F0E] px-6 sm:px-8 py-3 transition-transform active:scale-95 hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-sm sm:text-base font-medium text-white whitespace-nowrap">
                  Add to cart
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
