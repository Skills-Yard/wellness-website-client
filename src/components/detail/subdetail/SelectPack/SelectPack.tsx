"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";

// Optional: You can keep passing service details as props if you want to make the pricing dynamic later.
// For now, I've structured it to perfectly match the static data in the provided image.
interface RequirementSelectorProps {
  onSelectionChange?: (data: any) => void;
  steps: [];
}

export default function RequirementSelector({
  onSelectionChange,
  steps,
}: RequirementSelectorProps) {
  // State for selections based on the image's layout
  const [selectedDuration, setSelectedDuration] = useState("60 mins");
  const [selectedPack, setSelectedPack] = useState("1 Sessions");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Static data matching the image
  const durations = [
    { id: "60 mins", price: "₹1,199" },
    { id: "90 mins", price: "₹2,199" },
  ];

  const packs = [
    {
      id: "1 Sessions",
      price: "₹1,199",
      perSession: "(₹1,199/session)",
    },
    {
      id: "4 Sessions",
      price: "₹4,316",
      originalPrice: "₹4,796",
      discount: "10% off",
      perSession: "(₹1,079/session)",
    },
    {
      id: "8 Sessions",
      price: "₹8,316",
      originalPrice: "₹8,996",
      discount: "10% off",
      perSession: "(₹1,079/session)",
    },
  ];

  const addons = [
    { id: "Meditation Session", price: "+₹299", icon: "🧘" },
    { id: "Personalized Diet Plan", price: "+₹399", icon: "🥗" },
  ];

  // Helper to toggle add-ons
  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  return (
    <section className="mx-auto w-full max-w-md md:max-w-4xl lg:max-w-6xl bg-white sm:p-4 md:p-6 lg:p-8 pt-[24px] px-[16px] font-sans text-slate-800">
      
      {/* --- DESKTOP GRID CONTAINER --- */}
      <div className="flex flex-col md:flex-row md:gap-12 lg:gap-20">
        
        {/* --- LEFT COLUMN (Selections) --- */}
        <div className="flex-1 w-full flex flex-col">
          {/* --- DURATION SECTION --- */}
          <div className="mb-6">
            <h3 className="mb-3 text-[16px] md:text-lg lg:text-xl font-semibold text-[#000000]">
              Select duration
            </h3>
            <div className="flex gap-[12px]">
              {durations.map((duration) => {
                const isSelected = selectedDuration === duration.id;
                return (
                  <button
                    key={duration.id}
                    onClick={() => setSelectedDuration(duration.id)}
                    className={`flex flex-col h-[60px] md:h-[72px] w-[86px] rounded-[8px] items-start border p-3 text-left transition-colors sm:w-24 md:w-32 md:p-4 ${
                      isSelected
                        ? "border-[#D38516] bg-[#FDFBF8]"
                        : "border-[#000000]/25 bg-[#FDFBF8] hover:border-slate-400"
                    }`}
                  >
                    <span className="text-xs md:text-sm font-medium text-[#000000]">
                      {duration.id}
                    </span>
                    <span
                      className={`text-sm md:text-base font-semibold mt-auto ${isSelected ? "text-[#D38516]" : "text-[#666666]"}`}
                    >
                      {duration.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- PACK SECTION --- */}
          <div className="mt-[24px] md:mt-[32px]">
            <h3 className="text-[16px] md:text-lg lg:text-xl gap-[3px] font-semibold text-[#000000] flex items-center">
              Select a pack
              <span className="text-[12px] md:text-sm font-medium text-[#D38516] ml-1">
                (Save more)
              </span>
            </h3>
            <div className="flex mt-[12px] gap-[10px] md:gap-4 overflow-x-auto md:overflow-visible md:flex-wrap hide-scrollbar pb-2 md:pb-0">
              {packs.map((pack) => {
                const isSelected = selectedPack === pack.id;
                return (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`flex sm:min-w-[110px] w-[113px] md:w-[130px] lg:w-[140px] h-[138px] md:h-[150px] ${
                      pack.originalPrice && pack.discount ? "gap-[6px] md:gap-[8px]" : "gap-[12px] md:gap-[16px]"
                    } shrink-0 flex-col items-start rounded-[8px] border p-[12px] md:p-4 text-left transition-colors ${
                      isSelected
                        ? "border-amber-400 bg-amber-50/30 shadow-xs"
                        : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-xs"
                    }`}
                  >
                    <span className="text-[12px] md:text-sm font-medium text-slate-700">
                      {pack.id}
                    </span>

                    <div className="gap-[4px] flex flex-col mt-auto">
                      <span className="text-[14px] md:text-base lg:text-lg font-bold text-slate-900">
                        {pack.price}
                      </span>
                      {pack.originalPrice && (
                        <span className="text-[12px] md:text-xs text-slate-400 line-through">
                          {pack.originalPrice}
                        </span>
                      )}
                    </div>
                    {pack.discount && (
                      <span className="text-[12px] md:text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm">
                        {pack.discount}
                      </span>
                    )}

                    <span className="text-[10px] md:text-xs text-slate-500 mt-auto w-full border-t border-slate-100 pt-2">
                      {pack.perSession}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- ADD-ONS SECTION --- */}
          <div className="mt-[24px] md:mt-[40px]">
            <h3 className="mb-3 text-sm md:text-base lg:text-lg font-semibold text-slate-900 flex items-center gap-2">
              Add-ons
              <span className="text-xs md:text-sm font-normal text-slate-400">(Optional)</span>
            </h3>
            <div className="space-y-2 md:space-y-3 md:max-w-lg lg:max-w-xl">
              {addons.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex w-[100%] h-[36px] md:h-[48px] items-center justify-between rounded-[8px] border p-3 md:px-4 transition-colors ${
                      isSelected
                        ? "border-amber-400 bg-amber-50/30"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-sm md:text-lg">{addon.icon}</span>
                      <span className="text-[12px] md:text-sm lg:text-base font-medium text-slate-700">
                        {addon.id}
                      </span>
                    </div>
                    <span className="text-[12px] md:text-sm font-semibold text-slate-800">
                      {addon.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Meta & Highlights for Desktop) --- */}
        <div className="w-full md:w-[280px] lg:w-[350px] shrink-0 mt-[24px] md:mt-0 flex flex-col md:sticky md:top-24 self-start">
          
          {/* --- FEATURES SECTION --- */}
          <div className="rounded-xl md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-sm">
            <h3 className="mb-3 text-sm md:text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
              Features
            </h3>
            <ul className="space-y-[10px] mt-[12px]">
              {[
                "Certified yoga experts",
                "Personalized session at home",
                "Safe for all age groups",
              ].map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs md:text-sm text-slate-700"
                >
                  <ChevronRight
                    className="h-3 w-3 md:h-4 md:w-4 text-amber-500 shrink-0"
                    strokeWidth={3}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* --- RECOMMENDED BANNER --- */}
          <div className="mt-[24px] relative h-[107px] md:h-[130px] w-[358px] md:w-full overflow-hidden rounded-[8px] md:rounded-xl shadow-sm">
            <img
              src="/images/subDetail/Frame 201.png"
              alt="Recommended"
              className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105 duration-700"
            />
            <div className="absolute max-w-[200px] inset-0 flex flex-col justify-center px-4 py-4 md:px-5">
              <h4 className="mb-1 line-clamp-1 text-[16px] md:text-lg font-bold text-[#D38516]">
                Recommended
              </h4>
              <p className="text-[12px] md:text-sm leading-snug text-[#000000] font-medium">
                Practice 3-5 times a week for best results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEPARATOR --- */}
      <div className="my-[24px] md:my-[40px] h-px w-full bg-[#F3EFEB]" />
      
      {/* --- PROCEDURE STEPS COMPONENT --- */}
      <div className="w-full">
        <StepsSection steps={steps} />
      </div>

      {/* --- BEFORE YOU BOOK SECTION --- */}
      <div className="mt-[16px] md:mt-[32px] md:max-w-4xl lg:max-w-6xl md:rounded-xl md:border md:border-amber-100 md:bg-amber-50/30 md:p-6 lg:p-8">
        <h3 className="mt-[24px] md:mt-0 text-[16px] md:text-xl font-semibold text-slate-900 border-b border-amber-200/50 pb-3 md:mb-4">
          Before you book
        </h3>
        <ul className="space-y-[10px] md:space-y-4 mt-[12px] md:mt-0 md:grid md:grid-cols-2 md:gap-x-8">
          {[
            "Inform your expert about any injuries or medical conditions",
            "This session is available at home only",
            "Keep a mat or open space ready (6ft x 3ft)",
          ].map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 md:gap-3 text-[12px] md:text-sm lg:text-base text-slate-700"
            >
              <Check
                className="mt-0.5 md:mt-1 h-[13px] w-[13px] md:h-[16px] md:w-[16px] shrink-0 text-amber-500"
                strokeWidth={3}
              />
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------
// STEPS SECTION COMPONENT
// ---------------------------------------------------------------------------------

import Image from "next/image";

interface StepsSectionProps {
  steps: {
    id: string;
    title: string;
    description: string;
    image: string;
  }[];
}

export function StepsSection({ steps }: StepsSectionProps) {
  const activeSteps = steps || [];

  return (
    <>
      <section className="mx-auto w-full md:px-0">
        <div className="mb-[24px] md:mb-[32px] text-left">
          <h2 className="text-[16px] md:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Procedure
          </h2>
        </div>

        {/* Pipeline Container */}
        <div className="relative">
          {activeSteps.map((step, index) => {
            const isLast = index === activeSteps.length - 1;

            return (
              <div
                key={step.id}
                className="group relative flex gap-[8px] md:gap-8 lg:gap-12"
              >
                {/* --- LEFT COLUMN: Pipeline Line & Number --- */}
                <div className="relative flex flex-col items-center">
                  {/* The Number Circle */}
                  <div className="relative z-10 flex h-[20px] w-[20px] md:h-[32px] md:w-[32px] shrink-0 items-center justify-center rounded-full border border-white md:border-2 bg-[#FAF5F0] text-[12px] md:text-base font-semibold text-[#000000] shadow-sm transition-transform duration-300 group-hover:scale-110">
                    {index + 1}
                  </div>

                  {/* The Connecting Line */}
                  {!isLast && (
                    <div className="absolute top-12 md:top-14 bottom-0 w-0.5 bg-slate-200 h-full" />
                  )}
                </div>

                {/* --- RIGHT COLUMN: Content --- */}
                <div
                  className={`flex flex-row w-full gap-7 md:gap-12 justify-between items-start md:items-center ${
                    isLast ? "pb-0" : "pb-[24px] sm:pb-20 md:pb-24 lg:pb-32"
                  }`}
                >
                  {/* Title & Description */}
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <h3 className="text-[14px] md:text-xl lg:text-2xl line-clamp-1 font-medium text-slate-900">
                      {step.title}
                    </h3>
                    <p className="max-w-2xl line-clamp-3 md:line-clamp-none text-[12px] md:text-sm lg:text-base text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Image Container - Expands on larger screens */}
                  <div className="relative shrink-0 w-[75px] h-[83px] md:w-[160px] md:h-[120px] lg:w-[240px] lg:h-[160px] overflow-hidden rounded-[8px] md:rounded-xl lg:rounded-2xl bg-slate-100 border border-slate-100/50 shadow-xs transition-all duration-300 group-hover:shadow-md">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 768px) 75px, (max-width: 1024px) 160px, 240px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}