"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Menu as MenuIcon,
  X,
  Star,
} from "lucide-react";
import SubDetailPopUp from "./subdetail/mainfile";
import { DYNAMIC_DETAILS, DynamicService } from "@/src/utils/data/detailPage";
import { useCart } from "@/src/context/CartContext";

export default function SpaBookingLayout() {
  const [open, setOpen] = useState(true);
  const [selectedSubService, setSelectedSubService] =
    useState<DynamicService | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "massage";
  const { addToCart } = useCart();

  const normalizedType =
    typeParam === "physiotherapy" || typeParam === "physio"
      ? "physio"
      : typeParam;

  const detailData =
    DYNAMIC_DETAILS[normalizedType] || DYNAMIC_DETAILS["massage"];
  const activeCategories = detailData.categories;
  const activeServices = detailData.services;

  // Handle Initial Load with ID
  useEffect(() => {
    const idParam = searchParams.get("id");

    if (idParam && activeServices.length > 0) {
      const prefix =
        normalizedType === "physio"
          ? "p"
          : normalizedType === "massage"
            ? "m"
            : "w";

      const targetId = `${prefix}-s${idParam}`;
      const foundService = activeServices.find((s) => s.id === targetId);

      if (foundService) {
        setSelectedSubService(foundService);
        setOpen(true);
      }
    }
  }, [searchParams, activeServices, normalizedType]);

  // Handle Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);

      const headerOffset = 150;
      let currentActiveTab = "";

      for (const cat of activeCategories) {
        const section = document.getElementById(cat.id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            currentActiveTab = cat.id;
          }
        }
      }

      if (currentActiveTab) {
        setActiveTab(currentActiveTab);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategories]);

  const handleOpenDetail = useCallback((service: DynamicService) => {
    setSelectedSubService(service);
    console.log("clicked");
    setOpen(true);
  }, []);

  const scrollToCategory = useCallback((id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);

    if (element) {
      const headerOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }, []);

  const handleAddToCart = useCallback(
    (service: DynamicService) => {
      addToCart({
        id: service.id,
        title: service.title,
        price: parseInt(service.price.replace(/[^\d]/g, "")),
        image: service.media,
        duration: service.duration,
      });
    },
    [addToCart],
  );

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setSelectedSubService(null);
  }, []);

  return (
    <div className="relative w-full bg-white pb-20">
      {/* MOBILE STICKY NAVBAR */}
      <div
        className={`fixed lg:hidden top-0 inset-x-0 z-[50] transition-colors duration-300  ${
          isScrolled ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 -ml-2 z-[9999] w-[33px] h-[33px] text-center flex items-center justify-center bg-[#FFFFFF] rounded-[5px] hover:bg-slate-100 transition-colors border border-[#EDEDED]"
            >
              <ArrowLeft className="w-[20px] h-[16px] text-[#000000]" />
            </Link>

            <h1
              className={`text-[16px] font-bold text-[#000000] transition-all duration-300 ${
                isScrolled
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              {detailData.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-center flex items-center justify-center w-[33px] h-[33px] bg-[#ffffff] rounded-[5px] hover:bg-slate-100 transition-colors border border-[#EDEDED]">
              <Search className="w-[19px] h-[19px] text-[#4B5563]" />
            </button>
          </div>
        </div>

        {/* Mini Category Navbar */}
        <div
          className={`border-t border-[#F3EFEB] bg-white lg:hidden transition-all duration-300 ${
            isScrolled
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex overflow-x-auto hide-scrollbar px-4 py-2 gap-6 max-w-7xl mx-auto">
            {activeCategories.map(
              (cat) =>
                activeTab === cat.id && (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className="whitespace-nowrap text-[14px] font-bold text-[#D38516] transition-colors"
                  >
                    {cat.name}
                  </button>
                ),
            )}
          </div>
        </div>
      </div>

      {/* MOBILE HERO SECTION (REVERTED TO PREVIOUS CODE) */}
      <div className="relative block w-full lg:hidden h-[297px] overflow-hidden bg-gradient-to-br from-[#FFC09E] via-[#FFD1BF]/33 to-transparent">
        <video
          src={detailData.video}
          className="w-full absolute inset-0 h-full object-cover"
          loop
          autoPlay
          muted
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /> */}
       <div className="absolute flex justify-between bottom-0 p-[16px] inset-x-0 pt-20">
        <div>
          <h1 className="text-[20px] font-bold text-[#25180F] mb-[8px] tracking-tight leading-[22px]">
            Stress Relief Starts Here
          </h1>
          <p className="text-[14px] text-[#ffffff] font-semibold leading-[17px]">
            Body therapies designed for you
          </p>
        </div>
          {/* Custom Horizontal Carousel Indicators */}
          <div className="flex gap-1.5 items-end justify-end">
            <span className="w-5 h-1.5 rounded-full bg-white transition-all" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 transition-all" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 transition-all" />
          </div>
        </div>
      </div>

      {/* MOBILE CATEGORIES GRID */}
      <div className="w-full block lg:hidden bg-white pt-8 px-4 sm:px-6">
        <div className="max-w-[390px] mx-auto">
          <h2 className="text-[20px] font-bold text-[#000000] mb-[12px] leading-[23px]">
            {detailData.title}
          </h2>
          <div className="flex items-center gap-1.5 text-[12px] mb-[12px] text-[#666666] leading-[14px]">
            <Star className="w-3 h-3 fill-[#FFB818] text-[#FFB818]" />
            <span className="font-bold text-[#000000]">{detailData.rating}</span>
            <span>({detailData.reviews} bookings)</span>
          </div>
          <p className="text-[#666666]">
            Find balance, relax your mind & body.
          </p>

          <div className="grid mt-[40px] grid-cols-3 gap-x-4 gap-y-6">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className="group flex cursor-pointer flex-col items-center gap-2.5 text-center"
              >
                <div className="relative h-[96px] w-[96px] overflow-hidden rounded-[25px] bg-[#FEF3F1] border border-[#FDF6F4] shadow-xs transition-transform group-active:scale-95 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={detailData.media}
                      alt={cat.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <span
                  className={`text-[14px] font-medium leading-[17px] text-center break-words max-w-[96px] transition-colors ${
                    activeTab === cat.id
                      ? "text-[#D38516] font-bold"
                      : "text-[#000000]"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="block lg:hidden my-8 border-b-[8px] border-[#F3EFEB] w-full" />

      {/* MAIN CONTENT */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:pt-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          
          {/* LEFT SIDEBAR - CATEGORIES */}
          <div className="hidden lg:block w-full shrink-0 lg:sticky lg:top-24 lg:w-[280px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Service
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className="group flex cursor-pointer flex-col items-center gap-2 text-center transition-transform hover:scale-105"
                  >
                    <div
                      className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-colors ${
                        activeTab === cat.id
                          ? "border-amber-500"
                          : "border-slate-200"
                      }`}
                    >
                      <Image
                        src={detailData.media}
                        alt={cat.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <span
                      className={`text-[11px] font-medium leading-tight break-words max-w-[70px] transition-colors ${
                        activeTab === cat.id
                          ? "text-amber-600"
                          : "text-slate-700"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN - SERVICES */}
          <div className="flex-1 flex flex-col">
            {/* DESKTOP HERO */}
            <div className="hidden lg:block relative w-full h-[350px] xl:h-[400px] bg-slate-900 overflow-hidden rounded-3xl shadow-sm mb-12">
              <Image
                src={detailData.media || "/images/hero-fallback.jpg"}
                alt={detailData.title}
                fill
                priority
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-14 w-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center pl-1 border border-white/50 shadow-lg">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent" />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:px-8 lg:px-12 pt-20">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                  {detailData.title}
                </h1>
                <p className="flex items-center text-sm sm:text-base text-slate-200">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1.5" />
                  <span className="font-bold text-white mr-1.5">
                    {detailData.rating}
                  </span>
                  ({detailData.reviews})
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-between">
              {/* SERVICES LIST */}
              <div className="space-y-12 flex-1">
                {activeCategories.map((category) => {
                  const categoryServices = activeServices.filter(
                    (s) => s.category === category.name,
                  );

                  if (categoryServices.length === 0) return null;

                  return (
                    <div
                      key={category.id}
                      id={category.id}
                      className="space-y-6 scroll-mt-24 lg:scroll-mt-32"
                    >
                      <h2 className="text-[20px] font-bold text-[#000000] border-b border-[#F3EFEB] pb-3 leading-[23px]">
                        {category.name}
                      </h2>

                      <div className="space-y-8">
                        {categoryServices.map((service, index) => {
                          const hasDiscount = !!(
                            service.originalPrice &&
                            service.originalPrice !== service.price
                          );

                          // Mobile Layout Flag: First item OR explicitly set as spotlight
                          const isSpotlightMobile = index === 0 || service.isSpotlight;

                          return (
                            <div
                              onClick={() => handleOpenDetail(service)}
                              key={service.id}
                              className="cursor-pointer transition-opacity active:opacity-90 block group/item"
                            >
                              {/* MOBILE LAYOUT SYSTEM */}
                              <div className="flex flex-col lg:hidden w-full">
                                {isSpotlightMobile ? (
                                  /* SPOTLIGHT (FIRST ITEM) */
                                  <div className="flex flex-col w-full gap-3">
                                    <div className="relative w-full aspect-[16/7] overflow-hidden rounded-lg bg-slate-100 shadow-xs">
                                      <Image
                                        src={service.media}
                                        alt={service.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>

                                    <div className="flex flex-col">
                                      {service.tag && (
                                        <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#208900]">
                                          {service.tag}
                                        </span>
                                      )}
                                      
                                      <div className="flex justify-between items-start w-full">
                                        <div className="flex flex-col max-w-[calc(100%-85px)]">
                                          <h3 className="text-[16px] font-medium text-[#000000] leading-tight">
                                            {service.title}
                                          </h3>
                                          
                                          <p className="mt-0.5 text-[12px] text-[#666666] flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 fill-[#FFB818] text-[#FFB818]" />
                                            <span className="font-medium">{service.rating}</span>
                                            <span>({service.reviews})</span>
                                          </p>

                                          <p className="mt-1 text-[14px] text-[#000000] font-medium flex items-center gap-1.5">
                                            <span>{service.price}</span>
                                            {hasDiscount && (
                                              <span className="text-[12px] text-[#666666] line-through font-normal">
                                                {service.originalPrice}
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                        
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(service);
                                          }}
                                          className="w-[76px] h-[35px] bg-[#25180F] text-white rounded-[4px] font-medium text-[16px] shrink-0 active:scale-95 transition-transform"
                                        >
                                          Book
                                        </button>
                                      </div>

                                      <div className="mt-2 flex flex-col gap-1.5">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDetail(service);
                                          }}
                                          className="w-fit text-[12px] font-medium text-[#D38516]"
                                        >
                                          View details
                                        </button>
                                        <ul className="text-[14px] text-[#666666] font-medium leading-[1.4] space-y-1">
                                          {service.features?.slice(0, 3).map((feat, i) => (
                                            <li key={i} className="flex items-start gap-1.5">
                                              <span className="w-1 h-1 rounded-full bg-[#666666] shrink-0 mt-[7px]" />
                                              <span>{feat}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* STANDARD (OTHER ITEMS) */
                                  <div className="flex gap-4 w-full">
                                    <div className="relative shrink-0 w-[150px] sm:w-[194px] h-[120px] sm:h-[139px] overflow-hidden rounded-lg bg-slate-100 shadow-xs">
                                      <Image
                                        src={service.media}
                                        alt={service.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>

                                    <div className="flex flex-col flex-1 justify-between py-0.5">
                                      <div className="flex flex-col">
                                        <h3 className="text-[14px] font-medium text-[#000000] leading-snug">
                                          {service.title}
                                        </h3>
                                        
                                        <p className="mt-1 text-[12px] text-[#666666] flex items-center gap-1">
                                          <Star className="w-3.5 h-3.5 fill-[#FFB818] text-[#FFB818]" />
                                          <span className="font-medium">{service.rating}</span>
                                          <span className="truncate">({service.reviews})</span>
                                        </p>

                                        <p className="mt-1 text-[14px] text-[#000000] font-medium flex items-center gap-1.5">
                                          <span>{service.price}</span>
                                          {hasDiscount && (
                                            <span className="text-[12px] text-[#666666] line-through font-normal">
                                              {service.originalPrice}
                                            </span>
                                          )}
                                        </p>
                                        
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDetail(service);
                                          }}
                                          className="mt-1 w-fit text-[12px] font-medium text-[#D38516]"
                                        >
                                          View details
                                        </button>
                                      </div>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddToCart(service);
                                        }}
                                        className="mt-2 w-[76px] h-[35px] bg-[#25180F] text-white rounded-[4px] font-medium text-[16px] shrink-0 active:scale-95 transition-transform"
                                      >
                                        Book
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* DESKTOP LAYOUT SYSTEM */}
                              <div className="hidden lg:block w-full">
                                {service.isSpotlight ? (
                                  <div className="flex flex-col group/item">
                                    <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-xs">
                                      <Image
                                        src={service.media}
                                        alt={service.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                                      />
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        {service.tag && (
                                          <span className="mb-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#208900] bg-[#EAFDE1] px-2 py-0.5 rounded-md">
                                            {service.tag}
                                          </span>
                                        )}
                                        <h3 className="text-xl font-bold text-[#000000] group-hover/item:text-[#D38516] transition-colors">
                                          {service.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-[#666666] flex items-center gap-1.5">
                                          <span className="flex gap-1 text-[#FFB818] font-bold">
                                            <Star className="w-4 h-4 fill-[#FFB818]" />
                                            {service.rating}
                                          </span>
                                          • <span>{service.reviews}</span>
                                        </p>
                                        <p className="mt-2 text-sm text-[#000000] font-medium">
                                          <span className="font-extrabold text-[#D38516] text-base">
                                            {service.price}
                                          </span>
                                          {hasDiscount && (
                                            <span className="text-[#666666] line-through text-xs ml-1 font-normal">
                                              {service.originalPrice}
                                            </span>
                                          )}{" "}
                                          • {service.duration}
                                        </p>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddToCart(service);
                                        }}
                                        className="rounded-xl border border-[#E8CCBE] bg-[#FEF6F3] px-8 py-2.5 font-bold text-xs text-[#D38516] shadow-xs transition-all hover:bg-[#FDE9DD] cursor-pointer active:scale-95 shrink-0"
                                      >
                                        ADD
                                      </button>
                                    </div>
                                    <ul className="mt-2 space-y-1.5 text-xs text-slate-500">
                                      {service.features?.slice(0, 3).map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                          <span className="text-amber-500 font-bold">•</span>
                                          <span className="line-clamp-1">{feat}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="mt-1 flex pt-0">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenDetail(service);
                                        }}
                                        className="sm:w-auto cursor-pointer px-0 py-1 text-[11px] font-bold text-[#D38516] transition-all hover:opacity-75 active:scale-95"
                                      >
                                        More details
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col justify-between gap-6 group/item">
                                    <div className="flex gap-4">
                                      <div className="relative mt-2 h-[145px] w-[120px] shrink-0">
                                        <div className="h-full w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                                          <Image
                                            src={service.media}
                                            alt={service.title}
                                            fill
                                            className="object-cover rounded-xl"
                                          />
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(service);
                                          }}
                                          className="absolute -bottom-4 left-1/2 flex w-10/12 -translate-x-1/2 items-center justify-center rounded-xl border border-[#E8CCBE] bg-white py-2 text-xs font-bold text-[#D38516] shadow-md transition-all hover:bg-[#FEF6F3] cursor-pointer active:scale-95"
                                        >
                                          ADD
                                        </button>
                                      </div>
                                      <div className="flex-1">
                                        {service.tag && (
                                          <span className="mb-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                                            {service.tag}
                                          </span>
                                        )}
                                        <h3 className="text-[15px] font-bold text-[#000000] group-hover/item:text-[#D38516] transition-colors">
                                          {service.title}
                                        </h3>
                                        <p className="mt-0 text-[11px] text-[#666666] flex items-center gap-1.5">
                                          <span className="flex gap-1 text-[#FFB818] font-bold">
                                            <Star className="w-3 h-3 fill-[#FFB818]" />
                                            {service.rating}
                                          </span>
                                          • <span>{service.reviews}</span>
                                        </p>
                                        <p className="mt-0 text-[13px] text-[#000000] font-medium">
                                          <span className="font-extrabold text-[#D38516] text-[13px]">
                                            {service.price}
                                          </span>
                                          {hasDiscount && (
                                            <span className="text-[#666666] line-through text-[10px] ml-1 font-normal">
                                              {service.originalPrice}
                                            </span>
                                          )}{" "}
                                          • {service.duration}
                                        </p>
                                        <p className="mt-2 text-[13px] text-[#666666] line-clamp-1">
                                          {service.features[0]}
                                        </p>
                                        <div className="mt-1 flex pt-0">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenDetail(service);
                                            }}
                                            className="sm:w-auto cursor-pointer px-0 py-1 text-[11px] font-bold text-[#D38516] transition-all hover:opacity-75 active:scale-95"
                                          >
                                            More details
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {index !== categoryServices.length - 1 && (
                                <div className="mt-6 mb-8 h-px w-full bg-[#F3EFEB]" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT SIDEBAR - PROMISE BOX */}
              <div className="hidden lg:flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:w-[300px] xl:w-[320px] self-start">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Vellora Promise
                    </h3>
                    <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-[10px] font-extrabold text-amber-600">
                      100%
                    </div>
                  </div>
                  <ul className="space-y-3 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-extrabold">✓</span>
                      4.8+ Rated Certified Therapists
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-extrabold">✓</span>
                      Complete Relaxation Assured
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-extrabold">✓</span>
                      Natural & Skin-Safe Organic Products
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500 font-extrabold">✓</span>
                      Single-Use Disposables for Hygiene
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING MENU BUTTON - MOBILE ONLY */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex text-[15px] items-center gap-2 bg-[#25180F] text-white px-6 py-3 rounded-full font-bold shadow-xl shadow-black/20 active:scale-95 transition-transform"
        >
          <MenuIcon className="w-4 h-4" />
          Menu
        </button>
      </div>

      {/* MOBILE MENU MODAL */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 pb-12 animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#000000]">Menu</h3>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 bg-[#F5F5F5] rounded-full text-[#666666] hover:bg-[#E8E8E8] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 max-h-[60vh] overflow-y-auto">
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className="group flex cursor-pointer flex-col items-center gap-3 text-center transition-transform active:scale-95"
                >
                  <div className="relative h-[85px] w-[85px] sm:h-[100px] sm:w-[100px] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                    <Image
                      src={detailData.media}
                      alt={cat.name}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>

                  <span
                    className={`text-[13px] font-medium leading-tight transition-colors ${
                      activeTab === cat.id
                        ? "bg-amber-50 text-amber-600"
                        : "text-slate-700"
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SERVICE DETAIL MODAL */}
      {open && selectedSubService && (
        <SubDetailPopUp
          service={selectedSubService}
          steps={detailData.steps as unknown as []}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}