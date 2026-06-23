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

    // Traverses all offsetParents to get true absolute top position
    // (handles overflow:hidden parents that break scrollIntoView & getBoundingClientRect)
    const getAbsoluteOffsetTop = (el: HTMLElement): number => {
        let top = 0;
        let current: HTMLElement | null = el;
        while (current) {
            top += current.offsetTop;
            current = current.offsetParent as HTMLElement | null;
        }
        return top;
    };

    const scrollToSection = (id: string) => {
        setActiveTab(id === "top" ? "home" : id);
        if (id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 70;
            const top = getAbsoluteOffsetTop(element) - headerOffset;
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
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

        if (targetId) scrollToSection(targetId);
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