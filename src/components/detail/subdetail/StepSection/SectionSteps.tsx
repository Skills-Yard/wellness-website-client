import Image from "next/image";

interface StepsSectionProps {
  steps: {
    id: string;
    title: string;
    description: string;
    image: string;
  }[];
}

export default function StepsSection({ steps }: StepsSectionProps) {
  const activeSteps = steps || [];

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Optional Heading */}
        <div className="mb-[24px] text-left sm:text-left">
          <h2 className="text-[16px] font-medium tracking-tight text-slate-900 sm:text-4xl">
            Procedure
          </h2>
        </div>

        {/* Pipeline Container */}
        <div className="relative">
          {activeSteps.map((step, index) => {
            // Check if it's the last item so we don't draw the line past it
            const isLast = index === activeSteps.length - 1;

            return (
              <div
                key={step.id}
                className="group relative flex gap-[8px] sm:gap-8"
              >
                {/* --- LEFT COLUMN: Pipeline Line & Number --- */}
                <div className="relative flex flex-col items-center">
                  {/* The Number Circle */}
                  <div className="relative z-10 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border border-white bg-[#FAF5F0] text-[12px] font-semibold text-[#000000] shadow-sm transition-transform duration-300 group-hover:scale-110">
                    {index + 1}
                  </div>

                  {/* The Connecting Line (Hidden on the last step) */}
                  {!isLast && (
                    <div className="absolute top-12 bottom-0 w-0.5 bg-slate-200 h-full" />
                  )}
                </div>

                {/* --- RIGHT COLUMN: Content (Flex Col) --- */}
                {/* pb-16 gives breathing room between the steps */}
                <div
                  className={`flex w-full gap-7  ${isLast ? "pb-0" : "pb-[24px] sm:pb-20"}`}
                >
                  {/* Title & Description */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[14px] line-clamp-1 font-medium text-slate-900 sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="max-w-xl line-clamp-3 text-[12px] text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Image */}
                  <div className="relative shrink-0 w-[75px] h-[83px] overflow-hidden rounded-[8px] bg-slate-100 border border-slate-100/50 shadow-xs transition-all duration-300 group-hover:shadow-md">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="75px"
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
