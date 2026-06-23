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
      // Mobile: aligns to bottom (items-end)
      // Desktop (sm): centers the modal and adds padding
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Global Close Button - Fixed top right */}
      <button
        type="button"
        onClick={onClose}
        className="fixed right-4 top-4 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:bg-slate-100 sm:right-6 sm:top-6"
        aria-label="Close popup"
      >
        ×
      </button>

      {/* Modal Container */}
      <div
        // Mobile: 90vh height, rounded top only, slides up
        // Desktop: auto height up to 90vh, rounded all corners
        className="relative flex h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 sm:h-auto sm:max-h-[90vh] sm:rounded-3xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle (Visual only) */}
        <div className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-slate-300 sm:hidden" />

        {/* Scrollable Content Area */}
        {/* Added top padding on mobile to account for the drag handle */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-8 pb-10 sm:pt-0">
          <SectionHero />
          <RequirementSelector />
          <Highlights />
          <SpaFeature />
          <StepsSection />
          <SetUpImage />
        </div>
      </div>
    </div>
  );
}