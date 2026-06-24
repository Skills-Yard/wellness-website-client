"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import PromoCard from "@/components/service/promo-card";
import { promoCards } from "@/utils/data/service-page";
import { useCart } from "@/context/CartContext";
import {
  massageCategories,
  massageServices,
  coupons,
  whyChooseUsList,
} from "@/utils/data/service-page";
import { ServiceItem, Coupon } from "@/types/service-page";
import {
  Check,
  Clock3,
  Plus,
  Minus,
  ShieldCheck,
  Ticket,
  Star,
  Sparkles,
  ShoppingBag,
  Percent,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ServicePage() {
  const promoIndexRef = useRef(0);
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const [activeCategory, setActiveCategory] = useState(massageCategories[0]?.id ?? "");
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  
  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const isScrollingRef = useRef(false);

  // Cart helper functions
  const getServiceQuantity = (id: string) => {
    return cartItems.find((item) => item.id === id)?.quantity ?? 0;
  };

  const handleAddService = (service: ServiceItem) => {
    addToCart({
      id: service.id,
      title: service.name,
      price: service.currentPrice,
      duration: service.duration,
      image: service.thumbnail.src,
    });
  };

  const handleUpdateQuantity = (serviceId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(serviceId);
      return;
    }

    const service = massageServices.find((s) => s.id === serviceId);
    if (!service) return;

    const currentItem = cartItems.find((item) => item.id === serviceId);
    const currentQty = currentItem?.quantity ?? 0;

    if (newQty > currentQty) {
      // Increment
      addToCart({
        id: service.id,
        title: service.name,
        price: service.currentPrice,
        duration: service.duration,
        image: service.thumbnail.src,
      });
    } else if (newQty < currentQty) {
      // Decrement
      removeFromCart(serviceId);
      for (let i = 0; i < newQty; i++) {
        addToCart({
          id: service.id,
          title: service.name,
          price: service.currentPrice,
          duration: service.duration,
          image: service.thumbnail.src,
        });
      }
    }
  };

  // Toggle detail expansion
  const toggleExpand = (serviceId: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  // Scroll to category
  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    isScrollingRef.current = true;
    const element = document.getElementById(`category-${id}`);
    if (element) {
      const yOffset = -90; // offset to clear sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      // Reset scroll block flag after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  // Scroll spy to update active category
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      const scrollPosition = window.scrollY + 150;

      for (const category of massageCategories) {
        const el = document.getElementById(`category-${category.id}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate cart prices
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalDurationMin = cartItems.reduce((sum, item) => {
    const minVal = parseInt(item.duration.replace(/[^0-9]/g, "")) || 0;
    return sum + minVal * item.quantity;
  }, 0);

  // Validate coupon when cart amount changes
  useEffect(() => {
    if (appliedCoupon && cartSubtotal < appliedCoupon.minOrderValue) {
      setAppliedCoupon(null);
      setCouponSuccess("");
      setCouponError(`Coupon removed. Minimum order value of ₹${appliedCoupon.minOrderValue} required.`);
    }
  }, [cartSubtotal, appliedCoupon]);

  const handleApplyCoupon = (code: string) => {
    setCouponError("");
    setCouponSuccess("");

    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!coupon) {
      setCouponError("Invalid coupon code.");
      return;
    }

    if (cartSubtotal < coupon.minOrderValue) {
      setCouponError(`Minimum order value of ₹${coupon.minOrderValue} required.`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`Coupon "${coupon.code}" applied successfully!`);
    setCouponInput("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess("");
    setCouponError("");
  };

  // Calculate coupon discount
  let couponDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.type === "fixed") {
      couponDiscount = appliedCoupon.discount;
    } else {
      couponDiscount = Math.round((cartSubtotal * appliedCoupon.discount) / 100);
      if (appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount) {
        couponDiscount = appliedCoupon.maxDiscount;
      }
    }
    // Prevent discount from exceeding subtotal
    if (couponDiscount > cartSubtotal) {
      couponDiscount = cartSubtotal;
    }
  }

  const grandTotal = cartSubtotal - couponDiscount;

  // Checkout trigger
  const handleCheckout = () => {
    alert("Booking success! Our certified therapists will reach your location shortly.");
    clearCart();
    setAppliedCoupon(null);
    setCouponSuccess("");
  };

  // Badge stylings helper
  const getBadgeStyle = (badge?: string) => {
    return "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white border-none shadow-sm";
  };

  const getBadgeLabel = (badge?: string) => {
    if (!badge) return "";
    return badge.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  return (
    <div className="bg-white text-[#64748B] min-h-screen pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* HERO SECTION BANNER */}
        <section className="relative min-h-[380px] md:min-h-[440px] overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-2xl flex flex-col justify-end p-6 md:p-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner_massage.png"
              alt="Massage at Home Hero"
              fill
              priority
              className="object-cover object-center opacity-70 scale-105 transition-transform duration-1000"
            />
            {/* Soft dark vignette overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-[#0F172A]/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/30 to-transparent" />
          </div>

          {/* Hero details container */}
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white border-none shadow-sm text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Home Service Available</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-sm">
              Massage at Home
            </h1>

            <p className="text-base md:text-xl text-slate-200 font-medium">
              Professional therapists. Zero commute.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 stroke-none" />
                4.85
                <span className="text-slate-400 font-normal">(47.3K+ reviews)</span>
              </span>
              <span className="text-slate-500">|</span>
              <span className="font-semibold text-white">🏆 2.5L+ bookings</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Clock3 className="w-3.5 h-3.5" /> 20 min onwards
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  Starting From
                </p>
                <h2 className="text-3xl font-extrabold text-white">
                  ₹399
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => scrollToCategory(massageCategories[0].id)}
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 px-6 rounded-xl cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all border-none"
                >
                  Book Now
                </Button>
                <Button
                  onClick={() => scrollToCategory(massageCategories[0].id)}
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 text-white hover:bg-white/20 font-semibold h-12 px-6 rounded-xl cursor-pointer"
                >
                  View All Services
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* THREE COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-8 items-start">
          
          {/* LEFT COLUMN: CATEGORIES SIDEBAR */}
          <aside className="lg:sticky lg:top-[90px] space-y-4">
            <Card className="bg-white border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <h3 className="text-xs uppercase tracking-widest text-[#0F172A] font-bold">
                  Categories
                </h3>
              </div>
              <CardContent className="p-2 space-y-1">
                {massageCategories.map((category) => {
                  const isActive = activeCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                        isActive
                          ? "bg-amber-500/10 border border-amber-500/30 text-amber-600 font-semibold shadow-sm"
                          : "bg-transparent border border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{category.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-sm truncate">{category.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border shrink-0 ${
                            isActive
                              ? "bg-amber-500/20 text-amber-700 border-amber-500/30"
                              : "bg-[#F8FAFC] text-[#64748B] border-[#E5E7EB]"
                          }`}>
                            {category.serviceCount}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {category.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Verified Professionals Badge */}
            <Card className="bg-white border-[#E5E7EB] rounded-2xl shadow-sm p-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#F59E0B] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A]">
                    Verified Professionals
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    All 250+ therapists are background-checked & certified.
                  </p>
                </div>
              </div>
            </Card>
          </aside>

          {/* MIDDLE COLUMN: SERVICE SECTIONS */}
          <main className="space-y-12">
            {massageCategories.map((category) => {
              const services = massageServices.filter((s) => s.categoryId === category.id);
              if (services.length === 0) return null;

              return (
                <section
                  key={category.id}
                  id={`category-${category.id}`}
                  className="scroll-mt-24 space-y-6"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
                    <span className="text-3xl shrink-0">{category.icon}</span>
                    <div>
                      <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                        {category.name}
                      </h2>
                      <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                        {category.description} • {services.length} services
                      </p>
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="space-y-5">
                    {services.map((service, index) => {
                      const qty = getServiceQuantity(service.id);
                      const isExpanded = !!expandedServices[service.id];
                      const discountPercentage = Math.round(
                        ((service.originalPrice - service.currentPrice) /
                          service.originalPrice) *
                          100
                      );

                      const renderedService = (
                        <Card
                          key={service.id}
                          className="bg-white border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 shadow-sm"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Card Image Left */}
                            <div className="relative w-full md:w-56 h-48 md:h-auto min-h-[180px] shrink-0 bg-[#F8FAFC]">
                              <Image
                                src={service.thumbnail.src}
                                alt={service.thumbnail.alt}
                                fill
                                className="object-cover object-center"
                              />
                              
                              {/* Left badge (e.g. Best Seller) */}
                              {service.badge && (
                                <div className={`absolute left-3 top-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${getBadgeStyle(service.badge)}`}>
                                  {getBadgeLabel(service.badge)}
                                </div>
                              )}

                              {/* Right discount badge */}
                              {discountPercentage > 0 && (
                                <div className="absolute right-3 top-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white border-none shadow-sm uppercase tracking-wide backdrop-blur-md">
                                  {discountPercentage}% Off
                                </div>
                              )}
                            </div>

                            {/* Card Content Right */}
                            <div className="flex-1 p-5 md:p-6 flex flex-col justify-between space-y-4">
                              <div className="space-y-2">
                                <h3 className="text-lg md:text-xl font-bold text-[#0F172A] leading-snug">
                                  {service.name}
                                </h3>

                                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#F59E0B]">
                                  <Star className="w-4 h-4 fill-[#F59E0B] stroke-none" />
                                  <span>{service.rating}</span>
                                  <span className="text-slate-400 font-normal">
                                    ({service.reviewCount.toLocaleString()})
                                  </span>
                                </div>

                                <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
                                  {service.shortDescription}
                                </p>

                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                  <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{service.duration}</span>
                                </div>
                              </div>

                              {/* Collapsible Details */}
                              {isExpanded && (
                                <div className="border-t border-[#E5E7EB] pt-4 space-y-3 animate-fadeIn">
                                  <p className="text-xs text-[#64748B] leading-relaxed italic">
                                    {service.longDescription}
                                  </p>
                                  <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                                      What's Included:
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                                      {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-[#64748B]">
                                          <Check className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                                          <span>{feature}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}

                              {/* Action Footer */}
                              <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4 mt-auto">
                                <button
                                  onClick={() => toggleExpand(service.id)}
                                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer transition-colors border-none bg-transparent"
                                >
                                  {isExpanded ? (
                                    <>
                                      Hide details <ChevronUp className="w-3.5 h-3.5" />
                                    </>
                                  ) : (
                                    <>
                                      View details <ChevronDown className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </button>

                                <div className="flex items-center gap-4">
                                  <div>
                                    <span className="text-lg font-black text-[#0F172A]">
                                      ₹{service.currentPrice.toLocaleString("en-IN")}
                                    </span>
                                    {service.originalPrice > service.currentPrice && (
                                      <span className="text-xs line-through text-slate-400 ml-2">
                                        ₹{service.originalPrice.toLocaleString("en-IN")}
                                      </span>
                                    )}
                                  </div>

                                  {qty > 0 ? (
                                    <div className="flex items-center gap-2 bg-amber-500 border border-amber-500 rounded-xl overflow-hidden p-0.5 shadow-md shadow-amber-500/10">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleUpdateQuantity(service.id, qty - 1)}
                                        className="h-8 w-8 text-white hover:bg-amber-600/60 rounded-lg cursor-pointer border-none"
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </Button>
                                      <span className="w-6 text-center text-sm font-bold text-white">
                                        {qty}
                                      </span>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleUpdateQuantity(service.id, qty + 1)}
                                        className="h-8 w-8 text-white hover:bg-amber-600/60 rounded-lg cursor-pointer border-none"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      onClick={() => handleAddService(service)}
                                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-9 px-4 rounded-xl cursor-pointer active:scale-95 transition-all shadow-md shadow-amber-500/10 border-none"
                                    >
                                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );

                      const isAfterSecondService = (index + 1) % 2 === 0;
                      const promo = isAfterSecondService ? promoCards[promoIndexRef.current % promoCards.length] : null;
                      if (promo) promoIndexRef.current++;

                      return (
                        <React.Fragment key={service.id}>
                          {renderedService}
                          {promo && <PromoCard data={promo} />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </main>

          {/* RIGHT COLUMN: OFFERS & CART SUMMARY */}
          <aside className="lg:sticky lg:top-[90px] space-y-6">
            
            {/* OFFERS & COUPONS */}
            <Card className="bg-white border-[#E5E7EB] rounded-2xl shadow-sm">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-xs uppercase tracking-widest text-[#0F172A] font-bold">
                  Offers & Coupons
                </h3>
              </div>
              <CardContent className="p-4 space-y-4">
                {/* Coupon Cards List */}
                <div className="space-y-3">
                  {coupons.map((coupon) => {
                    const isApplied = appliedCoupon?.code === coupon.code;
                    const canApply = cartSubtotal >= coupon.minOrderValue;

                    return (
                      <div
                        key={coupon.code}
                        className={`p-3 rounded-xl border transition-all ${
                          isApplied
                            ? "bg-amber-50/60 border-amber-500/40"
                            : "bg-[#F8FAFC] border-[#E5E7EB]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-xs font-bold text-[#F59E0B] uppercase tracking-wide">
                              {coupon.code}
                            </span>
                            <p className="text-xs text-[#0F172A] mt-2 font-medium">
                              {coupon.description}
                            </p>
                            <p className="text-[10px] text-[#64748B] mt-1">
                              Min. order: ₹{coupon.minOrderValue}
                            </p>
                          </div>

                          {isApplied ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleRemoveCoupon}
                              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2.5 rounded-lg cursor-pointer border-none"
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              disabled={!canApply}
                              onClick={() => handleApplyCoupon(coupon.code)}
                              className={`text-xs font-bold h-7 px-2.5 rounded-lg cursor-pointer transition-all border-none ${
                                canApply
                                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Input Code */}
                <div className="space-y-2 border-t border-[#E5E7EB] pt-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="bg-white border-[#E5E7EB] text-sm text-slate-800 rounded-xl focus:border-[#F59E0B] focus:ring-[#F59E0B]/20 h-9"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleApplyCoupon(couponInput)}
                      disabled={!couponInput}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-9 rounded-xl px-3 cursor-pointer border-none"
                    >
                      Apply
                    </Button>
                  </div>

                  {couponError && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{couponError}</span>
                    </div>
                  )}

                  {couponSuccess && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{couponSuccess}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CART SUMMARY */}
            <Card className="bg-white border-[#E5E7EB] rounded-2xl shadow-sm">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
                  <h3 className="text-xs uppercase tracking-widest text-[#0F172A] font-bold">
                    Cart Summary
                  </h3>
                </div>
                {cartItems.length > 0 && (
                  <span className="text-xs text-[#64748B]">
                    {cartItems.length} {cartItems.length === 1 ? "service" : "services"}
                  </span>
                )}
              </div>
              
              <CardContent className="p-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        No services added yet
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto">
                        Browse services and add them here
                      </p>
                    </div>
                    <Button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 font-bold h-10 rounded-xl mt-4 cursor-not-allowed border-none"
                    >
                      Add services to book
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Item list */}
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E7EB]"
                        >
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#0F172A] truncate leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-[#64748B] mt-0.5">
                              {item.duration}
                            </p>
                            <p className="text-xs font-semibold text-[#F59E0B] mt-1">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>

                          {/* Mini quantity adjuster */}
                          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg p-0.5 scale-90">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center rounded text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer border-none bg-transparent"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-4 text-center text-xs font-bold text-[#0F172A]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center rounded text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer border-none bg-transparent"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cost Calculations */}
                    <div className="space-y-2 text-xs border-t border-[#E5E7EB] pt-3">
                      <div className="flex items-center justify-between text-[#64748B]">
                        <span>Total Duration</span>
                        <span className="font-semibold text-[#0F172A]">
                          {totalDurationMin} min
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[#64748B]">
                        <span>Subtotal</span>
                        <span className="font-semibold text-[#0F172A]">
                          ₹{cartSubtotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {appliedCoupon && (
                        <div className="flex items-center justify-between text-emerald-600 font-medium">
                          <span className="flex items-center gap-1">
                            <Percent className="w-3.5 h-3.5" /> Coupon Discount ({appliedCoupon.code})
                          </span>
                          <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm border-t border-[#E5E7EB] pt-3 mt-1 font-bold text-[#0F172A]">
                        <span>Grand Total</span>
                        <span className="text-base text-[#F59E0B] font-black">
                          ₹{grandTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all border-none cursor-pointer"
                    >
                      Proceed to Book
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* WHY CHOOSE US */}
            <Card className="bg-white border-[#E5E7EB] rounded-2xl shadow-sm">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <h3 className="text-xs uppercase tracking-widest text-[#0F172A] font-bold">
                  Why Choose Us?
                </h3>
              </div>
              <CardContent className="p-4 space-y-4">
                {whyChooseUsList.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

        </div>
      </div>
    </div>
  );
}