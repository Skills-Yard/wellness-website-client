"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Switch } from "@/src/components/ui/switch";
import { tempUser, UserProfile } from "@/src/utils/data/tempUserData";
import {
  Home as HomeIcon,
  Flower2,
  Sparkles,
  ShoppingCart,
  User,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/src/context/CartContext";
import AuthModal from "../auth/AuthModal";
import BottomNav from "../home/mobile/Bottomnav";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

const AccountSection = ({
  user,
  onEdit,
}: {
  user: UserProfile;
  onEdit: () => void;
}) => {
  const isProfileComplete = user.name && user.email;




  return (



    /* ==========================================
       AUTHENTICATED STATE (Actual Profile)
       ========================================== */
    <AccordionItem value="account" className="border-b-slate-200 py-2">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <span className="text-lg font-bold text-slate-900">
            Account Details
          </span>
          {!isProfileComplete && (
            <span className="inline-flex animate-pulse items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800">
              INCOMPLETE
            </span>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-2 text-slate-600">
        <p className="mb-6 text-sm text-slate-500">
          Manage your personal information
        </p>

        {!isProfileComplete && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              Please complete your profile to receive booking confirmations
              and exclusive offers.
            </p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-slate-500">
              Mobile Number
            </label>
            <div className="mt-1 flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <span className="font-medium">{user.phone}</span>
              <span className="text-xs font-semibold text-green-600">
                Verified ✓
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">
              Full Name
            </label>
            <div className="mt-1 flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
              <span
                className={
                  user.name ? "text-slate-900" : "text-slate-400 italic"
                }
              >
                {user.name || "Not provided yet"}
              </span>
              <button
                onClick={onEdit}
                className="font-semibold text-amber-600 transition-colors hover:text-amber-700 cursor-pointer"
              >
                {user.name ? "Edit" : "Add"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">
              Email Address
            </label>
            <div className="mt-1 flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
              <span
                className={
                  user.email ? "text-slate-900" : "text-slate-400 italic"
                }
              >
                {user.email || "Not provided yet"}
              </span>
              <button
                onClick={onEdit}
                className="font-semibold text-amber-600 transition-colors hover:text-amber-700 cursor-pointer"
              >
                {user.email ? "Edit" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>

  );
};

// ==========================================
// 2. ADDRESS COMPONENT
// ==========================================
const AddAddressCard = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <button
      onClick={onAdd}
      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-amber-600 transition-all hover:border-amber-300 hover:bg-amber-50 active:scale-[0.98] cursor-pointer"
    >
      <span className="text-lg">+</span> Add New Address
    </button>
  );
};

const AddressSection = ({ user }: { user: UserProfile }) => {
  const handleAddAddress = () => {
    alert("Open address modal or navigate to map here!");
  };

  return (
    <AccordionItem value="address" className="border-b-slate-200 py-2">
      <AccordionTrigger className="hover:no-underline">
        <span className="text-lg font-bold text-slate-900">
          Saved Addresses
        </span>
      </AccordionTrigger>

      <AccordionContent className="pt-2">
        <p className="mb-6 text-sm text-slate-500">
          Manage where we deliver our spa services.
        </p>

        <div className="space-y-4">
          {/* List Existing Addresses */}
          {user.addresses.map((address) => (
            <div
              key={address.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {address.type}
                </span>
                <div className="flex gap-3 text-sm font-medium text-amber-600">
                  <button className="hover:text-amber-700 cursor-pointer">Edit</button>
                  <button className="text-red-500 hover:text-red-600 cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {address.fullAddress}
              </p>
            </div>
          ))}

          {/* Add New Address Component */}
          <AddAddressCard onAdd={handleAddAddress} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// ==========================================
// 3. SETTINGS COMPONENT
// ==========================================
const SettingsSection = () => {
  return (
    <AccordionItem value="settings" className="border-b-slate-200 py-2">
      <AccordionTrigger className="hover:no-underline">
        <span className="text-lg font-bold text-slate-900">Settings</span>
      </AccordionTrigger>

      <AccordionContent className="pt-2">
        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <p className="font-medium text-slate-900">Push Notifications</p>
              <p className="text-xs text-slate-500">Updates on your bookings</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <p className="font-medium text-slate-900">Location Services</p>
              <p className="text-xs text-slate-500">
                For accurate service delivery
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// ==========================================
// 4. ABOUT COMPONENT
// ==========================================
const AboutSection = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const handleLogout = () => {
    // 1. Clears all local storage data
    localStorage.clear();

    // 2. Refreshes the page to reset the app state
    window.location.reload();
  };
  return (
    <AccordionItem value="about" className="border-none py-2">
      <AccordionTrigger className="hover:no-underline">
        <span className="text-lg font-bold text-slate-900">
          About Spa Prime
        </span>
      </AccordionTrigger>

      <AccordionContent className="pt-2">
        <div className="space-y-2 text-sm text-slate-700">
          <button className="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50 hover:text-amber-600 cursor-pointer">
            <span className="font-medium">Terms & Conditions</span>
            <span className="text-slate-400">→</span>
          </button>
          <button className="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50 hover:text-amber-600 cursor-pointer">
            <span className="font-medium">Privacy Policy</span>
            <span className="text-slate-400">→</span>
          </button>
          <button
            onClick={() => handleLogout()}
            className="mt-4 flex w-full items-center justify-between rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
          >
            <span className="font-medium">Log Out</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-slate-400">
            App Version 1.0.4
          </p>
        </div>
      </AccordionContent>

      {loginOpen && <AuthModal onClose={() => setLoginOpen(false)} />}
    </AccordionItem>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function ProfilePage() {
  const router = useRouter();
  const [user] = useState<UserProfile>(tempUser);
  const { cartCount, setIsCartOpen } = useCart();

  const [isLogin, setIsLogin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Prevents Next.js hydration mismatch errors
  const [isMounted, setIsMounted] = useState(false);

  // This function is called when the user successfully finishes the AuthModal flow
  // 1. Check local storage when the component loads
  useEffect(() => {
    setIsMounted(true);
    const storedLoginState = localStorage.getItem("isUserLoggedIn");

    if (storedLoginState === "true") {
      setIsLogin(true);
    }
  }, []);

  // 2. Update state AND local storage on successful login
  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    setIsLogin(true);

    // Save to local storage so it survives a refresh!
    localStorage.setItem("isUserLoggedIn", "true");

    toast.success("Successfully logged in!");
  };

  // Do not render the UI until we have checked local storage on the client
  if (!isMounted) return null;

  const handleEditProfile = () => {
    alert("Open an edit modal or navigate to an edit page here!");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 relative">
      {/* 1. Global Toaster Component for notifications */}
      <ToastContainer position="top-center" />
      {!isLogin ? (
        /* ==========================================
           UNAUTHENTICATED STATE (Empty Profile View)
           ========================================== */
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 animate-in fade-in duration-500">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {/* Decorative Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-500 shadow-inner">
              <UserCircle2 className="h-12 w-12" strokeWidth={1.5} />
            </div>

            {/* Text Content */}
            <h2 className="mb-3 text-2xl font-bold text-slate-900">
              Your Profile
            </h2>
            <p className="mb-10 text-base text-slate-500 leading-relaxed px-4">
              Log in or sign up to view your account details, manage saved
              addresses, and check your bookings.
            </p>

            {/* Shadcn-style Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-4 font-bold text-white transition-all active:scale-[0.98] hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 cursor-pointer"
            >
              <ShieldCheck className="h-5 w-5" />
              Login to continue
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-2xl bg-white px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Profile
              </h1>
            </div>

            {/* Accordion Layout wrapper */}
            <div className="rounded-2xl border border-slate-200 bg-white px-5 shadow-sm">
              <Accordion
                type="single"
                collapsible
                defaultValue="account"
                className="w-full"
              >
                <AccountSection user={user} onEdit={handleEditProfile} />
                <AddressSection user={user} />
                <SettingsSection />
                <AboutSection />
              </Accordion>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation Bar (mobile only) ──────────── */}
      <div className="block md:hidden">
        <BottomNav
          activeTab="profile"
          onTabClick={(tabId) => {
            if (tabId === "top" || tabId === "home") {
              router.push("/");
            } else {
              router.push(`/?tab=${tabId}`);
            }
          }}
        />
      </div>

      {/* ==========================================
          AUTH MODAL POPUP
          ========================================== */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          // Pass the success handler. Make sure your AuthModal calls this when the OTP/Setup is done!
          onComplete={handleLoginSuccess}
        />
      )}
    </div>
  );
}
