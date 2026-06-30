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
  const activeSteps = [
    {
      id: "1",
      title: "Skin cleansing",
      description: "Light warm-up & breathing exercises to prepare the body.",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      title: "Gentle exfoliation",
      description: "Buff away dead skin for a smoother, brighter look.",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "3",
      title: "Glow restoration",
      description: "Nourishing care to hydrate and revive natural radiance.",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "4",
      title: "Moisture lock",
      description: "Finish with calming hydration for soft, glowing skin.",
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80",
    }
  ];

  return (
    <section className="w-full max-w-[359px] bg-white font-sans">
      {/* Heading */}
      <div className="mb-5 text-left">
        <h2 className="text-[16px] font-bold text-[#1A1A1A]">
          Procedure
        </h2>
      </div>

      {/* Pipeline Container */}
      <div className="flex flex-col">
        {activeSteps.map((step, index) => {
          const isLast = index === activeSteps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-3">
              
              {/* --- LEFT COLUMN: Pipeline Line & Number --- */}
              <div className="flex flex-col items-center">
                {/* Number Circle */}
                <div className="z-10 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#FAF5F0] text-[11px] font-bold text-[#1A1A1A]">
                  {index + 1}
                </div>
                {/* Connecting Line */}
                {!isLast && (
                  <div className="w-[1px] flex-1 bg-[#E5E5E5] my-1" />
                )}
              </div>

              {/* --- RIGHT COLUMN: Content (Title left, Image+Desc right) --- */}
              <div className={`flex flex-1 gap-2 ${isLast ? "pb-0" : "pb-7"}`}>
                
                {/* Step Title */}
                <div className=" w-[100px] shrink-0 pt-[2px]">
                  <h3 className="text-[16px] font-semibold leading-[1.2] text-[#1A1A1A] whitespace-pre-line">
                    {/* Replaces spaces with line breaks for short titles if needed, or just let it wrap naturally */}
                    {step.title}
                  </h3>
                </div>

                {/* Step Image & Description */}
                <div className="flex flex-col flex-1 gap-2">
                  <div className="relative w-full h-[177px] shrink-0 overflow-hidden rounded-[8px] bg-slate-100">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[14px] font-medium leading-[1.4] text-[#666666]">
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