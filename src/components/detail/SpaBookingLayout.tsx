"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Share2,
  Menu as MenuIcon,
  X,
  Star,
} from "lucide-react";
import SubDetailPopUp from "./subdetail/mainfile";
import { DYNAMIC_DETAILS, DynamicService } from "@/src/utils/data/detailPage";
import { useCart } from "@/src/context/CartContext";

export default function SpaBookingLayout() {
  const [open, setOpen] = useState(false);
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

      const sections = activeCategories.map((cat) =>
        document.getElementById(cat.id)
      );

      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(activeCategories[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategories]);

  const handleOpenDetail = useCallback((service: DynamicService) => {
    setSelectedSubService(service);
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
    [addToCart]
  );

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setSelectedSubService(null);
  }, []);

  return (
    <div className="relative w-full bg-white pb-4">
      {/* MOBILE STICKY NAVBAR */}
      <div
        className={`fixed lg:hidden top-0 inset-x-0 z-[50] transition-transform duration-300  ${isScrolled ? "bg-white shadow-sm" : "bg-transparent"
          }`}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 -ml-2 z-9999 bg-white/90 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-900" />
            </Link>

            <h1
              className={`text-lg font-bold text-slate-900 transition-all duration-300 ${isScrolled
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
            >
              {detailData.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors">
              <Search className="w-5 h-5 text-slate-700" />
            </button>

            <button className="p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors">
              <Share2 className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Mini Category Navbar */}
        <div
          className={`border-t border-slate-100 bg-white lg:hidden ${isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
            }`}
        >
          <div className="flex overflow-x-auto hide-scrollbar px-4 py-2 gap-6 max-w-7xl mx-auto">
            {activeCategories.map(
              (cat) =>
                activeTab === cat.id && (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className="whitespace-nowrap text-sm font-semibold text-amber-600 transition-colors"
                  >
                    {cat.name}
                  </button>
                )
            )}
          </div>
        </div>
      </div>

      {/* MOBILE HERO SECTION */}
      <div className="relative block lg:hidden w-full h-50 overflow-hidden">
        <video src={detailData.video} className="w-auto absolute inset-0 h-auto"  loop autoPlay muted />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:px-8 lg:px-12 pt-20">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
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

      {/* MOBILE CATEGORIES GRID */}
      <div className="w-full block lg:hidden bg-white border-b-[8px] border-slate-50 pt-8  px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-y-8 gap-x-4 sm:grid-cols-4 md:grid-cols-6">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className="group flex cursor-pointer flex-col items-center gap-3 text-center"
              >
                <div className="relative h-[85px] w-[85px] sm:h-[100px] sm:w-[100px] overflow-hidden rounded-2xl bg-slate-100 transition-transform group-active:scale-95 shadow-sm">
                  <Image
                    src={detailData.media}
                    alt={cat.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
                <span
                  className={`text-[13px] font-medium leading-tight break-words max-w-[90px] ${activeTab === cat.id
                    ? "text-amber-600 font-bold"
                    : "text-slate-800"
                    }`}
                >
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-12">
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
                      className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-colors ${activeTab === cat.id
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
                      className={`text-[11px] font-medium leading-tight break-words max-w-[70px] transition-colors ${activeTab === cat.id
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

            <div className="flex gap-2 justify-between">
              {/* SERVICES LIST */}
              <div className="space-y-12">
                {activeCategories.map((category) => {
                  const categoryServices = activeServices.filter(
                    (s) => s.category === category.name
                  );

                  if (categoryServices.length === 0) return null;

                  return (
                    <div
                      key={category.id}
                      id={category.id}
                      className="space-y-6 scroll-mt-32"
                    >
                      <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                        {category.name}
                      </h2>

                      <div className="space-y-8">
                        {categoryServices.map((service, index) => {
                          const hasDiscount = !!(
                            service.originalPrice &&
                            service.originalPrice !== service.price
                          );

                          return (
                            <div key={service.id}>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => handleOpenDetail(service)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    handleOpenDetail(service);
                                  }
                                }}
                                className="cursor-pointer transition-opacity active:opacity-90 block"
                              >
                                {/* SPOTLIGHT LAYOUT */}
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
                                          <span className="mb-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                                            {service.tag}
                                          </span>
                                        )}
                                        <h3 className="text-xl font-bold text-slate-900 group-hover/item:text-amber-500 transition-colors">
                                          {service.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
                                          <span className="flex gap-1 text-yellow-500 font-bold">
                                            <Star className="w-4 h-4 fill-yellow-500" />
                                            {service.rating}
                                          </span>
                                          • <span>{service.reviews}</span>
                                        </p>
                                        <p className="mt-2 text-sm text-slate-800 font-medium">
                                          <span className="font-extrabold text-amber-600 text-base">
                                            {service.price}
                                          </span>
                                          {hasDiscount && (
                                            <span className="text-slate-400 line-through text-xs ml-1 font-normal">
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
                                        className="rounded-xl border border-amber-200 bg-amber-50 px-8 py-2.5 font-bold text-xs text-amber-600 shadow-xs transition-all hover:bg-amber-100 cursor-pointer active:scale-95 shrink-0"
                                      >
                                        ADD
                                      </button>
                                    </div>

                                    <ul className="mt-2 space-y-1.5 text-xs text-slate-500">
                                      {service.features.slice(0, 3).map((feat, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-3"
                                        >
                                          <span className="text-amber-500 font-bold">
                                            •
                                          </span>
                                          <span className="line-clamp-1">
                                            {feat}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : (
                                  /* STANDARD LAYOUT */
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
                                          className="absolute -bottom-4 left-1/2 flex w-10/12 -translate-x-1/2 items-center justify-center rounded-xl border border-amber-200 bg-white py-2 text-xs font-bold text-amber-600 shadow-md transition-all hover:bg-amber-50 cursor-pointer active:scale-95"
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
                                        <h3 className="text-[15px] font-bold text-slate-900 group-hover/item:text-amber-500 transition-colors">
                                          {service.title}
                                        </h3>
                                        <p className="mt-0 text-[11px] text-slate-500 flex items-center gap-1.5">
                                          <span className="flex gap-1 text-yellow-500 font-bold">
                                            <Star className="w-3 h-3 fill-yellow-500" />
                                            {service.rating}
                                          </span>
                                          • <span>{service.reviews}</span>
                                        </p>
                                        <p className="mt-0 text-[13px] text-slate-800 font-medium">
                                          <span className="font-extrabold text-amber-600 text-[13px]">
                                            {service.price}
                                          </span>
                                          {hasDiscount && (
                                            <span className="text-slate-400 line-through text-[10px] ml-1 font-normal">
                                              {service.originalPrice}
                                            </span>
                                          )}{" "}
                                          • {service.duration}
                                        </p>
                                        <p className="mt-2 text-[13px] text-slate-600 line-clamp-1">
                                          {service.features[0]}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {index !== categoryServices.length - 1 && (
                                <div className="my-8 h-px w-full bg-slate-100" />
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
          className="flex text-[15px] items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
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
              <h3 className="text-xl font-bold text-slate-900">Menu</h3>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
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
                    className={`text-[13px] font-medium leading-tight transition-colors ${activeTab === cat.id
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