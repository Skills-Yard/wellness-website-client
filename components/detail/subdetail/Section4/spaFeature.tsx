import Image from "next/image";

const featureItems = [
  {
    id: 1,
    title: "Portable massage bed",
    image: "/images/detail/portable_massage_bed.png",
  },
  {
    id: 2,
    title: "Oil diffuser & timer",
    image: "/images/detail/oil_diffuser_timer.png",
  },
  {
    id: 3,
    title: "Single-use disposables",
    image: "/images/detail/single_use_disposables.png",
  },
  {
    id: 4,
    title: "Oils, candles & flowers",
    image: "/images/detail/oils_candles_flowers.png",
  },
];

interface SpaFeatureProps {
  service?: any;
}

export default function SpaFeature({ service }: SpaFeatureProps) {
  const bottomBanner = service?.media || "/images/detail/massage_detail.png";

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-6 lg:py-5">
        {/* Header Section */}
        <div className="mb-4 text-start">
          <h2 className="text-2xl font-light tracking-tight text-slate-900">
            We bring the{" "}
            <span className="font-semibold text-slate-800">spa to you</span>
          </h2>
        </div>

        {/* 1. Hero Image - Just the image, no title/description */}
        <div className="group relative mb-4 w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 aspect-[21/9]">
          <Image
            src="/images/detail/spa_home_banner.png"
            alt="Spa experience at home"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* 2. Grid Section - 2x2 layout with Title Overlays */}
        <div className="grid gap-4 sm:grid-cols-2">
          {featureItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 aspect-video"
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Gradient Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6 lg:py-5">
        <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-150 relative aspect-[21/9] w-full">
          <Image
            src={bottomBanner}
            alt="Service Banner"
            fill
            className="w-full object-cover"
          />
        </div>
      </section>
    </>
  );
}
