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
  // Dummy data fallback matching the provided screenshot context
  const activeSteps = steps || [
    {
      id: "1",
      title: "Skin cleansing",
      description: "Light warm-up & breathing exercises to prepare the body.",
      image:
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      title: "Gentle exfoliation",
      description: "Buff away dead skin for a smoother, brighter look.",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "3",
      title: "Glow restoration",
      description: "Nourishing care to hydrate and revive natural radiance.",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "4",
      title: "Moisture lock",
      description: "Finish with calming hydration for soft, glowing skin.",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <section className="w-full max-w-[359px] md:max-w-[700px] lg:max-w-[1000px] md:mx-auto bg-white font-sans">
      {/* Heading */}
      <div className="mb-5 md:mb-8 lg:mb-10 text-left">
        <h2 className="text-[16px] md:text-[22px] lg:text-[28px] font-bold text-[#1A1A1A]">
          Procedure
        </h2>
      </div>

      {/* Pipeline Container */}
      <div className="flex flex-col">
        {activeSteps.map((step, index) => {
          const isLast = index === activeSteps.length - 1;

          return (
            <div
              key={step.id}
              className="relative flex gap-3 md:gap-5 lg:gap-8"
            >
              {/* --- LEFT COLUMN: Pipeline Line & Number --- */}
              <div className="flex flex-col items-center">
                {/* Number Circle */}
                <div className="z-10 flex h-[20px] w-[20px] md:h-[28px] md:w-[28px] lg:h-[36px] lg:w-[36px] shrink-0 items-center justify-center rounded-full bg-[#FAF5F0] text-[11px] md:text-[14px] lg:text-[16px] font-bold text-[#1A1A1A]">
                  {index + 1}
                </div>
                {/* Connecting Line */}
                {!isLast && (
                  <div className="w-[1px] flex-1 bg-[#E5E5E5] my-1 md:my-2" />
                )}
              </div>

              {/* --- RIGHT COLUMN: Content (Title left, Image+Desc right) --- */}
              <div
                className={`flex flex-1 gap-2 md:gap-6 lg:gap-10 ${isLast ? "pb-0" : "pb-7 md:pb-10 lg:pb-14"}`}
              >
                {/* Step Title */}
                <div className="w-[100px] md:w-[160px] lg:w-[220px] shrink-0 pt-[2px] md:pt-1 lg:pt-2">
                  <h3 className="text-[16px] md:text-[20px] lg:text-[24px] font-semibold leading-[1.2] text-[#1A1A1A] whitespace-pre-line">
                    {step.title}
                  </h3>
                </div>

                {/* Step Image & Description */}
                <div className="flex flex-col items-center lg:flex-row flex-1 gap-2 md:gap-4 lg:gap-4 lg:items-baseline">
                  <div className="relative w-full lg:w-[400px] h-[177px] md:h-[300px] lg:h-[240px] shrink-0 overflow-hidden rounded-[8px] bg-slate-100">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 768px) 220px, (max-width: 1024px) 500px, 400px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[14px] md:text-[16px] lg:text-[18px] font-medium leading-[1.4] text-[#666666] lg:flex-1">
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
