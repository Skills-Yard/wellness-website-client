"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getVisibleElementById } from "@/src/utils/scroll";
import { NAV_LINK_SECTION_IDS } from "@/src/utils/data";
import {
    useServiceSearchIndex,
    SearchableService,
} from "@/src/hooks/queries/useServiceSearchIndex";
import { useServiceSearch } from "@/src/hooks/useServiceSearch";

// Same full-catalog search infra the desktop Navbar uses (see its
// searchEverOpened/useServiceSearchIndex/useServiceSearch trio) — mobile
// used to just substring-filter whatever HomeServiceItem[] the home page
// had already loaded, with no category info to link a tap anywhere, so
// picking a suggestion silently did nothing. Reusing the same hooks gives
// mobile the same fuzzy, full-zone-catalog search and working deep links,
// and since useServiceSearchIndex fetches via the same queryKeys as the
// home page's own useHomeDetails(zoneId) call, it resolves from cache
// instead of refetching.
export function useMobileHome(zoneId: string | null | undefined) {
    const [searchFocused, setSearchFocused] = useState(false);
    // Stays true once flipped so the index (and its cache entries) persists
    // across searchFocused toggling closed — mirrors the desktop navbar's
    // searchEverOpened.
    const [searchEverOpened, setSearchEverOpened] = useState(false);
    const { items: searchIndex, isLoading: isSearchIndexLoading } =
        useServiceSearchIndex(zoneId, { enabled: searchEverOpened });
    const {
        query: searchQuery,
        setQuery: setSearchQuery,
        results: searchResults,
    } = useServiceSearch(searchIndex);

    const router = useRouter();
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

        const sectionIds = Object.values(NAV_LINK_SECTION_IDS);
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

    const handleSearchFocus = () => {
        setSearchEverOpened(true);
        setSearchFocused(true);
    };

    // Same deep-link shape as desktop's handleResultClick —
    // `/detail/{categorySlug}?categoryId=...&id=...`, which the detail page
    // reads to auto-open that service's booking modal on load.
    const handleSuggestionClick = (suggestion: SearchableService) => {
        setSearchQuery("");
        setSearchFocused(false);
        router.push(
            `/detail/${suggestion.categorySlug}?categoryId=${encodeURIComponent(suggestion.categoryId)}&id=${encodeURIComponent(suggestion.id)}`,
        );
    };

    return {
        searchQuery,
        setSearchQuery,
        searchFocused,
        setSearchFocused,
        onSearchFocus: handleSearchFocus,
        searchResults,
        isSearchIndexLoading,
        activeTab,
        isMounted,
        headerScrolled,
        scrollToSection,
        handleSuggestionClick,
    };
}
