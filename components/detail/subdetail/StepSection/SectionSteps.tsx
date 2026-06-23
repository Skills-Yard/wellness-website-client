import { stepsData } from "@/utils/data/stepData";
import Image from "next/image";
import SetUpImage from "./SetUpImage";

export default function StepsSection() {
  return (
    <>
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Optional Heading */}
      <div className="mb-12 text-center sm:text-left">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-slate-500">
          Your premium relaxation journey in four simple steps.
        </p>
      </div>

      {/* Pipeline Container */}
      <div className="relative">
        {stepsData.map((step, index) => {
          // Check if it's the last item so we don't draw the line past it
          const isLast = index === stepsData.length - 1;

          return (
            <div key={step.id} className="group relative flex gap-6 sm:gap-8">
              
              {/* --- LEFT COLUMN: Pipeline Line & Number --- */}
              <div className="relative flex flex-col items-center">
                {/* The Number Circle */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-lg font-semibold text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                  {index + 1}
                </div>
                
                {/* The Connecting Line (Hidden on the last step) */}
                {!isLast && (
                  <div className="absolute top-12 bottom-0 w-0.5 bg-slate-200 h-full" />
                )}
              </div>

              {/* --- RIGHT COLUMN: Content (Flex Col) --- */}
              {/* pb-16 gives breathing room between the steps */}
              <div className={`flex flex-col pt-1.5 ${isLast ? "pb-0" : "pb-16 sm:pb-20"}`}>
                
                {/* Title & Description */}
                <div className="mb-6 flex flex-col gap-2">
                  <h3 className="text-xl font-medium text-slate-900 sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="max-w-xl text-base text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Image */}
                <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-100 transition-all duration-300 group-hover:shadow-md">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
    </>
  );
}