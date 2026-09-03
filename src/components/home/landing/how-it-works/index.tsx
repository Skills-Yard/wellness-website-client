"use client";

import Image from "next/image";
import { stepsData } from "@/src/utils/data/stepData";
import SectionHeading from "../section-heading";

// Figma "Frame 396": a soft-cream rounded-32 panel with four steps in a
// row, joined by dashed connectors on desktop.
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full scroll-mt-[80px] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Choose a service"
          title="How it works"
          align="left"
        />

        <div className="mt-10 rounded-[32px] bg-[#FCF9F7] px-6 py-14 sm:px-10">
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {stepsData.map((step, i) => (
              <li
                key={step.id}
                className="relative flex flex-col items-center text-center"
              >
                {i < stepsData.length - 1 && (
                  <span className="absolute left-[calc(50%+45px)] top-8 hidden h-px w-[calc(100%-90px)] border-t-2 border-dashed border-brown/35 lg:block" />
                )}
                <div className="relative h-[66px] w-[66px] overflow-hidden rounded-full bg-white">
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    sizes="66px"
                    className="object-cover"
                  />
                </div>
                <span className="mt-3 text-[12px] font-medium text-brand-strong">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 text-[14px] font-medium text-[#6B4B22]">
                  {step.title}
                </h3>
                <p className="mt-1 max-w-[170px] text-[12px] leading-[1.25] text-muted-ink">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
