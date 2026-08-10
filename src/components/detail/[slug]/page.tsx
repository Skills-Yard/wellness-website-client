"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import SectionHero from "./SectionHero/SectionHero";
import RequirementSelector from "./SelectPack/SelectPack";
import { DynamicService } from "@/src/utils/types/spabooking";
import { DynamicStep } from "@/src/utils/data/detailPage";

type SubDetailPopUpProps = {
  onClose: () => void;
  service: DynamicService;
  categoryName: string;
  steps: DynamicStep[];
};

export default function SubDetailPopUp({
  onClose,
  service,
  categoryName,
  steps,
}: SubDetailPopUpProps) {
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
      className={`fixed inset-0 z-70 flex items-end justify-center bg-black/80 backdrop-blur-xs transition-opacity duration-300 sm:items-center sm:p-4 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Container */}
      <div
        className={`relative flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl transition-transform sm:h-auto sm:max-h-[85vh] sm:rounded-3xl ${
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
        {/* Close Button: shifted inside the upper corner of the modal */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-60 bg-white inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 shadow-md transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mobile Drag Handle (Visual Indicator) */}
        <div className="absolute left-0 z-40 right-0 top-4 w-20 bg-slate-100 px-4 py-1 mx-auto rounded-2xl flex items-center justify-center sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-black/20" />
        </div>

        {/* Scrollable Content Area */}
        <div 
          ref={contentRef}
          className="flex-1 mb-20 overflow-y-auto hide-scrollbar overflow-x-hidden overscroll-contain sm:pt-0"
        >
          <div className="px-5 pt-5 text-xs font-semibold uppercase tracking-wider text-amber-600">
            {categoryName}
          </div>

          <SectionHero service={service} />
          
          <RequirementSelector steps={steps} />
          
        </div>
      </div>
    </div>
  );
}
