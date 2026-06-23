"use client";

import { useState, useEffect } from "react";
import { SERVICE_SUGGESTIONS } from "@/utils/data";

export function useMobileHome() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    const [isMounted, setIsMounted] = useState(false);
    const [headerScrolled, setHeaderScrolled] = useState(false);

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

    useEffect(() => {
        const handleScroll = () => {
            setHeaderScrolled(window.scrollY > 20);

            const scrollPos = window.scrollY + 120;
            const massageEl = getVisibleElementById("massage");
            const wellnessEl = getVisibleElementById("wellness");
            const physioEl = getVisibleElementById("physiotherapy");

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
        // Scroll to top
        if (id === "top") {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Scroll to section
        const element = getVisibleElementById(id);
        if (element) {
            const headerHeight = 70;
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            const scrollTop = elementTop - headerHeight;

            window.scrollTo({
                top: Math.max(0, scrollTop),
                behavior: "smooth",
            });

            setActiveTab(id);
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