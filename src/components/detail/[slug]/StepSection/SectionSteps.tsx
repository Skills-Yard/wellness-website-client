import Image from "next/image";
import React from "react";

interface StepsSectionProps {
  steps?: {
    id: string;
    title: string;
    description: string;
    image: string;
  }[];
}

export default function StepsSection({ steps }: StepsSectionProps) {
  const activeSteps = steps ?? [];
  if (activeSteps.length === 0) return null;

  // This popup is capped at max-w-4xl (~896px, see mainfile.tsx) at every
  // breakpoint from sm: up — its own rendered width stops growing right
  // around md: (768px viewport), not lg: (1024px). So "desktop" here
  // means md:, not lg: — a `lg:` trigger would sit past the point where
  // this container ever actually gets any wider, and never fire.
  //
  // Below md: the original vertical "pipeline" — numbered circle +
  // connecting line on the left, title/image/description stacked on the
  // right. From md: up: a 3-column card grid instead (number badge moves
  // onto the image, no connecting line — a grid has no "next" to connect
  // to) — 3 columns, not 2, now that the popup itself is a bit wider,
  // keeps each card (and its fixed-height image) about the same size as
  // before instead of stretching wider to fill the extra room.
  return (
    <section className="w-full max-w-[359px] md:max-w-none bg-white font-sans">
      {/* Heading */}
      <div className="mb-5 md:mb-6 text-left">
        <h2 className="text-[16px] md:text-[20px] font-bold text-[#1A1A1A]">
          Procedure
        </h2>
      </div>

      {/* Pipeline Container (mobile) / Card grid (md+) */}
      <div className="flex flex-col md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-8">
        {activeSteps.map((step, index) => {
          const isLast = index === activeSteps.length - 1;

          return (
            <div
              key={step.id}
              className="relative flex gap-3 md:block"
            >
              {/* --- LEFT COLUMN: Pipeline Line & Number (hidden at md —
                  the number moves onto the image itself instead, see
                  below) --- */}
              <div className="flex flex-col items-center md:hidden">
                <div className="z-10 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#FAF5F0] text-[11px] font-bold text-[#1A1A1A]">
                  {index + 1}
                </div>
                {/* Connecting Line */}
                {!isLast && (
                  <div className="w-[1px] flex-1 bg-[#E5E5E5] my-1" />
                )}
              </div>

              {/* --- RIGHT COLUMN: Content --- */}
              <div
                className={`flex flex-1 gap-2 md:flex-col md:gap-2.5 ${isLast ? "pb-0" : "pb-7"} md:pb-0`}
              >
                {/* Step Title — shown here (left of the image) on mobile;
                    moves under the image at md: (card layout). */}
                <div className="w-[100px] md:hidden shrink-0 pt-[2px]">
                  <h3 className="text-[16px] font-semibold leading-[1.2] text-[#1A1A1A] whitespace-pre-line">
                    {step.title}
                  </h3>
                </div>

                <div className="flex flex-col flex-1 gap-2 md:gap-2.5">
                  <div className="relative w-full h-[150px] md:h-[150px] shrink-0 overflow-hidden rounded-[8px] md:rounded-xl bg-slate-100">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      // Mobile: full column width (~330px). md+: one of 3
                      // columns inside the ~896px-capped popup, so roughly
                      // ~260px per card.
                      sizes="(max-width: 767px) 330px, 260px"
                      className="object-cover"
                    />
                    <span className="absolute left-2.5 top-2.5 z-10 hidden h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-[#1A1A1A] shadow-sm backdrop-blur-sm md:flex">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="hidden text-[15px] font-semibold leading-[1.2] text-[#1A1A1A] md:block">
                    {step.title}
                  </h3>
                  <p className="text-[14px] md:text-[13px] font-medium leading-[1.4] text-[#666666]">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
