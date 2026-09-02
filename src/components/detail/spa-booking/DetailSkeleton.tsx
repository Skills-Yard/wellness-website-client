// Shimmer placeholder shown while this category page is resolving a zone
// and fetching its categories/services (see the loading checks in
// index.tsx). Mirrors the real layout — mobile hero + category chips + row
// cards, desktop sidebar + hero + row cards — so there's no visible jump
// once the real content swaps in, and no more plain "Loading..." text.
export default function DetailSkeleton() {
  const mobileRow = (key: number) => (
    <div key={key} className="flex h-[139px] w-full gap-4">
      <div className="h-[139px] w-[194px] shrink-0 rounded-lg bg-stone-100" />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-1">
        <div className="h-4 w-3/4 rounded bg-stone-100" />
        <div className="h-3 w-1/2 rounded bg-stone-100" />
        <div className="h-4 w-1/3 rounded bg-stone-100" />
        <div className="mt-2 h-[35px] w-[76px] rounded bg-stone-100" />
      </div>
    </div>
  );

  const desktopRow = (key: number) => (
    <div key={key} className="flex gap-4">
      <div className="mt-2 h-36.25 w-30 shrink-0 rounded-2xl bg-stone-100" />
      <div className="flex-1 space-y-2.5 pt-1">
        <div className="h-4 w-2/3 rounded bg-stone-100" />
        <div className="h-3 w-1/3 rounded bg-stone-100" />
        <div className="h-3.5 w-1/4 rounded bg-stone-100" />
        <div className="h-3 w-1/2 rounded bg-stone-100" />
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full overflow-hidden bg-white pb-20"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading services…</span>
      <span className="pointer-events-none absolute inset-0 z-10 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:hidden" />

      {/* ───────── MOBILE ───────── */}
      <div className="lg:hidden">
        <div className="h-64 w-full bg-stone-100" />
        <div className="flex gap-4 overflow-hidden px-4 py-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex shrink-0 flex-col items-center gap-1.5">
              <div className="h-14 w-14 rounded-full bg-stone-100" />
              <div className="h-2.5 w-12 rounded bg-stone-100" />
            </div>
          ))}
        </div>
        <div className="space-y-6 px-4">
          {Array.from({ length: 3 }).map((_, index) => mobileRow(index))}
        </div>
      </div>

      {/* ───────── DESKTOP ───────── */}
      <div className="mx-auto hidden w-full max-w-7xl px-4 pt-12 sm:px-6 lg:block lg:px-8">
        <div className="flex items-start gap-8">
          <div className="w-56 shrink-0 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-stone-100" />
                <div className="h-3 w-24 rounded bg-stone-100" />
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-8">
            <div className="h-72 w-full rounded-3xl bg-stone-100" />
            <div className="flex justify-between gap-6">
              <div className="flex-1 space-y-10">
                <div className="space-y-6">
                  <div className="h-5 w-40 rounded bg-stone-100" />
                  {Array.from({ length: 3 }).map((_, index) => desktopRow(index))}
                </div>
              </div>
              <div className="hidden w-72 shrink-0 rounded-2xl bg-stone-100 md:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
