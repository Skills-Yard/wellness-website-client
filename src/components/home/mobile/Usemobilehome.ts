"use client";

import { useState, useEffect, useRef } from "react";
import { SERVICE_SUGGESTIONS } from "@/src/utils/data";

export function useMobileHome() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    const [isMounted, setIsMounted] = useState(false);
    const [headerScrolled, setHeaderScrolled] = useState(false);
    const isProgrammaticScroll = useRef(false);
    const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get("tab");
            if (tab) {
                setTimeout(() => {
                    scrollToSection(tab);
                }, 400);
            }
        }
    }, []);

    const getVisibleElementById = (id: string): HTMLElement | null => {
        if (typeof document === "undefined") return null;
        const elements = document.querySelectorAll(`#${id}`);
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 || rect.height > 0) {
                return el;
            }
        }
        return document.getElementById(id);
    };

    // ✅ header scroll shadow ke liye simple listener (isme koi tab-logic nahi)
    useEffect(() => {
        const handleHeaderScroll = () => {
            setHeaderScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleHeaderScroll);
        return () => window.removeEventListener("scroll", handleHeaderScroll);
    }, []);

    // ✅ IntersectionObserver — DOM order pe depend nahi karta, sirf jo section
    // actually screen ke "trigger zone" mein visible hai wahi active hota hai
    useEffect(() => {
        if (!isMounted) return;

        const sectionIds = ["massage", "wellness", "physiotherapy"];
        const observer = new IntersectionObserver(
            (entries) => {
                if (isProgrammaticScroll.current) return;

                // jo section sabse zyada visible hai (top ke sabse najdeek) usko lo
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible.length > 0) {
                    setActiveTab(visible[0].target.id);
                } else if (window.scrollY < 150) {
                    setActiveTab("home");
                }
            },
            {
                // top se 120px neeche se lekar screen ke 60% tak "active zone"
                rootMargin: "-120px 0px -60% 0px",
                threshold: 0,
            }
        );

        sectionIds.forEach((id) => {
            const el = getVisibleElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [isMounted]);

    const scrollToSection = (id: string) => {
        isProgrammaticScroll.current = true;
        if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);

        if (id === "top") {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const element = getVisibleElementById(id);
            if (element) {
                const headerHeight = 70;
                const elementTop = element.getBoundingClientRect().top + window.scrollY;
                const scrollTop = elementTop - headerHeight;

                setActiveTab(id);
                window.scrollTo({
                    top: Math.max(0, scrollTop),
                    behavior: "smooth",
                });
            }
        }

        scrollEndTimer.current = setTimeout(() => {
            isProgrammaticScroll.current = false;
        }, 700);
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
        if (SERVICE_SUGGESTIONS.Massage.includes(suggestion)) targetId = "massage";
        else if (SERVICE_SUGGESTIONS.Wellness.includes(suggestion)) targetId = "wellness";
        else if (SERVICE_SUGGESTIONS.Physiotherapy.includes(suggestion)) targetId = "physiotherapy";

        if (targetId) {
            setTimeout(() => scrollToSection(targetId), 0);
        }
    };

    return {
        searchQuery,
        setSearchQuery,
        searchFocused,
        setSearchFocused,
        activeTab,
        isMounted,
        headerScrolled,
        scrollToSection,
        filteredSuggestions,
        handleSuggestionClick,
    };
}