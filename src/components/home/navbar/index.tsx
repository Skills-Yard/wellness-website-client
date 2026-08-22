"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingCart,
  User,
  X,
  Sparkles,
  Menu,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/src/context/CartContext";
import { NavLinkType } from "@/src/utils/types";
import {
  LOCATIONS,
  NAV_LINKS,
  NAV_LINK_LABELS,
  NAV_LINK_SECTION_IDS,
  UNSUPPORTED_LOCATIONS,
} from "@/src/utils/data";
import { cn } from "@/src/lib/utils";
import { getVisibleElementById } from "@/src/utils/scroll";
import {
  useServiceSearchIndex,
  SearchableService,
} from "@/src/hooks/queries/useServiceSearchIndex";
import { useServiceSearch } from "@/src/hooks/useServiceSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import AuthModal from "@/src/components/auth/LazyAuthModal";
import { authApi } from "@/src/services/authApi";
import { unregisterPushToken } from "@/src/lib/notifications/push";
import NotificationBell from "@/src/components/notifications/NotificationBell";

// Only ever rendered once the cart icon is clicked — no reason to ship its
// JS (address forms, Razorpay glue, etc.) in the navbar's initial bundle.
const CartSheet = dynamic(() => import("@/src/components/cart/CartSheet"), {
  ssr: false,
  loading: () => null,
});
import { useAddresses } from "@/src/hooks/queries/useAddresses";
import { formatAddressLabel } from "@/src/services/addressApi";

export default function Navbar() {
  const {
    cartCount,
    setIsCartOpen,
    location,
    setLocation,
    addressId,
    updateCartAddress,
    zoneId,
  } = useCart();

  // Saved delivery addresses (only fetched when logged in — see
  // useAddresses) surfaced alongside the static location list, so a
  // returning logged-in user sees their real address as an option here,
  // not just the 5 hardcoded areas.
  const { data: addressesData } = useAddresses();
  const addresses = addressesData ?? [];
  const selectedSavedAddress = addresses.find((address) => address.id === addressId) ?? null;

  const [active, setActive] = useState<NavLinkType>("Massage");
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // The full-catalog search index (categories → sub-categories → service
  // items) is only ever fetched once the search field is actually used —
  // see useServiceSearchIndex — so a visitor who never searches never
  // triggers those extra requests. Stays true once flipped so the index
  // (and its React Query cache entries) persists across searchOpen
  // toggling closed on blur/outside-click.
  const [searchEverOpened, setSearchEverOpened] = useState(false);
  const { items: searchIndex, isLoading: isSearchIndexLoading } =
    useServiceSearchIndex(zoneId, { enabled: searchEverOpened });
  const { query, setQuery, results: searchResults } =
    useServiceSearch(searchIndex);

  const router = useRouter();
  const pathname = usePathname();

  const searchRef = useRef<HTMLDivElement>(null);

  // Mount hydration checks
  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(localStorage.getItem("isUserLoggedIn") === "true");
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
    const element = getVisibleElementById(id);
    if (element) {
      const yOffset = -80; // height of navbar offset
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Navbar renders on every page (see app/layout.tsx), but the
  // Massage/Spa/Physiotherapy sections only exist on the home page —
  // scrollToSection above would silently no-op from anywhere else. Off the
  // home page, navigate there with `?tab=<id>` instead; Home (page.tsx)
  // and MobileHome (useMobileHome) both already pick that param up once
  // the catalog has loaded and scroll to it themselves.
  const handleNavChange = (link: NavLinkType) => {
    setActive(link);
    setQuery("");
    setSearchOpen(false);
    const id = NAV_LINK_SECTION_IDS[link];
    if (pathname === "/") {
      scrollToSection(id);
    } else {
      router.push(`/?tab=${id}`);
    }
  };

  // Selecting a result navigates straight to its service — same
  // `/detail/{categorySlug}?categoryId=...&id=...` deep-link shape used by
  // in-spotlight/wall-panel/category-services, which the detail page reads
  // (see spa-booking's `preselectedService`) to auto-open that service's
  // modal on load, from any page in the app, not just the current one.
  const handleResultClick = (result: SearchableService) => {
    setQuery("");
    setSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(
      `/detail/${result.categorySlug}?categoryId=${encodeURIComponent(result.categoryId)}&id=${encodeURIComponent(result.id)}`,
    );
  };

  const handleSearchFocus = () => {
    setSearchEverOpened(true);
    setSearchOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults[0]) {
      handleResultClick(searchResults[0]);
    }
  };

  const searchPlaceholder = "Search services…";

  const handleRedirect = () => {
    router.push("/profile");
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      if (accessToken) {
        await unregisterPushToken(accessToken);
        await authApi.logout(accessToken);
      }
    } catch {
      // End the local session even when the server session has expired.
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("isUserLoggedIn");
      setIsLoggedIn(false);
      router.replace("/");
    }
  };

  return (
    <nav
      className={cn(
        "w-full sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300 h-16 md:h-18 hidden md:flex items-center",
        scrolled ? "shadow-md" : "shadow-sm",
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
              Eez<span className="text-amber-500">it</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => handleNavChange(link)}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none cursor-pointer",
                  active === link
                    ? "text-amber-500"
                    : "text-gray-400 hover:text-gray-700",
                )}
              >
                {NAV_LINK_LABELS[link]}
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
                className=" bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 rounded-xl h-9 px-3.5 max-w-[300px] lg:max-w-[350px] justify-start gap-2 data-[state=open]:bg-amber-50 data-[state=open]:border-amber-200 data-[state=open]:text-gray-900 font-normal cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate flex-1 text-left">
                  {isMounted
                    ? (selectedSavedAddress ? formatAddressLabel(selectedSavedAddress) : location)
                    : LOCATIONS[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-64 rounded-2xl p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border-gray-100 bg-white"
            >
              {addresses.length > 0 && (
                <>
                  <div className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50/50 rounded-lg select-none mb-1">
                    Your Addresses
                  </div>
                  {addresses.map((address) => (
                    <DropdownMenuItem
                      key={address.id}
                      onClick={() => updateCartAddress(address.id)}
                      className={cn(
                        "cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors",
                        addressId === address.id &&
                          "bg-amber-50 text-amber-600 font-medium focus:bg-amber-50 focus:text-amber-600",
                      )}
                    >
                      <MapPin className="w-3.5 h-3.5 opacity-50 shrink-0 text-amber-500" />
                      <span className="truncate">
                        {address.label ?? address.customLabel ?? formatAddressLabel(address)}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              <div className="px-2.5 py-1 text-[10px] font-bold text-amber-600 bg-amber-50/50 rounded-lg select-none mb-1 mt-2.5">
                Active Areas
              </div>
              {LOCATIONS.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={cn(
                    "cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors",
                    location === loc &&
                      "bg-amber-50 text-amber-600 font-medium focus:bg-amber-50 focus:text-amber-600",
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
                    location === loc &&
                      "bg-amber-50 text-amber-600 font-medium focus:bg-amber-50 focus:text-amber-600",
                  )}
                >
                  <MapPin className="w-3.5 h-3.5 opacity-50 shrink-0 text-gray-300" />
                  <span className="truncate">{loc}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Search Dropdown Shell */}
          <div
            className="relative flex-1 max-w-[240px] lg:max-w-[280px]"
            ref={searchRef}
          >
            <div
              className={cn(
                "flex items-center h-9 px-3.5 gap-2 rounded-xl border transition-all bg-gray-50 border-gray-200",
                searchOpen &&
                  "border-amber-400 bg-white shadow-[0_0_0_3px_rgba(251,191,36,0.12)]",
              )}
            >
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <Input
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchEverOpened(true);
                  setSearchOpen(true);
                }}
                onFocus={handleSearchFocus}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none border-none shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 min-w-0"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {searchOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full rounded-2xl border border-gray-100 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50 p-1.5">
                {!query && (
                  <p className="text-sm text-gray-400 px-3 py-3 text-center">
                    Start typing to search services…
                  </p>
                )}
                {query && isSearchIndexLoading && searchResults.length === 0 && (
                  <p className="text-sm text-gray-400 px-3 py-3 text-center">
                    Searching…
                  </p>
                )}
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 opacity-40 shrink-0" />
                    <span className="truncate flex-1">{result.name}</span>
                    <span className="shrink-0 text-xs text-gray-400">
                      {result.categoryName}
                    </span>
                  </button>
                ))}
                {query && !isSearchIndexLoading && searchResults.length === 0 && (
                  <p className="text-sm text-gray-400 px-3 py-3 text-center">
                    No results for "{query}"
                  </p>
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

          {/* Notifications Bell */}
          <NotificationBell isLoggedIn={isMounted && isLoggedIn} />

          {/* Account Profile Action */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-800 rounded-xl cursor-pointer"
              >
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-2xl p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border-gray-100 bg-white"
            >
              <DropdownMenuItem
                onClick={() => {
                  if (isLoggedIn) handleRedirect();
                  else setLoginOpen(true);
                }}
                className="cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors"
              >
                {isLoggedIn ? "Profile" : "Log in"}
              </DropdownMenuItem>
              {isLoggedIn && (
              <DropdownMenuItem
                onClick={() => router.push("/bookings")}
                className="cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors"
              >
                My Bookings
              </DropdownMenuItem>
              )}
              {isLoggedIn && (
              <DropdownMenuItem
                onClick={() => router.push("/profile?section=settings")}
                className="cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors"
              >
                Account Settings
              </DropdownMenuItem>
              )}
              {isLoggedIn && (
              <DropdownMenuItem
                onClick={() => {
                  void handleLogout();
                }}
                className="cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-sm text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors font-medium"
              >
                Logout
              </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile View Structure: Actions and Shadcn Sheet Side Panel */}
        <div className="flex md:hidden items-center gap-2 ">
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

          <NotificationBell isLoggedIn={isMounted && isLoggedIn} className="w-9 h-9" />

          {/* Shadcn Sheet Drawer Primitive Substitution */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 bg-gray-50 border-gray-200 text-gray-600 rounded-xl cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-[310px] p-5 flex flex-col bg-white gap-0 border-l border-gray-100"
            >
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  Configure Session
                </SheetTitle>
              </SheetHeader>

              {/* Location Picker Field */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Your Location
                </label>
                <select
                  value={selectedSavedAddress ? `address:${selectedSavedAddress.id}` : location}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("address:")) {
                      updateCartAddress(value.slice("address:".length));
                    } else {
                      setLocation(value);
                    }
                  }}
                  className="w-full bg-gray-50 text-sm text-gray-800 border border-gray-200 rounded-xl h-10 px-3 outline-none focus:border-amber-400 cursor-pointer"
                >
                  {addresses.length > 0 && (
                    <optgroup label="Your Addresses">
                      {addresses.map((address) => (
                        <option key={address.id} value={`address:${address.id}`}>
                          {address.label ?? address.customLabel ?? formatAddressLabel(address)}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Active Areas">
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Coming Soon">
                    {UNSUPPORTED_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc} (Coming Soon)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Dynamic Segment Selection Wrapper inside Panel */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Category Sector
                </label>
                <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link}
                      type="button"
                      onClick={() => handleNavChange(link)}
                      className={cn(
                        "py-1.5 text-xs font-medium rounded-lg text-center transition-colors truncate px-1 cursor-pointer",
                        active === link
                          ? "bg-white text-amber-600 shadow-xs font-semibold"
                          : "text-gray-500",
                      )}
                    >
                      {NAV_LINK_LABELS[link]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Drawer Filter Box */}
              <div className="flex-1 flex flex-col min-h-0">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Discover Treatments
                </label>
                <div className="flex items-center h-10 px-3 gap-2 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-amber-400 focus-within:bg-white mb-3 shrink-0">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSearchEverOpened(true);
                    }}
                    onFocus={() => setSearchEverOpened(true)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-sm text-gray-800 outline-none border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                  />
                </div>

                {/* Sub-Suggestion Result List Box Container */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {!query && (
                    <p className="text-xs text-gray-400 py-4 text-center">
                      Start typing to search services…
                    </p>
                  )}
                  {query && isSearchIndexLoading && searchResults.length === 0 && (
                    <p className="text-xs text-gray-400 py-4 text-center">
                      Searching…
                    </p>
                  )}
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left text-gray-600 hover:bg-amber-50/50 hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      <Search className="w-3 h-3 text-gray-300 shrink-0" />
                      <span className="truncate flex-1">{result.name}</span>
                      <span className="shrink-0 text-[10px] text-gray-400">
                        {result.categoryName}
                      </span>
                    </button>
                  ))}
                  {query && !isSearchIndexLoading && searchResults.length === 0 && (
                    <p className="text-xs text-gray-400 py-4 text-center">
                      No services found.
                    </p>
                  )}
                </div>
              </div>

              {/* Account / User Drawer Bottom Actions Footer section */}
              {isLoggedIn && (
              <div className="border-t border-gray-100 pt-4 mt-auto space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/bookings");
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 text-left transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    My Bookings
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/profile?section=settings");
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 text-left transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Account Settings
                  </span>
                </button>
              </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Global Booking Flow Cart Drawer */}
      <CartSheet />
      {loginOpen && (
        <AuthModal
          onClose={() => setLoginOpen(false)}
          onComplete={() => setIsLoggedIn(true)}
        />
      )}
    </nav>
  );
}
