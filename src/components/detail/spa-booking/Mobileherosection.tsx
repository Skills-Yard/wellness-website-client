interface MobileHeroSectionProps {
  videoSrc: string;
  title?: string;
  subtitle?: string;
}

export default function MobileHeroSection({
  videoSrc,
  title,
  subtitle,
}: MobileHeroSectionProps) {
  return (
    <div className="relative block w-full lg:hidden h-60 xs:h-[280px] sm:h-74.25 overflow-hidden bg-linear-to-br from-[#FFC09E] via-[#FFD1BF]/33 to-transparent">
      <video
        src={videoSrc}
        className="w-full absolute inset-0 h-full object-cover"
        loop
        autoPlay
        muted
      />
      <div className="absolute flex justify-between bottom-0 p-3 xs:p-4 inset-x-0 pt-16 xs:pt-20">
        <div className="pr-2">
          <h1 className="text-base xs:text-lg sm:text-xl font-bold text-[#25180F] mb-1.5 xs:mb-2 tracking-tight leading-tight">
            {title || "Stress Relief Starts Here"}
          </h1>
          <p className="text-xs xs:text-sm text-[#ffffff] font-semibold leading-tight">
            {subtitle || "Body therapies designed for you"}
          </p>
        </div>
        {/* Custom Horizontal Carousel Indicators */}
        <div className="flex gap-1 xs:gap-1.5 items-end justify-end shrink-0">
          <span className="w-4 xs:w-5 h-1 xs:h-1.5 rounded-full bg-white transition-all" />
          <span className="w-1 xs:w-1.5 h-1 xs:h-1.5 rounded-full bg-white/40 transition-all" />
          <span className="w-1 xs:w-1.5 h-1 xs:h-1.5 rounded-full bg-white/40 transition-all" />
        </div>
      </div>
    </div>
  );
}
