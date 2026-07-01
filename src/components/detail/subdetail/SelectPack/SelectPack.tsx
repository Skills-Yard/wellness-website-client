"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import StepsSection from "../StepSection/SectionSteps";

interface RequirementSelectorProps {
  onSelectionChange?: (data: any) => void;
  steps: [];
}

export default function RequirementSelector({
  onSelectionChange,
  steps,
}: RequirementSelectorProps) {
  // State for selections based on the image's layout
  const [selectedDuration, setSelectedDuration] = useState("60 mins");
  const [selectedPack, setSelectedPack] = useState("1 Sessions");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState(null);

  // Static durations mapping
  const durations = [
    { id: "60 mins", price: "₹1,199" },
    { id: "90 mins", price: "₹2,199" },
  ];

  // Base price selection configuration based on duration
  const basePrice = selectedDuration === "60 mins" ? 1199 : 2199;

  // Dynamic packs calculation based on selected duration base price
  const packs = [
    {
      id: "1 Sessions",
      price: `₹${basePrice.toLocaleString("en-IN")}`,
      perSession: `(₹${basePrice.toLocaleString("en-IN")}/session)`,
      numericPrice: basePrice,
    },
    {
      id: "4 Sessions",
      price: `₹${Math.round(basePrice * 4 * 0.9).toLocaleString("en-IN")}`,
      originalPrice: `₹${(basePrice * 4).toLocaleString("en-IN")}`,
      discount: "10% off",
      perSession: `(₹${Math.round((basePrice * 4 * 0.9) / 4).toLocaleString("en-IN")}/session)`,
      numericPrice: Math.round(basePrice * 4 * 0.9),
    },
    {
      id: "8 Sessions",
      price:
        basePrice === 1199
          ? "₹8,316"
          : `₹${Math.round(basePrice * 8 * 0.9).toLocaleString("en-IN")}`,
      originalPrice:
        basePrice === 1199
          ? "₹8,996"
          : `₹${(basePrice * 8).toLocaleString("en-IN")}`,
      discount: "10% off",
      perSession:
        basePrice === 1199
          ? "(₹1,039/session)"
          : `(₹${Math.round((basePrice * 8 * 0.9) / 8).toLocaleString("en-IN")}/session)`,
      numericPrice: basePrice === 1199 ? 8316 : Math.round(basePrice * 8 * 0.9),
    },
  ];

  const treatments = [
    {
      id: 1,
      title: "Skin Preparation",
      imgSrc:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "Exfoliation Therapy",
      imgSrc:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "Scrub Application",
      imgSrc:
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      title: "Moisture & Relaxation",
      imgSrc:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const disclaimerItems = [
    "Avoid with active rashes, cuts, or skin sensitivity.",
    "Choose comfortable clothing for a relaxing experience.",
    "Hydrate your skin and avoid strong skincare products.",
  ];

  const addons = [
    { id: "Meditation Session", price: "+₹299", icon: "🧘", numericPrice: 299 },
    {
      id: "Personalized Diet Plan",
      price: "+₹399",
      icon: "🥗",
      numericPrice: 399,
    },
  ];

  const items = [
    {
      name: "Essential Oils",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Linen Towels",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Nourishing Scrub",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Moisturizer",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Props",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
  ];

  // Dummy data representing the "What's Included" items
  const includedItems = [
    {
      title: "Miraquill Sensory Oil",
      description: "Infused with Lavendar Essential Oil to calm the senses.",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Head Massage Oil",
      description: "Infused with Lavendar Essential Oil to calm the senses.",
      img: "https://images.unsplash.com/photo-1608248593842-8d76e73686da?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Hydrating Gel",
      description: "Infused with Lavendar Essential Oil to calm the senses.",
      img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Relief Balm",
      description: "Infused with Lavendar Essential Oil to calm the senses.",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=150&q=80",
    },
  ];

  // Dummy data representing the FAQs
  const faqs = [
    {
      question: "How often should I get this spa?",
      answer:
        "For optimal results and relaxation, we recommend getting this spa treatment once every 2 to 4 weeks.",
    },
    {
      question: "What are the benefits of this spa?",
      answer:
        "It deeply hydrates your skin, relieves muscle tension, reduces stress, and improves blood circulation.",
    },
    {
      question: "Is it suitable for sensitive skin?",
      answer:
        "Yes, our products are infused with natural lavender essential oils which are generally safe and soothing for sensitive skin.",
    },
    {
      question: "Can I shower immediately after?",
      answer:
        "We recommend waiting at least 2 hours before taking a shower with lukewarm water to let the oils absorb.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Calculate Total Dynamic Price (Selected Pack + Selected Addons)
  const packPriceNum =
    packs.find((p) => p.id === selectedPack)?.numericPrice || 0;
  const addonsPriceNum = selectedAddons.reduce((sum, addonId) => {
    const addon = addons.find((a) => a.id === addonId);
    return sum + (addon ? addon.numericPrice : 0);
  }, 0);

  const currentPrice = `₹${(packPriceNum + addonsPriceNum).toLocaleString("en-IN")}`;

  // Helper to toggle add-ons
  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  return (
    <>
      <section className="mx-auto w-full max-w-md md:max-w-4xl lg:max-w-6xl bg-white sm:p-4 md:p-6 lg:p-8 pt-[24px] px-[16px] font-sans text-slate-800 pb-[90px]">
        {/* --- DESKTOP GRID CONTAINER --- */}
        <div className="flex flex-col md:flex-row md:gap-12 lg:gap-10">
          {/* --- LEFT COLUMN (Selections) --- */}
          <div className="flex-1 w-full flex flex-col">
            {/* --- DURATION SECTION --- */}
            <div className="mb-6">
              <h3 className="mb-3 text-[16px] md:text-lg lg:text-xl font-semibold text-[#000000]">
                Select duration
              </h3>
              <div className="flex gap-[12px]">
                {durations.map((duration) => {
                  const isSelected = selectedDuration === duration.id;
                  return (
                    <button
                      key={duration.id}
                      onClick={() => setSelectedDuration(duration.id)}
                      className={`flex flex-col h-[60px] md:h-[72px] w-[86px] rounded-[8px] items-start border p-3 text-left transition-colors sm:w-24 md:w-32 md:p-4 ${
                        isSelected
                          ? "border-[#D38516] bg-[#FDFBF8]"
                          : "border-[#000000]/25 bg-[#FDFBF8] hover:border-slate-400"
                      }`}
                    >
                      <span className="text-xs md:text-sm font-medium text-[#000000]">
                        {duration.id}
                      </span>
                      <span
                        className={`text-sm md:text-base font-semibold mt-auto ${
                          isSelected ? "text-[#D38516]" : "text-[#666666]"
                        }`}
                      >
                        {duration.id === "60 mins" ? "₹1,199" : "₹2,199"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --- PACK SECTION --- */}
            <div className="w-full font-sans bg-white">
              {/* Title Header (Matches Frame 289) */}
              <div className="flex flex-row items-center justify-start gap-1 p-0 mb-4 h-[23px]">
                <h3 className="text-[20px] font-semibold leading-tight text-black m-0">
                  Select a pack
                </h3>
                <span className="text-[14px] font-medium leading-tight text-[#904720]">
                  (Save more)
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex gap-[10px] overflow-x-auto pb-2 scrollbar-hide">
                {packs.map((pack) => {
                  const isSelected = selectedPack === pack.id;

                  return (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPack(pack.id)}
                      // Width 113px, Height 138px matching Frames 193/194/195
                      className={`box-border flex flex-col items-start shrink-0 w-[113px] h-[138px] p-[12px] rounded-[8px] text-left transition-colors
                ${
                  isSelected
                    ? "bg-[#FDFBF8] border border-[#904720] gap-[12px]" // Frame 193 Active
                    : "bg-[#FFFFFF] border border-[#BFBFBF] justify-center gap-[10px]" // Frame 194/195 Inactive
                }
              `}
                    >
                      {/* Session Title */}
                      <span className="text-[14px] font-medium leading-tight text-black">
                        {pack.id}
                      </span>

                      {/* Price Container */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[16px] font-medium leading-tight text-black">
                          {pack.price}
                        </span>

                        {/* Original Price */}
                        {pack.originalPrice && (
                          <span className="text-[14px] font-medium leading-tight text-[#808080] line-through">
                            {pack.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Discount Tag */}
                      {pack.discount && (
                        <span className="text-[14px] font-medium leading-tight text-[#1E9E13]">
                          {pack.discount}
                        </span>
                      )}

                      {/* Per Session text - Pushed to bottom using mt-auto if active, natural stack if inactive */}
                      <span
                        className={`text-[12px] font-medium leading-tight text-[#808080] ${isSelected ? "mt-auto" : ""}`}
                      >
                        {pack.perSession}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tailwind Utility for hiding scrollbar if needed globally */}
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
            </div>

            {/* --- ADD-ONS SECTION --- */}
            <div className="mt-[24px] md:mt-[40px]">
              <h3 className="mb-3 text-[20px] md:text-base lg:text-lg font-semibold text-slate-900 flex items-center gap-2">
                Add-ons
                <span className="text-[12px] md:text-sm font-normal text-slate-400">
                  (Optional)
                </span>
              </h3>
              <div className="space-y-2 md:space-y-3 md:max-w-lg lg:max-w-xl">
                {addons.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex w-[100%] h-[36px] md:h-[48px] items-center justify-between rounded-[8px] border p-3 md:px-4 transition-colors ${
                        isSelected
                          ? "border-amber-400 bg-amber-50/30"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-sm md:text-lg">{addon.icon}</span>
                        <span className="text-[14px] md:text-sm lg:text-base font-medium text-slate-700">
                          {addon.id}
                        </span>
                      </div>
                      <span className="text-[14px] md:text-sm font-semibold text-slate-800">
                        {addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (Meta & Highlights for Desktop) --- */}
          <div className="w-full md:w-[280px] lg:w-[350px] shrink-0 mt-[24px] md:mt-0 flex flex-col md:sticky md:top-24 self-start">
            {/* --- FEATURES SECTION --- */}
            <div className="rounded-xl md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-sm">
              <h3 className="mb-3 text-[20px] md:text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Features
              </h3>
              <ul className="space-y-[10px] mt-[12px]">
                {[
                  "Certified yoga experts",
                  "Personalized session at home",
                  "Safe for all age groups",
                ].map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-[16px] md:text-[16px] text-slate-700"
                  >
                    <ChevronRight
                      className="h-3 w-3 md:h-4 md:w-4 text-amber-500 shrink-0"
                      strokeWidth={3}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* --- SEPARATOR --- */}
        <div className="my-[40px]  h-px w-full bg-[#F3EFEB]" />

        <section className="font-sans px-[16px] w-full bg-white">
          {/* Overview Title */}
          <h2 className="text-[20px] font-semibold leading-[1.16] text-[#000000] mb-3">
            Overview
          </h2>

          {/* Overview Description */}
          <p className="text-[14px] font-medium leading-[1.16] text-[#666666] mb-8 max-w-[357px]">
            Luxurious full body spa including head & feet massage using Guasha
            techniques to relax muscles, detoxify, and reduce stress.
          </p>

          {/* Services Grid */}
          {/* gap-x-[14px] calculated from left:16px and left:202px with 172px width */}
          <div className="grid grid-cols-2 gap-x-[14px] gap-y-8">
            {treatments.map((item) => (
              <div key={item.id} className="flex flex-col items-center w-full">
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="w-full h-[124px] object-cover rounded-lg"
                  // Note: rounded-lg in Tailwind is 8px by default, matching your CSS
                />
                <h3 className="mt-3 text-[16px] font-medium leading-[1.16] text-[#000000] text-center w-full">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* --- PROCEDURE STEPS COMPONENT --- */}
        <div className="w-full">
          <StepsSection steps={steps} />
        </div>

        {/* --- SEPARATOR --- */}
        <div className="my-[40px]  h-px w-full bg-[#F3EFEB]" />

        {/* ---Disclaimer--- */}
        <div className="w-full max-w-[358px] md:max-w-[700px] lg:max-w-[1000px] md:mx-auto flex flex-col items-start p-0 gap-4 md:gap-6 lg:gap-8 bg-white font-sans">
          {/* Disclaimer Title */}
          <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold leading-[1.16] text-[#000000] tracking-tight m-0">
            Disclaimer
          </h3>

          {/* Lists Layout */}
          <ul className="w-full p-0 m-0 space-y-3 md:space-y-4 lg:space-y-5 list-none">
            {disclaimerItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 md:gap-3 lg:gap-4 text-[14px] md:text-[16px] lg:text-[18px] font-medium leading-[1.16] md:leading-[1.4] text-[#000000]"
              >
                {/* Custom styled check mark mirroring the brown tint screenshot line */}
                <Check
                  className="mt-[3px] md:mt-[4px] lg:mt-[5px] h-[17px] w-[17px] md:h-[20px] md:w-[20px] lg:h-[24px] lg:w-[24px] shrink-0 text-[#8B5A2B]"
                  strokeWidth={2.5}
                />
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- SEPARATOR --- */}
        <div className="my-[40px]  h-px w-full bg-[#F3EFEB]" />

        {/* --- Item Used --- */}
        <div className="w-[358px] bg-white font-sans">
          {/* Title */}
          <h2 className="text-[20px] font-semibold text-[#000000] mb-5">
            Items Used
          </h2>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-3 gap-x-[8px] gap-y-[18px]">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Image Container with soft pink background */}
                <div className="w-[114px] h-[103px] bg-[#FEF4F4] rounded-[12px] flex items-center justify-center mb-2.5">
                  <img
                    src={item.img}
                    alt={item.name}
                    // mix-blend-multiply helps white-background placeholder images blend into the pink box
                    className="w-full h-full object-cover rounded-md mix-blend-multiply"
                  />
                </div>

                {/* Item Label */}
                <span className="text-[13px] font-medium text-[#000000] text-center leading-tight px-1">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Divider Line (visible in the screenshot) */}
          <div className="mt-8 border-b border-gray-100 w-full"></div>
        </div>

        {/* --- SEPARATOR --- */}
        <div className="my-[40px]  h-px w-full bg-[#F3EFEB]" />

        <div className="w-[359px] min-h-[412px] flex flex-col font-sans bg-white pt-4">
          {/* --- Skilled Professionals Section --- */}
          <h2 className="text-[20px] font-semibold leading-tight text-black mb-7">
            Our Skilled Professionals
          </h2>

          {/* Card Container (Gradient Background) */}
          <div className="relative w-full rounded-[12px] px-4 py-5 bg-gradient-to-r from-[#FFF0E6] to-[#FADBD8] mb-8">
            {/* Badge */}
            <div className="inline-block bg-white text-[#8A4A24] text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-[4px] mb-4 shadow-sm">
              VELLORA EXPERTS
            </div>

            {/* Card List Items */}
            <ul className="flex flex-col gap-3 w-[60%] relative z-10">
              {[
                "Trained & experienced professionals",
                "Customize Service as per your preference",
                "Certified Experts",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[14px] font-medium text-[#8A4A24] leading-[1.2]"
                >
                  {/* Check Icon */}
                  <svg
                    className="w-[14px] h-[14px] shrink-0 mt-[2px] text-[#8A4A24]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* Absolute Positioned Image popping out of the top */}
            {/* Note: Replace src with your transparent background expert image */}
            <img
              src="/images/subDetail/skilledProfessional.png"
              className="absolute bottom-0 right-0 w-[171px] h-[120%] object-cover object-top rounded-br-[12px]"
            />
          </div>

          {/* --- Pre & Post Care Section --- */}
          <h2 className="text-[20px] font-semibold leading-tight text-black mb-4">
            Pre & Post Care
          </h2>

          <ul className="flex flex-col gap-3">
            {[
              "Avoid heavy meal before & after massage.",
              "Drink plenty of water before & after the service.",
              "Shower after 2 hours with lukewarm water.",
            ].map((text, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[15px] font-medium text-black leading-snug"
              >
                {/* Check Icon */}
                <svg
                  className="w-[16px] h-[16px] shrink-0 mt-[3px] text-[#904720]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- SEPARATOR --- */}
        <div className="my-[40px]  h-px w-full bg-[#F3EFEB]" />

        {/* ---Include and FAQ's--- */}
        <div className="w-[359px] bg-white font-sans py-2">
          {/* --- What's Included Section --- */}
          <h2 className="text-[17px] font-bold text-[#1A1A1A] mb-5 tracking-tight">
            What's Included
          </h2>

          <div className="flex flex-col gap-5">
            {includedItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start gap-4"
              >
                {/* Text Content */}
                <div className="flex flex-col pt-1 flex-1">
                  <h3 className="text-[13px] font-bold text-[#1A1A1A] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-medium text-[#666666] leading-[1.4]">
                    {item.description}
                  </p>
                </div>

                {/* Image Box */}
                <div className="w-[72px] h-[72px] shrink-0 bg-[#FEF4F4] rounded-[10px] flex items-center justify-center p-1.5">
                  <img
                    src={item.img}
                    alt={item.title}
                    // mix-blend-multiply removes white backgrounds from placeholder images
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* --- Divider --- */}
          <div className="w-full h-[1px] bg-[#F0F0F0] my-8"></div>

          {/* --- FAQs Section --- */}
          <h2 className="text-[17px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
            FAQs
          </h2>

          <div className="flex flex-col">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={index} className="border-b border-[#F0F0F0]">
                  {/* Question Header */}
                  <div
                    className="flex items-center justify-between py-3.5 cursor-pointer group"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="text-[12px] font-semibold text-[#1A1A1A] pr-4">
                      {faq.question}
                    </span>
                    {/* Chevron Icon */}
                    <svg
                      className={`w-3.5 h-3.5 text-[#1A1A1A] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Answer Content (Animated Collapse) */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 pb-3"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-medium text-[#666666] leading-[1.5]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- SEPARATOR --- */}
        <div className="my-[40px]  h-px w-full bg-[#F3EFEB]" />

        {/* Trusted and Loved */}
        <div className="w-[358px] bg-white font-sans py-4">
          {/* Title */}
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-5 tracking-tight">
            Trusted & loved
          </h2>

          {/* Bullet Points */}
          <ul className="flex flex-col gap-3.5 mb-8">
            {/* Item 1 */}
            <li className="flex items-center gap-2.5">
              {/* Heart Icon */}
              <svg
                className="w-[18px] h-[18px] text-[#8E4A23] shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-[14px] font-medium text-[#1A1A1A]">
                Gentle yoga postures
              </span>
            </li>

            {/* Item 2 */}
            <li className="flex items-center gap-2.5">
              {/* Badge/Medal Icon */}
              <svg
                className="w-[18px] h-[18px] text-[#8E4A23] shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1L9 5H4v5L1 12l3 4v5h5l3 4 3-4h5v-5l3-4-3-4V5h-5L12 1zm0 15c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1-6.5v1H9v1h2v1h1v-1h2v-1h-2v-1h-1z" />
              </svg>
              <span className="text-[14px] font-medium text-[#1A1A1A]">
                Certified and experienced experts
              </span>
            </li>

            {/* Item 3 */}
            <li className="flex items-center gap-2.5">
              {/* Star Icon */}
              <svg
                className="w-[18px] h-[18px] text-[#8E4A23] shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="text-[14px] font-medium text-[#1A1A1A]">
                4.8 average customer rating
              </span>
            </li>
          </ul>

          {/* Review Card */}
          {/* bg-gradient creates the subtle pinkish/peach glow on the left side */}
          <div className="w-full border border-[#F0F0F0] rounded-[10px] bg-gradient-to-br from-[#FFF0F0] via-white to-white p-4 shadow-sm">
            {/* Header Row: Avatar, Name, Date, Rating */}
            <div className="flex items-start justify-between">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80"
                  alt="Karan Sharma"
                  className="w-[42px] h-[42px] rounded-full object-cover shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-[#1A1A1A] leading-tight mb-0.5">
                    Karan Sharma
                  </span>
                  <span className="text-[12px] font-medium text-[#666666] leading-tight">
                    Jun 18, 2026
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 text-[#FF9900]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="text-[12px] font-medium text-[#666666]">
                  4.7
                </span>
              </div>
            </div>

            {/* Review Text */}
            <p className="mt-3.5 text-[13px] font-medium text-[#1A1A1A] leading-[1.5]">
              Amazing experience! The instructor was patient and explained every
              pose so well. Felt so relaxed and light.
            </p>
          </div>
        </div>
      </section>

      {/* --- FLOATING BOTTOM ACTION BAR --- */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <div className="w-full max-w-[390px] md:max-w-full md:px-8 lg:px-12 mx-auto">
          <div className="flex h-[70px] pb-4 w-full flex-col items-start justify-center gap-[10px] border-t border-black/25 bg-white p-[10px_16px] md:rounded-none  shadow-2xl md:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex h-[50px] w-full items-center justify-between px-[10px] md:max-w-4xl lg:max-w-6xl md:mx-auto">
              {/* Dynamic Price Display */}
              <div className="flex flex-col items-start justify-center gap-2">
                <span className="h-[23px] text-[20px] font-medium leading-[1.16] text-black">
                  {currentPrice}
                </span>
                <span className="h-[14px] text-[12px] font-normal leading-[1.16] text-[#666666]">
                  Total Amount
                </span>
              </div>

              {/* Action Button */}
              <button className="flex h-[50px] w-[187px] md:w-[220px] items-center justify-center gap-[10px] rounded-[9px] bg-[#0F0F0E] px-[63px] py-[17px] transition-transform active:scale-95 hover:bg-black/80">
                <span className="text-[14px] font-medium leading-[1.16] text-white">
                  Continue
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
