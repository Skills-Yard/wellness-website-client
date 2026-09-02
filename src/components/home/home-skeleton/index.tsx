// Shimmer placeholder shown while the home page is resolving a zone and/or
// fetching home details — replaces the brief flash of "No services
// available" that used to show between those two steps (see page.tsx).
// Mirrors CategoryServices' own card shimmer so the transition into real
// content doesn't visibly jump.
export default function HomeSkeleton() {
  const cardShimmer = (key: number) => (
    <div
      key={key}
      className="w-[168px] shrink-0 sm:w-[calc((100%-16px)/3)] lg:w-[calc((100%-32px)/5)]"
    >
      <div className="aspect-[168/97] rounded-[7px] bg-stone-100" />
      <div className="mt-2 h-4 w-3/4 rounded bg-stone-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-stone-100" />
    </div>
  );

  return (
    <main
      className="relative w-full overflow-x-hidden flex-1 flex flex-col"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading services…</span>
      {/* Single shimmer sweep across the whole placeholder tree. */}
      <span className="pointer-events-none absolute inset-0 z-10 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:hidden" />

      {/* ───────── DESKTOP ───────── */}
      <div className="hidden md:block">
        <div className="w-full bg-gradient-to-b from-white to-stone-50/30 py-10 lg:py-16 border-b border-stone-100/50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="flex-1 w-full space-y-4">
                <div className="h-4 w-32 rounded-full bg-stone-100" />
                <div className="h-10 w-3/4 rounded bg-stone-100" />
                <div className="h-10 w-1/2 rounded bg-stone-100" />
                <div className="h-4 w-full max-w-md rounded bg-stone-100" />
                <div className="mt-4 h-11 w-40 rounded-xl bg-stone-100" />
              </div>
              <div className="aspect-[4/3] w-full flex-1 rounded-3xl bg-stone-100" />
            </div>
          </div>
        </div>

        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div
            key={sectionIndex}
            className="w-full max-w-7xl mx-auto border-b border-stone-100 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4 sm:mb-7">
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-stone-100" />
                <div className="h-7 w-48 rounded bg-stone-100" />
              </div>
              <div className="h-4 w-12 rounded bg-stone-100" />
            </div>
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 5 }).map((_, cardIndex) => cardShimmer(cardIndex))}
            </div>
          </div>
        ))}
      </div>

      {/* ───────── MOBILE ───────── */}
      <div className="block space-y-8 px-4 pb-6 pt-24 md:hidden">
        <div className="h-40 w-full rounded-2xl bg-stone-100" />
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <div className="h-5 w-40 rounded bg-stone-100" />
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div key={cardIndex} className="w-[45vw] shrink-0">
                  <div className="aspect-[168/97] rounded-[7px] bg-stone-100" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-stone-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
