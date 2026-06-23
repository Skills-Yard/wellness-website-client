import Image from "next/image";

const featureItems = [
  {
    id: 1,
    title: "Portable massage bed",
    image: "/images/hero-1.svg",
  },
  {
    id: 2,
    title: "Oil diffuser & timer",
    image: "/images/hero-2.svg",
  },
  {
    id: 3,
    title: "Single-use disposables",
    image: "/images/hero-3.svg",
  },
  {
    id: 4,
    title: "Oils, candles & flowers",
    image: "/images/hero-1.svg",
  },
];

export default function SpaFeature() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-2 py-12 sm:px-2 lg:px-4 lg:py-5">
        {/* Header Section */}
        <div className="mb-4 text-start sm:mb-4">
          <h2 className="text-3xl font-light tracking-tight text-slate-900 sm:text-3xl">
            We bring the{" "}
            <span className="font-semibold text-slate-800">spa to you</span>
          </h2>
        </div>

        {/* 1. Hero Image - Just the image, no title/description */}
        <div className="group relative mb-2 w-full overflow-hidden rounded-xl bg-slate-100 shadow-md aspect-[21/9]">
          <Image
            src={"/images/hero-1.svg"}
            alt="Spa experience at home"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* 2. Grid Section - 2x2 layout with Title Overlays */}
        <div className="grid gap-2 sm:grid-cols-2 lg:gap-2">
          {featureItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 aspect-video"
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col justify-end">
                <h3 className="text-lg sm:text-xl font-medium text-white tracking-wide transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl py-12 sm:px-2 lg:px-0 lg:py-5">
        <div className="bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <Image
            src="/images/detail/section4.png"
            alt="Service Banner"
            width={800}
            height={500}
            className="w-full object-cover"
          />
        </div>
      </section>
      {/* <section className="mx-auto bg-red-700 max-w-6xl px-2 py-12 sm:px-2 lg:px-0 lg:py-5">
      <div className="bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-2" >
          <h2 className="text-gray-600 text-2xl" >
            Body Massage
          </h2>
          <h1 className="text-gray-700 text-3xl">
            This is the heading
          </h1>
          <p className="text-gray-500 text-2xl">
            this is description
          </p>
      </div>
    </section> */}
    </>
  );
}
