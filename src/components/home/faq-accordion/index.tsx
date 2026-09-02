"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles, Activity } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { HomeCategory } from "@/src/types/serviceTypes";
import { HomeFaq } from "@/src/types/serviceItemTypes";

export type CategoryFaqGroup = {
    category: HomeCategory;
    faqs: HomeFaq[];
};

type ServiceFaqProps = {
    categoryFaqs: CategoryFaqGroup[];
    // When set, only the active tab's first `limit` FAQs are shown, with a
    // "Show more" link to the full /faq page below them — used for the
    // teaser embedded on the home page. Omit for the full, unlimited list
    // (the /faq page itself).
    limit?: number;
    // Pre-selects a tab (e.g. the one the visitor was on when they hit
    // "Show more") instead of defaulting to the first category — used by
    // the /faq page, which reads this from its own `?category=` param.
    initialCategoryId?: string;
};

export default function ServiceFaq({ categoryFaqs, limit, initialCategoryId }: ServiceFaqProps) {
    const [activeTab, setActiveTab] = useState<string | null>(initialCategoryId ?? null);
    const [openId, setOpenId] = useState<string | null>(null);

    const activeCategoryId = categoryFaqs.some((group) => group.category.id === activeTab)
        ? activeTab
        : categoryFaqs[0]?.category.id;
    const activeGroup = categoryFaqs.find((group) => group.category.id === activeCategoryId);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setOpenId(null);
    };

    const toggleAccordion = (id: string) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    // Every category uses the same on-brand styling (Frame 158 theme —
    // amber #FFC558 active fill, brown #904720 icon, espresso CTA); only
    // the per-category icon differs. Keyed by the category's real `slug`
    // (see CategoryServices' `id={category.slug}` / NAV_LINK_SECTION_IDS).
    const THEME_TAB = {
        color: "text-[#904720] bg-amber-50 border-amber-100",
        activeClass: "bg-amber-400 text-[#25180F] shadow-sm",
        buttonGradient: "from-[#25180F] to-[#3a2518] shadow-[#25180F]/25",
    };
    const tabConfig: Record<
        string,
        { icon: typeof Sparkles; color: string; activeClass: string; buttonGradient: string }
    > = {
        spa: { icon: Sparkles, ...THEME_TAB },
        massage: { icon: ShieldCheck, ...THEME_TAB },
        physio: { icon: Activity, ...THEME_TAB },
    };
    const DEFAULT_TAB_CONFIG = { icon: HelpCircle, ...THEME_TAB };
    const configFor = (category: HomeCategory) => tabConfig[category.slug] ?? DEFAULT_TAB_CONFIG;

    if (!activeGroup) return null;

    const visibleFaqs = limit ? activeGroup.faqs.slice(0, limit) : activeGroup.faqs;
    const hasMore = Boolean(limit) && activeGroup.faqs.length > visibleFaqs.length;
    const activeConfig = configFor(activeGroup.category);

    return (
        <section
            className={cn(
                "py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans",
                // The home-page teaser (limit set) has always been desktop-only
                // here — mobile gets its own FAQ entry point via the "Show
                // more" link below. The full /faq page (no limit) is the only
                // place this renders on small screens.
                limit && "max-sm:hidden",
            )}
        >
            <div className="max-w-4xl mx-auto w-full">
                {/* Header Title */}
                <div className="text-center mb-10">
                    <span className="text-amber-500 font-bold text-xs uppercase tracking-wider">Got Questions?</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
                        Service Information & FAQs
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 font-medium max-w-lg mx-auto">
                        Learn about how we prepare, what to expect, and details about our home wellness consultations.
                    </p>
                </div>

                {/* Category Segment Control Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100/80 rounded-2xl mb-8">
                    {categoryFaqs.map((group) => {
                        const tab = group.category.id;
                        const config = configFor(group.category);
                        const isActive = activeCategoryId === tab;
                        const Icon = config.icon;
                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={cn(
                                    "flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all duration-300 cursor-pointer text-gray-500  select-none",
                                    isActive && config.activeClass
                                )}
                            >
                                <Icon className="w-4.5 h-4.5 shrink-0" />
                                <span className="truncate">{group.category.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Accordion List container */}
                <div className="space-y-3.5">
                    {visibleFaqs.map((faq, index) => {
                        const faqId = `${activeGroup.category.id}-${faq.id ?? index}`;
                        const isOpen = openId === faqId;

                        return (
                            <div
                                key={faqId}
                                className={cn(
                                    "border border-gray-100 bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-xs",
                                    isOpen && "border-amber-100 shadow-sm"
                                )}
                            >
                                {/* Accordion Trigger Header Bar */}
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(faqId)}
                                    className="w-full flex items-center justify-between gap-4 p-4 text-left font-bold text-gray-800 text-sm sm:text-base hover:bg-stone-50/40 active:bg-stone-50/70 transition-colors cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 transition-colors",
                                            isOpen ? activeConfig.color : "text-gray-400 bg-gray-50 border-gray-100"
                                        )}>
                                            <HelpCircle className="w-4.5 h-4.5" />
                                        </div>
                                        <span className="leading-snug">{faq.question}</span>
                                    </div>
                                    <ChevronDown className={cn(
                                        "w-4.5 h-4.5 text-gray-400 transition-transform duration-300 shrink-0",
                                        isOpen && "rotate-180 text-amber-500"
                                    )} />
                                </button>

                                {/* Accordion Expandable Panel Body */}
                                <div
                                    className={cn(
                                        "transition-all duration-300 ease-in-out overflow-hidden max-h-0",
                                        isOpen && "max-h-[300px]"
                                    )}
                                >
                                    <div className="p-4 pt-0 pl-15 text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {hasMore && (
                    <div className="mt-8 flex justify-center">
                        <Link
                            href={`/faq?category=${encodeURIComponent(activeCategoryId ?? "")}`}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]",
                                activeConfig.buttonGradient,
                            )}
                        >
                            <Sparkles className="h-4 w-4 shrink-0" />
                            Show more FAQs
                            <ChevronDown className="h-4 w-4 shrink-0" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
