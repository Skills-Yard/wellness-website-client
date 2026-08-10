"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { DynamicStep } from "@/src/utils/data/detailPage";
import { DynamicService } from "@/src/utils/types/spabooking";
import SectionHero from "./SectionHero/SectionHero";
import RequirementSelector from "./SelectPack/SelectPack";
import {
  ServiceAddOn,
  ServiceDuration,
  ServicePackage,
} from "@/src/types/serviceDetailTypes";

type ServiceDetails = {
  durations: ServiceDuration[];
  packages: ServicePackage[];
  addOns: ServiceAddOn[];
};

type SubDetailPopUpProps = {
  onClose: () => void;
  service: DynamicService;
  categoryName: string;
  steps: DynamicStep[];

  // NEW
  serviceDetails: ServiceDetails;
};

export default function SubDetailPopUp({
  onClose,
  service,
  categoryName,
  steps,
  serviceDetails,
}: SubDetailPopUpProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setMounted(true));
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    setMounted(false);
    window.setTimeout(onClose, 300);
  };

  console.log("SERVICE:", service);

  console.log("DURATIONS:", serviceDetails.durations);

  console.log("PACKAGES:", serviceDetails.packages);

  console.log("ADD ONS:", serviceDetails.addOns);

  return (
    <div
      className={`fixed inset-0 z-70 flex items-end justify-center bg-black/80 backdrop-blur-xs transition-opacity duration-300 sm:items-center sm:p-4 ${mounted ? "opacity-100" : "opacity-0"}`}
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl transition-transform duration-300 sm:h-auto sm:max-h-[85vh] sm:rounded-3xl ${mounted ? "translate-y-0" : "translate-y-full"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 z-60 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-50"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <p className="px-5 pt-5 text-xs font-semibold uppercase tracking-wider text-amber-600">
            {categoryName}
          </p>
          <SectionHero service={service} />
          <RequirementSelector
            service={service}
            serviceDetails={serviceDetails}
            steps={steps}
            onAddedToCart={close}
          />
        </div>
      </div>
    </div>
  );
}
