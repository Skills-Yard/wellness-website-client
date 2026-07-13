"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { DYNAMIC_DETAILS } from "@/src/utils/data/detailPage";
import { DynamicService } from "@/src/utils/types/spabooking";
import { useCart } from "@/src/context/CartContext";
import MobileStickyNavbar from "./Mobilestickynavbar";
import MobileHeroSection from "./Mobileherosection";
import MobileCategoriesGrid from "./Mobilecategoriesgrid";
import DesktopCategoriesSidebar from "./Desktopcategoriessidebar";
import DesktopHero from "./Desktophero";
import ServicesList from "./Serviceslist";
import VelloraPPromiseBox from "./Vellorappromisebox";
import FloatingMenuButton from "./Floatingmenubutton";
import CategoriesMenuModal from "./Categoriesmenumodal";
import SubDetailPopUp from "../subdetail/mainfile";


export default function SpaBookingLayout() {
  const [open, setOpen] = useState(true);
  const [selectedSubService, setSelectedSubService] =
    useState<DynamicService | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "massage";
  const { addToCart, isCartOpen } = useCart();

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
      const foundService = activeServices.find((s: DynamicService) => s.id === targetId);

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
      {/* MOBILE COMPONENTS */}
      <MobileStickyNavbar
        title={detailData.title}
        isScrolled={isScrolled}
        activeTab={activeTab}
        activeCategories={activeCategories}
        onCategoryClick={scrollToCategory}
      />

      <MobileHeroSection videoSrc={detailData.video} />

      <MobileCategoriesGrid
        title={detailData.title}
        rating={detailData.rating}
        reviews={detailData.reviews}
        media={detailData.media}
        categories={activeCategories}
        activeTab={activeTab}
        onCategoryClick={scrollToCategory}
      />

      {/* MAIN CONTENT */}
      <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 lg:pt-12">
        <div className="flex flex-col lg:flex-row gap-6 xs:gap-8 lg:items-start">
          {/* LEFT SIDEBAR - DESKTOP ONLY */}
          <DesktopCategoriesSidebar
            categories={activeCategories}
            media={detailData.media}
            activeTab={activeTab}
            onCategoryClick={scrollToCategory}
          />

          {/* CENTER COLUMN - SERVICES */}
          <div className="flex-1 flex flex-col">
            {/* DESKTOP HERO */}
            <DesktopHero
              title={detailData.title}
              rating={detailData.rating}
              reviews={detailData.reviews}
              media={detailData.media}
            />

            <div className="flex flex-col md:flex-row gap-4 xs:gap-6 justify-between">
              {/* SERVICES LIST */}
              <ServicesList
                categories={activeCategories}
                services={activeServices}
                onDetailClick={handleOpenDetail}
                onAddToCart={handleAddToCart}
              />

              {/* RIGHT SIDEBAR - VELLORA PROMISE */}
              <VelloraPPromiseBox />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING MENU BUTTON */}
      <FloatingMenuButton
        isCartOpen={isCartOpen}
        onClick={() => setIsMenuOpen(true)}
      />

      {/* MOBILE MENU MODAL */}
      <CategoriesMenuModal
        isOpen={isMenuOpen}
        categories={activeCategories}
        media={detailData.media}
        activeTab={activeTab}
        onClose={() => setIsMenuOpen(false)}
        onCategoryClick={scrollToCategory}
      />

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