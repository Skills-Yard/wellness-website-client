"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import Highlights from "./Highlights/Highlights";
import SpaFeature from "./Section4/spaFeature";
import RequirementSelector from "./RequirementSelector/RequirementSelector";
import SectionHero from "./SectionHero/SectionHero";
import StepsSection from "./StepSection/SectionSteps";
import SetUpImage from "./StepSection/SetUpImage";

type SubDetailPopUpProps = {
  onClose: () => void;
  service: any;
  steps: any[];
};

export default function SubDetailPopUp({ onClose, service, steps }: SubDetailPopUpProps) {
  // 1. Animation & Drag States
  const [mounted, setMounted] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  
  // Refs for tracking touch coordinates
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // 2. Lock Background Scroll & Trigger Entry Animation
  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";
    
    // Trigger slide up animation
    requestAnimationFrame(() => setMounted(true));

    return () => {
      // Unlock scroll when modal unmounts
      document.body.style.overflow = "";
    };
  }, []);

  // 3. Handle Closing with Animation
  const handleClose = () => {
    setMounted(false); // Triggers slide down
    setTranslateY(0);
    
    // Wait for the transition to finish (300ms) before removing from DOM
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // 4. Mobile Drag-to-Close Logic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (contentRef.current && contentRef.current.scrollTop > 0) return;
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (contentRef.current && contentRef.current.scrollTop > 0) return;

    dragCurrentY.current = e.touches[0].clientY;
    const deltaY = dragCurrentY.current - dragStartY.current;

    // Only allow dragging downwards
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (contentRef.current && contentRef.current.scrollTop > 0) return;

    const deltaY = dragCurrentY.current - dragStartY.current;

    // If dragged down more than 150px, close it. Otherwise, snap back.
    if (deltaY > 150) {
      handleClose();
    } else {
      setTranslateY(0); // Snap back to top smoothly
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 sm:items-center sm:p-4 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Global Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className="fixed right-4 top-4 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 hover:text-slate-900 sm:right-6 sm:top-6 cursor-pointer"
        aria-label="Close popup"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Modal Container */}
      <div
        className={`relative flex h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl transition-transform sm:h-auto sm:max-h-[85vh] sm:rounded-3xl ${
          mounted ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          transform: translateY > 0 ? `translateY(${translateY}px)` : undefined,
          transitionDuration: translateY > 0 ? "0ms" : "300ms",
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Drag Handle (Visual Indicator) */}
        <div className="absolute left-0 right-0 top-0 z-10 flex h-8 items-center justify-center sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-slate-200" />
        </div>

        {/* Scrollable Content Area */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto overflow-x-hidden pt-8 pb-10 sm:pt-0 overscroll-contain"
        >
          <SectionHero service={service} />
          <RequirementSelector service={service} />
          <Highlights service={service} />
          <SpaFeature service={service} />
          <StepsSection steps={steps} />
          <SetUpImage />
        </div>
      </div>
    </div>
  );
}