"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingCart,
  X,
  Sparkles,
  Home as HomeIcon,
  Activity,
  Flower2
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import ServiceFaq from "@/components/home/faq-accordion";
import Inspotlight from "@/components/home/in-spotlight";
import MassageServices from "@/components/home/massage";
import WellnessServices from "@/components/home/wellness";
import PhysioServices from "@/components/home/physiotherapy";

import { LOCATIONS, UNSUPPORTED_LOCATIONS, SERVICE_SUGGESTIONS } from "@/utils/data";
import WallPanel from "../wall-panel";
import WallPanelTwo from "../wall-panel-two";

export default function MobileHome() {
  const {
    location,
    setLocation,
    cartCount,
    setIsCartOpen
  } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isMounted, setIsMounted] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      type: "video",
      src: "https://assets.mixkit.co/videos/preview/mixkit-massage-therapy-in-a-beautiful-spa-salon-40176-large.mp4",
      title: "Spring '26 Collection",
      subtitle: "Bespoke spa treatments in the comfort of your home"
    },
    {
      type: "photo",
      src: "/images/slider_spa_room.png",
      title: "Luxury Massage Therapy",
      subtitle: "Certified clinical experts at your doorstep"
    },
    {
      type: "video",
      src: "https://assets.mixkit.co/videos/preview/mixkit-masseur-applying-massage-oil-on-womans-back-40170-large.mp4",
      title: "Premium Relaxation",
      subtitle: "Relieve stress, tension & fatigue instantly"
    },
    {
      type: "photo",
      src: "/images/slider_facial_glow.png",
      title: "Gold Radiance Facials",
      subtitle: "Dermatologist-approved organic beauty glow"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20);
      const scrollPos = window.scrollY + 120;
      const massageEl = document.getElementById("massage");
      const wellnessEl = document.getElementById("wellness");
      const physioEl = document.getElementById("physiotherapy");

      if (physioEl && scrollPos >= physioEl.offsetTop) {
        setActiveTab("physiotherapy");
      } else if (wellnessEl && scrollPos >= wellnessEl.offsetTop) {
        setActiveTab("wellness");
      } else if (massageEl && scrollPos >= massageEl.offsetTop) {
        setActiveTab("massage");
      } else {
        setActiveTab("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id === "top" ? "home" : id);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70; // Mobile header height offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const allSuggestions = [
    ...SERVICE_SUGGESTIONS.Massage,
    ...SERVICE_SUGGESTIONS.Wellness,
    ...SERVICE_SUGGESTIONS.Physiotherapy,
  ];

  const filteredSuggestions = searchQuery
    ? allSuggestions.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : allSuggestions.slice(0, 8);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchFocused(false);

    let targetId = "";
    if (SERVICE_SUGGESTIONS.Massage.includes(suggestion)) {
      targetId = "massage";
    } else if (SERVICE_SUGGESTIONS.Wellness.includes(suggestion)) {
      targetId = "wellness";
    } else if (SERVICE_SUGGESTIONS.Physiotherapy.includes(suggestion)) {
      targetId = "physiotherapy";
    }

    if (targetId) {
      scrollToSection(targetId);
    }
  };

  const mobileCategories = [
    {
      id: "massage",
      label: "Massage Therapy",
      image: "/images/3d_massage.png",
      target: "massage",
      badge: "Popular",
      badgeColor: "bg-amber-500",
    },
    {
      id: "wellness",
      label: "Wellness & Spa",
      image: "/images/3d_wellness.png",
      target: "wellness",
      badge: "New",
      badgeColor: "bg-emerald-500",
    },
    {
      id: "physio",
      label: "Physiotherapy",
      image: "/images/3d_physio.png",
      target: "physiotherapy",
      badge: "Certified",
      badgeColor: "bg-blue-500",
    },
    {
      id: "facial",
      label: "All Services",
      image: "/images/wellness_facial.png",
      target: "wellness",
      badge: "Spa",
      badgeColor: "bg-purple-500",
    }
  ];

  return (
    <div className="bg-stone-50/50 min-h-screen pb-24 relative">
      {/* Mobile Sticky Top Header Container */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-30 transition-all duration-300 px-4",
        headerScrolled
          ? "bg-white border-b border-stone-150 shadow-xs pt-2.5 pb-2.5 text-stone-900"
          : "bg-gradient-to-b from-black/80 via-black/35 to-transparent pt-5 pb-4 text-white"
      )}>
        {/* Top Row: Location & Cart */}
        <div className={cn(
          "flex items-center justify-between transition-all duration-300 ease-in-out",
          headerScrolled ? "max-h-0 opacity-0 mb-0 pointer-events-none" : "max-h-16 opacity-100 mb-4"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col cursor-pointer max-w-[80%]">
                <span className="text-[9px] text-amber-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  In 15 minutes
                </span>
                <span className="text-[12px] font-bold text-white flex items-center gap-1 truncate mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{isMounted ? location : LOCATIONS[0]}</span>
                  <ChevronDown className="w-3 h-3 text-stone-300 shrink-0" />
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 rounded-2xl p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border-gray-100 bg-white z-50">
              <div className="px-2.5 py-1 text-[10px] font-bold text-amber-600 bg-amber-50/50 rounded-lg select-none mb-1">
                Active Areas
              </div>
              {LOCATIONS.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={cn(
                    "cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors",
                    location === loc && "bg-amber-50 text-amber-600 font-medium focus:bg-amber-50 focus:text-amber-600"
                  )}
                >
                  <MapPin className="w-3.5 h-3.5 opacity-50 shrink-0 text-emerald-500" />
                  <span className="truncate">{loc}</span>
                </DropdownMenuItem>
              ))}
              <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 rounded-lg select-none mt-2.5 mb-1 border-t border-gray-50 pt-2">
                Coming Soon
              </div>
              {UNSUPPORTED_LOCATIONS.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={cn(
                    "cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 focus:bg-gray-50 focus:text-gray-900 transition-colors",
                    location === loc && "bg-amber-50 text-amber-600 font-medium"
                  )}
                >
                  <MapPin className="w-3.5 h-3.5 opacity-50 shrink-0 text-gray-300" />
                  <span className="truncate">{loc}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Shopping Cart Trigger */}
          <Button
            onClick={() => setIsCartOpen(true)}
            variant="outline"
            size="icon"
            className="relative w-9 h-9 rounded-full bg-white hover:bg-stone-50 border-none text-gray-900 cursor-pointer shadow-sm shrink-0 flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 text-stone-900" />
            {isMounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] font-extrabold text-white flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        {/* Search Row */}
        <div className=" relative">
          <div className="flex items-center h-10 px-3.5 gap-2 rounded-xl bg-white border border-stone-250/30 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <Input
              placeholder="Search for massage, facial, physiotherapy..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchFocused(true); }}
              onFocus={() => setSearchFocused(true)}
              className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none border-none shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 min-w-0"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="cursor-pointer">
                <X className="w-4 h-4 text-stone-400 hover:text-stone-600" />
              </button>
            )}
          </div>

          {/* Auto Suggestions popup */}
          {searchFocused && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 z-50 p-1.5 max-h-[250px] overflow-y-auto">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-stone-50 mb-1">
                <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Services List</span>
                <button
                  type="button"
                  onClick={() => setSearchFocused(false)}
                  className="text-xs text-stone-500 font-bold hover:text-stone-800"
                >
                  Close
                </button>
              </div>
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
              {searchQuery && filteredSuggestions.length === 0 && (
                <p className="text-xs text-stone-400 py-4 text-center">No results found for "{searchQuery}"</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video & Photo Hero Slider */}
      <div className="relative w-full h-[240px] bg-neutral-950 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            {slide.type === "video" ? (
              <video
                src={slide.src}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover animate-fade-in duration-500"
              />
            ) : (
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={index === 0}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Dark Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

            {/* Slide Content Overlay */}
            <div className="absolute bottom-4 left-5 right-5 text-white space-y-1 z-20">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md text-amber-100">
                {slide.title}
              </h2>
              <p className="text-white/80 text-[11px] sm:text-xs font-semibold drop-shadow-sm max-w-[85%]">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Navigation Indicator Dots */}
        <div className="absolute bottom-4 right-2 z-20 flex gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full border border-white/5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                index === currentSlide ? "bg-amber-400 w-3.5" : "bg-white/40"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categories Overlapping Grid */}
      <div className="mx-4 mt-5 relative z-20 bg-white ">
        <div className="grid grid-cols-4 gap-x-2 gap-y-5">
          {mobileCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.target)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-sm bg-stone-100 group-hover:bg-amber-50/30 flex items-center justify-center overflow-hidden border border-stone-100/40 shadow-2xs group-hover:border-amber-200 transition-all duration-300">
                {cat.badge && (
                  <span className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 text-[7px] uppercase font-black text-white px-1.5 py-0.5 rounded-b-md leading-none tracking-wider scale-90",
                    cat.badgeColor
                  )}>
                    {cat.badge}
                  </span>
                )}
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={48}
                  height={48}
                  className="object-contain p-1"
                />
              </div>
              <span className="text-[10px] font-extrabold text-stone-600 text-center leading-tight mt-1.5 group-hover:text-amber-500 transition-colors line-clamp-2">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling Sections Content */}
      <div className="space-y-2 mt-4">
        <Inspotlight />
        <MassageServices />
        <WallPanel />
        <WellnessServices />
        <WallPanelTwo />
        <PhysioServices />
        <ServiceFaq />
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-100 flex justify-around py-2.5 px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-4">
        <button
          onClick={() => scrollToSection("top")}
          className={cn(
            "flex flex-col items-center gap-1 flex-1 py-1 transition-colors cursor-pointer",
            activeTab === "home" || activeTab === "top" ? "text-amber-500" : "text-stone-400"
          )}
        >
          <HomeIcon className="w-4.5 h-4.5" />
          <span className="text-[9px] font-bold">Home</span>
        </button>

        <button
          onClick={() => scrollToSection("massage")}
          className={cn(
            "flex flex-col items-center gap-1 flex-1 py-1 transition-colors cursor-pointer",
            activeTab === "massage" ? "text-amber-500" : "text-stone-400"
          )}
        >
          <Flower2 className="w-4.5 h-4.5" />
          <span className="text-[9px] font-bold">Massage</span>
        </button>

        <button
          onClick={() => scrollToSection("wellness")}
          className={cn(
            "flex flex-col items-center gap-1 flex-1 py-1 transition-colors cursor-pointer",
            activeTab === "wellness" ? "text-emerald-500" : "text-stone-400"
          )}
        >
          <Sparkles className="w-4.5 h-4.5" />
          <span className="text-[9px] font-bold">Wellness</span>
        </button>

        <button
          onClick={() => scrollToSection("physiotherapy")}
          className={cn(
            "flex flex-col items-center gap-1 flex-1 py-1 transition-colors cursor-pointer",
            activeTab === "physiotherapy" ? "text-blue-500" : "text-stone-400"
          )}
        >
          <Activity className="w-4.5 h-4.5" />
          <span className="text-[9px] font-bold">Physio</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 flex-1 py-1 text-stone-400 transition-colors cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingCart className="w-4.5 h-4.5" />
            {isMounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 text-[8px] font-extrabold text-white flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold">Cart</span>
        </button>
      </div>
    </div>
  );
}
