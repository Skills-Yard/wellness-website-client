"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQ_DATA } from "@/utils/data";

export default function ServiceFaq() {
    const [activeTab, setActiveTab] = useState<"massage" | "wellness" | "physiotherapy">("massage");
    const [openId, setOpenId] = useState<number | null>(1); 

    const handleTabChange = (tab: "massage" | "wellness" | "physiotherapy") => {
        setActiveTab(tab);
        setOpenId(1);
    };

    const toggleAccordion = (id: number) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    const currentFaqs = FAQ_DATA[activeTab];

    const tabConfig = {
        massage: {
            icon: Sparkles,
            color: "text-amber-500 bg-amber-50 border-amber-100",
            activeClass: "bg-amber-500 text-white shadow-md shadow-amber-500/20"
        },
        wellness: {
            icon: ShieldCheck,
            color: "text-emerald-600 bg-emerald-50 border-emerald-100",
            activeClass: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
        },
        physiotherapy: {
            icon: Activity,
            color: "text-blue-600 bg-blue-50 border-blue-100",
            activeClass: "bg-blue-600 text-white shadow-md shadow-blue-600/20"
        }
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
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
                    {(Object.keys(FAQ_DATA) as Array<keyof typeof FAQ_DATA>).map((tab) => {
                        const isActive = activeTab === tab;
                        const Icon = tabConfig[tab].icon;
                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={cn(
                                    "flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all duration-300 cursor-pointer text-gray-500  select-none",
                                    isActive && tabConfig[tab].activeClass
                                )}
                            >
                                <Icon className="w-4.5 h-4.5 shrink-0" />
                                <span className="truncate">{tab}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Accordion List container */}
                <div className="space-y-3.5">
                    {currentFaqs.map((faq) => {
                        const isOpen = openId === faq.id;
                        const ActiveIcon = tabConfig[activeTab].icon;
                        
                        return (
                            <div
                                key={faq.id}
                                className={cn(
                                    "border border-gray-100 bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-xs",
                                    isOpen && "border-amber-100 shadow-sm"
                                )}
                            >
                                {/* Accordion Trigger Header Bar */}
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(faq.id)}
                                    className="w-full flex items-center justify-between gap-4 p-4 text-left font-bold text-gray-800 text-sm sm:text-base hover:bg-stone-50/40 active:bg-stone-50/70 transition-colors cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 transition-colors",
                                            isOpen ? tabConfig[activeTab].color : "text-gray-400 bg-gray-50 border-gray-100"
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
            </div>

            {/* Bottom trust seal */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 p-5 bg-amber-50/40 border border-amber-100/50 rounded-2xl text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-gray-900">Vellora Safety & Quality Protocol</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        We screen and train 100% of our professionals. High safety standards and certified tools guaranteed.
                    </p>
                </div>
            </div>
        </section>
    );
}
