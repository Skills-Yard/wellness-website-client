"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, Search, ShoppingCart, User, X, Sparkles, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { NavLinkType } from "@/types";
import { LOCATIONS, NAV_LINKS, SERVICE_SUGGESTIONS, UNSUPPORTED_LOCATIONS } from "@/utils/data";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { 
        cartItems, 
        cartCount, 
        isCartOpen, 
        setIsCartOpen, 
        removeFromCart, 
        clearCart,
        location,
        setLocation
    } = useCart();

    const [active, setActive] = useState<NavLinkType>("Massage");
    const [query, setQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();

    const searchRef = useRef<HTMLDivElement>(null);

    // Mount hydration checks
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -80; // height of navbar offset
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const handleNavChange = (link: NavLinkType) => {
        setActive(link);
        setQuery("");
        setSearchOpen(false);
        scrollToSection(link.toLowerCase());
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setSearchOpen(false);
        setMobileMenuOpen(false);

        // Map suggestion to corresponding section and scroll
        let targetId = "";
        if (SERVICE_SUGGESTIONS.Massage.includes(suggestion)) {
            targetId = "massage";
            setActive("Massage");
        } else if (SERVICE_SUGGESTIONS.Wellness.includes(suggestion)) {
            targetId = "wellness";
            setActive("Wellness");
        } else if (SERVICE_SUGGESTIONS.Physiotherapy.includes(suggestion)) {
            targetId = "physiotherapy";
            setActive("Physiotherapy");
        }

        if (targetId) {
            scrollToSection(targetId);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const allSuggestions = [
                ...SERVICE_SUGGESTIONS.Massage,
                ...SERVICE_SUGGESTIONS.Wellness,
                ...SERVICE_SUGGESTIONS.Physiotherapy,
            ];
            const match = allSuggestions.find(
                (s) => s.toLowerCase() === query.toLowerCase()
            ) || allSuggestions.find(
                (s) => s.toLowerCase().includes(query.toLowerCase())
            );
            if (match) {
                handleSuggestionClick(match);
            }
        }
    };

    const currentSuggestions = SERVICE_SUGGESTIONS[active];
    const filtered = currentSuggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
    );

    const searchPlaceholder: Record<NavLinkType, string> = {
        Massage: "Search massage types…",
        Wellness: "Search wellness services…",
        Physiotherapy: "Search physio treatments…",
    };

    const handleRedirect = () => {
    // router.push() aapko naye path par le jayega
    router.push("/profile"); // "/cart" ko apne target path se replace karein
  };

    return (
        <nav
            className={cn(
                "w-full sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300 h-16 md:h-18 hidden md:flex items-center",
                scrolled ? "shadow-md" : "shadow-sm"
            )}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

                {/* Left Section: Logo & Desktop Links */}
                <div className="flex items-center gap-6 lg:gap-8">
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-[0_2px_12px_rgba(251,191,36,0.4)] group-hover:shadow-[0_2px_18px_rgba(251,191,36,0.6)] transition-shadow">
                            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-gray-900 font-semibold text-[17px] tracking-tight">
                            Vell<span className="text-amber-500">ora</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link}
                                onClick={() => handleNavChange(link)}
                                className={cn(
                                    "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none cursor-pointer",
                                    active === link ? "text-amber-500" : "text-gray-400 hover:text-gray-700"
                                )}
                            >
                                {link}
                                {active === link && (
                                    <span className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Controls Menu */}
                <div className="hidden md:flex items-center flex-1 justify-end gap-3 max-w-2xl">

                    {/* Shadcn Dropdown for Location Picker */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 rounded-xl h-9 px-3.5 max-w-[180px] lg:max-w-[220px] justify-start gap-2 data-[state=open]:bg-amber-50 data-[state=open]:border-amber-200 data-[state=open]:text-gray-900 font-normal cursor-pointer"
                            >
                                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span className="truncate flex-1 text-left">{isMounted ? location : LOCATIONS[0]}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64 rounded-2xl p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border-gray-100 bg-white">
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
                                        location === loc && "bg-amber-50 text-amber-600 font-medium focus:bg-amber-50 focus:text-amber-600"
                                    )}
                                >
                                    <MapPin className="w-3.5 h-3.5 opacity-50 shrink-0 text-gray-300" />
                                    <span className="truncate">{loc}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Desktop Search Dropdown Shell */}
                    <div className="relative flex-1 max-w-[240px] lg:max-w-[280px]" ref={searchRef}>
                        <div
                            className={cn(
                                "flex items-center h-9 px-3.5 gap-2 rounded-xl border transition-all bg-gray-50 border-gray-200",
                                searchOpen && "border-amber-400 bg-white shadow-[0_0_0_3px_rgba(251,191,36,0.12)]"
                            )}
                        >
                            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <Input
                                placeholder={searchPlaceholder[active]}
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                                onFocus={() => setSearchOpen(true)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none border-none shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 min-w-0"
                            />
                            {query && (
                                <button type="button" onClick={() => setQuery("")} className="cursor-pointer">
                                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        {searchOpen && (
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full rounded-2xl border border-gray-100 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50 p-1.5">
                                {(query ? filtered : currentSuggestions).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => handleSuggestionClick(s)}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                                    >
                                        <Search className="w-3.5 h-3.5 opacity-40 shrink-0" />
                                        <span className="truncate">{s}</span>
                                    </button>
                                ))}
                                {query && filtered.length === 0 && (
                                    <p className="text-sm text-gray-400 px-3 py-3 text-center">No results for "{query}"</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cart Icon Action */}
                    <Button
                        onClick={() => setIsCartOpen(true)}
                        variant="outline"
                        size="icon"
                        className="relative w-9 h-9 bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-800 rounded-xl cursor-pointer"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {isMounted && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-[10px] font-bold text-white flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Button>

                    {/* Account Profile Action */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="w-9 h-9 bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-800 rounded-xl cursor-pointer">
                                <User className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border-gray-100 bg-white">
                            <DropdownMenuItem onClick={() => {handleRedirect}} className="cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors">
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("My Bookings section coming soon!")} className="cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors">
                                My Bookings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("Account Settings coming soon!")} className="cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors">
                                Account Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("Logged out successfully!")} className="cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-sm text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors font-medium">
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile View Structure: Actions and Shadcn Sheet Side Panel */}
                <div className="flex md:hidden items-center gap-2">
                    <Button
                        onClick={() => setIsCartOpen(true)}
                        variant="outline"
                        size="icon"
                        className="relative w-9 h-9 bg-gray-50 border-gray-200 text-gray-600 rounded-xl cursor-pointer"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {isMounted && cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-[9px] font-bold text-white flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Button>

                    {/* Shadcn Sheet Drawer Primitive Substitution */}
                    <Sheet  open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="w-9 h-9 bg-gray-50 border-gray-200 text-gray-600 rounded-xl cursor-pointer">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full max-w-[310px] p-5 flex flex-col bg-white gap-0 border-l border-gray-100">
                            <SheetHeader className="text-left mb-6">
                                <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <MapPin className="w-4 h-4 text-amber-500" />
                                    Configure Session
                                </SheetTitle>
                            </SheetHeader>

                            {/* Location Picker Field */}
                            <div className="mb-6">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Your Location</label>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-gray-50 text-sm text-gray-800 border border-gray-200 rounded-xl h-10 px-3 outline-none focus:border-amber-400 cursor-pointer"
                                >
                                    <optgroup label="Active Areas">
                                        {LOCATIONS.map((loc) => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Coming Soon">
                                        {UNSUPPORTED_LOCATIONS.map((loc) => (
                                            <option key={loc} value={loc}>{loc} (Coming Soon)</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            {/* Dynamic Segment Selection Wrapper inside Panel */}
                            <div className="mb-6">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Category Sector</label>
                                <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl">
                                    {NAV_LINKS.map((link) => (
                                        <button
                                            key={link}
                                            type="button"
                                            onClick={() => handleNavChange(link)}
                                            className={cn(
                                                "py-1.5 text-xs font-medium rounded-lg text-center transition-colors truncate px-1 cursor-pointer",
                                                active === link ? "bg-white text-amber-600 shadow-xs font-semibold" : "text-gray-500"
                                            )}
                                        >
                                            {link}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Drawer Filter Box */}
                            <div className="flex-1 flex flex-col min-h-0">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Discover Treatments</label>
                                <div className="flex items-center h-10 px-3 gap-2 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-amber-400 focus-within:bg-white mb-3 shrink-0">
                                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                    <Input
                                        placeholder={searchPlaceholder[active]}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="flex-1 bg-transparent text-sm text-gray-800 outline-none border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                                    />
                                </div>

                                {/* Sub-Suggestion Result List Box Container */}
                                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                                    {(query ? filtered : currentSuggestions).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => handleSuggestionClick(s)}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left text-gray-600 hover:bg-amber-50/50 hover:text-amber-700 transition-colors cursor-pointer"
                                        >
                                            <Search className="w-3 h-3 text-gray-300 shrink-0" />
                                            <span className="truncate">{s}</span>
                                        </button>
                                    ))}
                                    {query && filtered.length === 0 && (
                                        <p className="text-xs text-gray-400 py-4 text-center">No services found.</p>
                                    )}
                                </div>
                            </div>

                            {/* Account / User Drawer Bottom Actions Footer section */}
                            <div className="border-t border-gray-100 pt-4 mt-auto">
                                <button
                                    type="button"
                                    onClick={() => { setMobileMenuOpen(false); alert("Account Settings coming soon!"); }}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 text-left transition-colors cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Account Settings</span>
                                </button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>

            {/* Global Slide-Over Cart Drawer Component */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="right" className="w-full max-w-[420px] p-6 flex flex-col bg-white border-l border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                    <SheetHeader className="border-b border-gray-100 pb-4 mb-4">
                        <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                            <ShoppingCart className="w-5 h-5 text-amber-500" />
                            Your Cart ({isMounted ? cartCount : 0} {cartCount === 1 ? 'item' : 'items'})
                        </SheetTitle>
                    </SheetHeader>

                    {isMounted && cartItems.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                <ShoppingCart className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Your cart is empty</p>
                                <p className="text-sm text-gray-400">Add spa or clinical treatments to get started.</p>
                            </div>
                        </div>
                    ) : (
                        isMounted && (
                            <>
                                {/* Cart Items List */}
                                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3.5 pb-4 border-b border-gray-50">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 truncate leading-snug">{item.title}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">{item.duration}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-sm font-extrabold text-amber-600">₹{item.price.toLocaleString('en-IN')}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer border-none"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Cart Summary & Checkout */}
                                <div className="border-t border-gray-100 pt-4 mt-auto space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Subtotal</span>
                                        <span className="text-lg font-extrabold text-gray-900">
                                            ₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            alert("Booking Placed Successfully! Our representative will call you shortly.");
                                            clearCart();
                                            setIsCartOpen(false);
                                        }}
                                        className="w-full bg-amber-500 text-white hover:bg-amber-600 font-bold h-11 rounded-xl cursor-pointer shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all border-none"
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            </>
                        )
                    )}
                </SheetContent>
            </Sheet>
        </nav>
    );
}