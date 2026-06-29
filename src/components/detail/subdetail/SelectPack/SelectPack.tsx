"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import StepsSection from "../StepSection/SectionSteps";

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
  const [selectedPack, setSelectedPack] = useState("1 Session");
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
    <section className="mx-auto w-full max-w-md bg-white sm:p-4 pt-[24px] px-[16px] font-sans text-slate-800">
      {/* --- DURATION SECTION --- */}
      <div className="mb-6">
        <h3 className="mb-3 text-[16px] font-semibold text-[#000000] ">
          Select duration
        </h3>
        <div className="flex gap-[12px]">
          {durations.map((duration) => {
            const isSelected = selectedDuration === duration.id;
            return (
              <button
                key={duration.id}
                onClick={() => setSelectedDuration(duration.id)}
                className={`flex flex-col h-[60px] w-[86px] rounded-[8px] items-start border p-3 text-left transition-colors sm:w-24 ${
                  isSelected
                    ? "border-[#D38516] bg-[#FDFBF8]"
                    : "border-[#000000]/25 bg-[#FDFBF8]"
                }`}
              >
                <span className="text-xs font-medium text-[#000000]">
                  {duration.id}
                </span>
                <span
                  className={`text-sm font-semibold ${isSelected ? "text-[#D38516]" : "text-[#666666]"}`}
                >
                  {duration.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- PACK SECTION --- */}
      <div className="mt-[24px]">
        <h3 className=" text-[16px] gap-[3px] font-semibold text-[#000000]">
          Select a pack{" "}
          <span className="text-[12px] font-medium text-[#D38516]">
            (Save more)
          </span>
        </h3>
        <div className="flex mt-[12px] gap-[10px] overflow-x-auto">
          {packs.map((pack) => {
            const isSelected = selectedPack === pack.id;
            return (
              // Determine gap based on presence of originalPrice and discount
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                className={`flex sm:min-w-[110px] w-[113px] h-[138px] ${pack.originalPrice && pack.discount ? "gap-[6px]" : "gap-[12px]"} shrink-0 flex-col items-start rounded-[8px] border p-[12px] text-left transition-colors ${
                  isSelected
                    ? "border-amber-400 bg-amber-50/30"
                    : "border-slate-200 bg-white hover:border-amber-200"
                }`}
              >
                <span className=" text-[12px] font-medium text-slate-700">
                  {pack.id}
                </span>

                {/* Conditionally render discount info if available */}
                <div className="gap-[4px] flex flex-col">
                  <span className="text-[14px] font-bold text-slate-900">
                    {pack.price}
                  </span>
                  {pack.originalPrice && (
                    <span className="text-[12px] text-slate-400 line-through">
                      {pack.originalPrice}
                    </span>
                  )}
                </div>
                {pack.discount && (
                  <span className=" text-[12px] font-semibold text-green-600">
                    {pack.discount}
                  </span>
                )}

                <span className=" text-[10px] text-slate-500">
                  {pack.perSession}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- ADD-ONS SECTION --- */}
      <div className="mt-[24px]">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">
          Add-ons{" "}
          <span className="text-xs font-normal text-slate-400">(Optional)</span>
        </h3>
        <div className="space-y-2">
          {addons.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <button
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`flex w-[100%] h-[36px] items-center justify-between rounded-[8px] border p-3 transition-colors ${
                  isSelected
                    ? "border-amber-400 bg-amber-50/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{addon.icon}</span>
                  <span className="text-[12px] font-medium text-slate-700">
                    {addon.id}
                  </span>
                </div>
                <span className="text-[12px] font-semibold text-slate-800">
                  {addon.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="mt-[24px]">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Features</h3>
        <ul className="space-y-[10px] mt-[12px]">
          {[
            "Certified yoga experts",
            "Personalized session at home",
            "Safe for all age groups",
          ].map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-xs text-slate-700"
            >
              <ChevronRight
                className="h-3 w-3 text-amber-500"
                strokeWidth={3}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* --- RECOMMENDED BANNER --- */}
      <div className="mt-[24px] relative h-[107px] w-[358px] overflow-hidden rounded-[8px]">
        <img
          src="/images/subDetail/Frame 201.png" // Assuming Frame 201.png is in the public/images directory
          alt="Recommended"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute max-w-[200px] inset-0 flex flex-col justify-center px-4 py-4">
          <h4 className="mb-1 line-clamp-1 text-[16px] font-medium text-[#D38516]">
            Recommended
          </h4>
          <p className="text-[12px] leading-snug text-[#000000]">
            Practice 3-5 times a week for best results
          </p>
        </div>
      </div>

      <div className="my-[24px] h-px w-full bg-[#F3EFEB]" />
      <div>
        <StepsSection steps={steps} />
      </div>

      {/* --- BEFORE YOU BOOK SECTION --- */}
      <div>
        <h3 className="mt-[24px] text-[16px] font-semibold text-slate-900">
          Before you book
        </h3>
        <ul className="space-y-[10px] mt-[12px]">
          {[
            "Inform your expert about any injuries or medical conditions",
            "This session is available at home only",
            "Keep a mat or open space ready (6ft x 3ft)",
          ].map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-[12px] text-slate-700"
            >
              <Check
                className="mt-0.5 h-[13px] w-[13px] shrink-0 text-amber-500"
                strokeWidth={3}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
