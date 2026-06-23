"use client";

import Highlights from "./Highlights/Highlights";
import SpaFeature from "./Section4/spaFeature";
import RequirementSelector from "./RequirementSelector/RequirementSelector";
import SectionHero from "./SectionHero/SectionHero";
import StepsSection from "./StepSection/SectionSteps";
import SetUpImage from "./StepSection/SetUpImage";

type SubDetailPopUpProps = {
  onClose: () => void;
};

export default function SubDetailPopUp({ onClose }: SubDetailPopUpProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >

        <button
            type="button"
            onClick={onClose}
            className="absolute left-[49%] top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 sm:right-6 sm:top-6"
            aria-label="Close popup"
          >
            ×
          </button>
      <div className="flex h-full pt-10 w-full items-end justify-center sm:items-center">
        <div
          className="relative w-full max-w-xl h- overflow-y-scroll rounded-t-[32px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.18)] transition-all duration-300 sm:rounded-[20px] sm:max-h-[calc(100vh-4rem)]"
          onClick={(event) => event.stopPropagation()}
        >
          

          <div className="absolute left-1/2 top-3 hidden h-1.5 w-14 -translate-x-1/2 rounded-full bg-slate-300 sm:block" />

          <div className="flex h-full min-h-[70vh] flex-col sm:min-h-auto">
            <div className=" p-0">
              <SectionHero />
              <RequirementSelector />
              <Highlights />
              <SpaFeature />
              <StepsSection />
              <SetUpImage/>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
