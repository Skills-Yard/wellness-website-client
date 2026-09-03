"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, User, ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { DESKTOP_NAV_LINKS } from "@/src/utils/data";
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
import AuthModal from "@/src/components/auth/LazyAuthModal";
import { authApi } from "@/src/services/authApi";
import { unregisterPushToken } from "@/src/lib/notifications/push";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { notifyAuthChanged } from "@/src/utils/auth/authEvents";

// Only ever rendered once the cart icon is clicked — no reason to ship its
// JS (address forms, Razorpay glue, etc.) in the navbar's initial bundle.
const CartSheet = dynamic(() => import("@/src/components/cart/CartSheet"), {
  ssr: false,
  loading: () => null,
});

// Figma "Frame 415": a 54px white bar — leaf logo pinned left, the
// marketing links centered in the bar, a service search centered in the
// gap between them, then a cart icon, the "Book a Service" pill, and a
// bordered avatar on the right. Desktop only (`hidden md:flex`); mobile
// has its own MobileHeader.
export default function Navbar() {
  const { cartCount, setIsCartOpen, zoneId } = useCart();
  const { isMounted, isLoggedIn } = useAuthStatus();

  const router = useRouter();
  const pathname = usePathname();

  // Holds a landing-section id (see DESKTOP_NAV_LINKS); null = above the
  // first section. The scroll-spy effect keeps it in sync with manual
  // scrolling. Only meaningful on "/".
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const activeSectionId = pathname === "/" ? activeSection : null;
  // While a click-triggered smooth scroll animates, ignore scroll-spy
  // updates so the highlight doesn't flicker through passed sections.
  const spyLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // The full-catalog search index is only fetched once the field is used.
  // Stays true once flipped so the index persists across close/reopen.
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchEverOpened, setSearchEverOpened] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { items: searchIndex, isLoading: isSearchIndexLoading } =
    useServiceSearchIndex(zoneId, { enabled: searchEverOpened });
  const { query, setQuery, results: searchResults } =
    useServiceSearch(searchIndex);

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

  // Scroll-spy: keep the active nav link in sync with which landing
  // section is on screen. Above the first section, nothing is active.
  // Only runs on the home page, where these sections exist.
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = DESKTOP_NAV_LINKS.map((link) => link.sectionId);
    const LINE = 96; // bottom of the sticky bar

    let raf = 0;
    const recompute = () => {
      raf = 0;
      if (spyLockTimer.current !== null) return;

      const vh = window.innerHeight;
      let current: string | null = null;
      let bestVisible = 0;
      let firstTop = Infinity;

      for (const id of sectionIds) {
        const el = getVisibleElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        firstTop = Math.min(firstTop, r.top);
        const visible = Math.min(r.bottom, vh) - Math.max(r.top, LINE);
        if (visible > bestVisible) {
          bestVisible = visible;
          current = id;
        }
      }

      if (firstTop > LINE + 8) current = null;
      setActiveSection((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(recompute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf = requestAnimationFrame(recompute);
    const kicks = [250, 900, 2000].map((ms) => setTimeout(onScroll, ms));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      kicks.forEach(clearTimeout);
      if (spyLockTimer.current) clearTimeout(spyLockTimer.current);
    };
  }, [pathname]);

  const scrollToSection = (id: string) => {
    const element = getVisibleElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // The landing sections only exist on "/". Off the home page, navigate
  // there with `?tab=<sectionId>`; Home (page.tsx) picks it up once the
  // catalog has loaded and scrolls to it.
  const handleNavChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setQuery("");
    setSearchOpen(false);
    if (pathname === "/") {
      if (spyLockTimer.current) clearTimeout(spyLockTimer.current);
      spyLockTimer.current = setTimeout(() => {
        spyLockTimer.current = null;
      }, 900);
      scrollToSection(sectionId);
    } else {
      router.push(`/?tab=${sectionId}`);
    }
  };

  // Selecting a result deep-links to that service — same
  // `/detail/{slug}?categoryId=…&id=…` shape the detail page reads to
  // auto-open the service's modal, from any route.
  const handleResultClick = (result: SearchableService) => {
    setQuery("");
    setSearchOpen(false);
    router.push(
      `/detail/${result.categorySlug}?categoryId=${encodeURIComponent(result.categoryId)}&id=${encodeURIComponent(result.id)}`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults[0]) handleResultClick(searchResults[0]);
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
      notifyAuthChanged();
      router.replace("/");
    }
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 hidden h-[54px] w-full items-center border-b border-black/[0.06] bg-white transition-shadow duration-300 md:flex",
        scrolled ? "shadow-md" : "shadow-sm",
      )}
    >
      <div className="flex w-full items-center gap-3 pl-5 pr-6 lg:pl-6 lg:pr-10">
        {/* Logo — stacked leaf mark + wordmark, pinned left. */}
        <Link
          href="/"
          className="flex shrink-0 flex-col items-center gap-0.5"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <svg
            viewBox="0 0 32 32"
            className="h-6 w-6 rotate-[6deg]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="navLeafGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFCD0F" />
                <stop offset="100%" stopColor="#D38516" />
              </linearGradient>
            </defs>
            <g fill="url(#navLeafGradient)">
              <path d="M16 30C9 24 9 14 16 4C23 14 23 24 16 30Z" />
              <path
                d="M16 30C9 24 9 14 16 4C23 14 23 24 16 30Z"
                transform="rotate(-38 16 30)"
              />
              <path
                d="M16 30C9 24 9 14 16 4C23 14 23 24 16 30Z"
                transform="rotate(38 16 30)"
              />
            </g>
          </svg>
          <span className="font-serif text-[18px] uppercase leading-none tracking-[0.12em] text-[#6B4B22]">
            Eezit
          </span>
        </Link>

        {/* Service search — sits after the logo, with a gap. */}
        <div className="ml-6 shrink-0 lg:ml-10">
          <div
            className="relative hidden w-[190px] md:block lg:w-[220px]"
            ref={searchRef}
          >
            <div
              className={cn(
                "flex h-[39px] items-center gap-2 rounded-full border px-3.5 transition-all",
                searchOpen
                  ? "border-brand-strong bg-white shadow-[0_0_0_3px_rgba(211,133,22,0.12)]"
                  : "border-black/[0.08] bg-black/[0.03]",
              )}
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-[#25180F]/40" />
              <Input
                placeholder="Search services…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchEverOpened(true);
                  setSearchOpen(true);
                }}
                onFocus={() => {
                  setSearchEverOpened(true);
                  setSearchOpen(true);
                }}
                onKeyDown={handleKeyDown}
                className="h-auto flex-1 border-none bg-transparent p-0 text-[13px] text-[#25180F] shadow-none outline-none placeholder:text-[#25180F]/40 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="cursor-pointer"
                >
                  <X className="h-3.5 w-3.5 text-[#25180F]/40 hover:text-[#25180F]/70" />
                </button>
              )}
            </div>

            {searchOpen && (
              <div className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-[300px] -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                {!query && (
                  <p className="px-3 py-3 text-center text-sm text-gray-400">
                    Start typing to search services…
                  </p>
                )}
                {query && isSearchIndexLoading && searchResults.length === 0 && (
                  <p className="px-3 py-3 text-center text-sm text-gray-400">
                    Searching…
                  </p>
                )}
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleResultClick(result)}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Search className="h-3.5 w-3.5 shrink-0 opacity-40" />
                    <span className="flex-1 truncate">{result.name}</span>
                    <span className="shrink-0 text-xs text-gray-400">
                      {result.categoryName}
                    </span>
                  </button>
                ))}
                {query && !isSearchIndexLoading && searchResults.length === 0 && (
                  <p className="px-3 py-3 text-center text-sm text-gray-400">
                    No results for &quot;{query}&quot;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Marketing links — centered in the space between the search and
            the right group (not the whole bar). */}
        <div className="flex flex-1 items-center justify-center">
          <div className="hidden items-center lg:flex">
            {DESKTOP_NAV_LINKS.map((link) => (
              <button
                key={link.sectionId}
                type="button"
                onClick={() => handleNavChange(link.sectionId)}
                className={cn(
                  "flex items-center gap-1 rounded-full px-3 py-2.5 text-[12px] font-medium transition-colors focus-visible:outline-none cursor-pointer",
                  activeSectionId === link.sectionId
                    ? "bg-brand/10 text-brand-strong"
                    : "text-[#25180F] hover:bg-black/[0.04]",
                )}
              >
                {link.label}
                {link.sectionId === "our-services" && (
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right group (Figma "Frame 442"). */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Cart */}
          <Button
            onClick={() => setIsCartOpen(true)}
            variant="outline"
            size="icon"
            className="relative h-[39px] w-[39px] rounded-full border-[#25180F]/20 bg-white text-[#25180F] hover:bg-black/[0.04] cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" />
            {isMounted && cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Book a Service (Figma "Frame 51"). */}
          <Button
            onClick={() => handleNavChange("our-services")}
            className="h-[39px] shrink-0 rounded-full bg-[#25180F] px-[18px] text-[12px] font-medium text-white hover:bg-espresso-hover cursor-pointer"
          >
            Book a Service
          </Button>

          {/* Avatar (Figma "Frame 439"). */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-[39px] w-[39px] rounded-full border border-[#25180F] bg-white text-[#25180F] hover:bg-black/[0.04] cursor-pointer"
              >
                <User className="h-4 w-4" strokeWidth={2.25} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-2xl border-gray-100 bg-white p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
            >
              <DropdownMenuItem
                onClick={() => {
                  if (isLoggedIn) router.push("/profile");
                  else setLoginOpen(true);
                }}
                className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition-colors focus:bg-gray-50 focus:text-gray-900"
              >
                {isLoggedIn ? "Profile" : "Log in"}
              </DropdownMenuItem>
              {isLoggedIn && (
                <DropdownMenuItem
                  onClick={() => router.push("/bookings")}
                  className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition-colors focus:bg-gray-50 focus:text-gray-900"
                >
                  My Bookings
                </DropdownMenuItem>
              )}
              {isLoggedIn && (
                <DropdownMenuItem
                  onClick={() => router.push("/profile?section=settings")}
                  className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition-colors focus:bg-gray-50 focus:text-gray-900"
                >
                  Account Settings
                </DropdownMenuItem>
              )}
              {isLoggedIn && (
                <DropdownMenuItem
                  onClick={() => {
                    void handleLogout();
                  }}
                  className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors focus:bg-red-50 focus:text-red-700"
                >
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Global booking-flow cart drawer */}
      <CartSheet />
      {loginOpen && <AuthModal onClose={() => setLoginOpen(false)} />}
    </nav>
  );
}
