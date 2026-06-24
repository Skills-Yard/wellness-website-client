import Image from "next/image";
import { ArrowRight } from "lucide-react";

const featureItems = [
  {
    id: 1,
    title: "Portable massage bed",
    image: "/images/detail/portable_massage_bed.png",
    description: "Professional-grade comfort",
  },
  {
    id: 2,
    title: "Oil diffuser & timer",
    image: "/images/detail/oil_diffuser_timer.png",
    description: "Aromatherapy perfection",
  },
  {
    id: 3,
    title: "Single-use disposables",
    image: "/images/detail/single_use_disposables.png",
    description: "Hygiene guaranteed",
  },
  {
    id: 4,
    title: "Oils, candles & flowers",
    image: "/images/detail/oils_candles_flowers.png",
    description: "Premium ambiance",
  },
];

interface SpaFeatureProps {
  service?: any;
}

export default function SpaFeature({ service }: SpaFeatureProps) {
  const bottomBanner = service?.media || "/images/detail/massage_detail.png";

  return (
    <>
      {/* Main Features Section */}
      <section className="mx-auto w-full border-b border-slate-100 px-6 py-8 sm:py-10 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              We bring the{" "}
              <span className="relative">
                spa to you
                <span className="absolute bottom-1 left-0 right-0 h-2 bg-amber-200/40 -z-10" />
              </span>
            </h2>
            <p className="text-slate-600 text-sm">
              Complete setup for an authentic spa experience from the comfort of your home
            </p>
          </div>

          {/* Hero Image */}
          <div className="group relative w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 aspect-[21/9] shadow-md">
            <Image
              src="/images/detail/spa_home_banner.png"
              alt="Spa experience at home"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {featureItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 transition-all duration-300 ease-out hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 aspect-video"
              >
                {/* Background Image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                  <div className="space-y-2 transform transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Hover Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-amber-500/20 group-hover:border-amber-400/50">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Banner Section */}
      <section className="mx-auto w-full px-6 py-8 sm:py-10 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-[21/9] shadow-lg group">
            <Image
              src={bottomBanner}
              alt="Service Banner"
              fill
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </section>
    </>
  );
}