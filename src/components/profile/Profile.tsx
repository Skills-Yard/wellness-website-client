"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Switch } from "@/src/components/ui/switch";
import {
  ShieldCheck,
  UserCircle2,
  MonitorSmartphone,
} from "lucide-react";
import AuthModal from "../auth/LazyAuthModal";
import BottomNav from "../home/mobile/Bottomnav";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { authApi } from "@/src/services/authApi";
import { requestPushNotifications, unregisterPushToken } from "@/src/lib/notifications/push";
import Link from "next/link";
import { Bell, CalendarClock } from "lucide-react";
import { useMe, useUpdateProfile, useNotificationPreference, useUpdateNotificationPreference } from "@/src/hooks/queries/useProfile";
import { useAddresses, useCreateAddress, useUpdateAddress, useRemoveAddress } from "@/src/hooks/queries/useAddresses";
import type { Address } from "@/src/services/addressApi";
import type { UserProfile } from "@/src/types/auth";
import { AddressPicker, type AddressInput } from "@/src/components/addresses/AddressPicker";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

// ==========================================
// 1. ACCOUNT COMPONENT
// ==========================================
const AccountSection = ({
  profile,
  isLoading,
  isSaving,
  onSave,
}: {
  profile: UserProfile | undefined;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (values: { name: string; email: string }) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Seed the draft from whatever's currently loaded whenever we're not
  // mid-edit — keeps the form in sync once useMe() resolves without
  // clobbering what the user is actively typing.
  useEffect(() => {
    if (isEditing) return;
    setName(profile?.name ?? "");
    setEmail(profile?.email ?? "");
  }, [profile, isEditing]);

  const isProfileComplete = !!profile?.name && !!profile?.email;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ name: name.trim(), email: email.trim() });
    setIsEditing(false);
  };

  return (
    <AccordionItem value="account" className="border-b-slate-200 py-2">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <span className="text-lg font-bold text-slate-900">
            Account Details
          </span>
          {!isLoading && !isProfileComplete && (
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

        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <>
            {!isProfileComplete && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  Please complete your profile to receive booking confirmations
                  and exclusive offers.
                </p>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500">Full Name</label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-bold text-white hover:bg-amber-500/90 disabled:opacity-60 cursor-pointer"
                  >
                    {isSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-500">
                    Mobile Number
                  </label>
                  <div className="mt-1 flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    <span className="font-medium">
                      {profile?.phone ? `${profile.countryCode} ${profile.phone}` : "—"}
                    </span>
                    {profile?.isPhoneVerified && (
                      <span className="text-xs font-semibold text-green-600">
                        Verified ✓
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500">
                    Full Name
                  </label>
                  <div className="mt-1 flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                    <span
                      className={
                        profile?.name ? "text-slate-900" : "text-slate-400 italic"
                      }
                    >
                      {profile?.name || "Not provided yet"}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="font-semibold text-amber-600 transition-colors hover:text-amber-700 cursor-pointer"
                    >
                      {profile?.name ? "Edit" : "Add"}
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
                        profile?.email ? "text-slate-900" : "text-slate-400 italic"
                      }
                    >
                      {profile?.email || "Not provided yet"}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="font-semibold text-amber-600 transition-colors hover:text-amber-700 cursor-pointer"
                    >
                      {profile?.email ? "Edit" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

// ==========================================
// 2. ADDRESS COMPONENT
// ==========================================
const AddressSection = ({
  addresses,
  isLoading,
  isSaving,
  isDeleting,
  onCreate,
  onUpdate,
  onDelete,
}: {
  addresses: Address[];
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onCreate: (address: AddressInput) => void;
  onUpdate: (addressId: string, address: AddressInput) => void;
  onDelete: (addressId: string) => void;
}) => {
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

        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          // AddressPicker (shared with checkout's address step) already
          // renders the full list — each row with working Edit/Delete —
          // plus the add/edit form together, so there's no separate
          // "view mode" card list to keep in sync with it here.
          <div className="-mx-1 overflow-hidden rounded-xl border border-slate-100">
            <AddressPicker
              addresses={addresses}
              isSaving={isSaving}
              isDeleting={isDeleting}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

// ==========================================
// 3. SETTINGS COMPONENT
// ==========================================
const SettingsSection = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isTogglingPush, setIsTogglingPush] = useState(false);

  const { data: preference } = useNotificationPreference();
  const updatePreference = useUpdateNotificationPreference();

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  }, []);

  const handleTogglePush = async (checked: boolean) => {
    const accessToken = getAccessToken();
    if (!accessToken || isTogglingPush) return;

    setIsTogglingPush(true);
    try {
      if (checked) {
        const registered = await requestPushNotifications(accessToken);
        setPushEnabled(registered);
        if (!registered) {
          toast.error("Couldn't enable notifications. Check your browser's permission settings.");
        }
      } else {
        // Browser permission itself can only be revoked from browser settings —
        // this stops the backend from targeting this device going forward.
        await unregisterPushToken(accessToken);
        setPushEnabled(false);
      }
    } finally {
      setIsTogglingPush(false);
    }
  };

  return (
    <AccordionItem value="settings" className="border-b-slate-200 py-2">
      <AccordionTrigger className="hover:no-underline">
        <span className="text-lg font-bold text-slate-900">Settings</span>
      </AccordionTrigger>

      <AccordionContent className="pt-2">
        <div className="divide-y divide-slate-100">
          <Link
            href="/bookings"
            className="flex items-center justify-between py-4 hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <CalendarClock className="h-4 w-4 text-amber-500" />
              <div className="space-y-0.5">
                <p className="font-medium text-slate-900">My Bookings</p>
                <p className="text-xs text-slate-500">View upcoming and past bookings</p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </Link>

          <Link
            href="/profile/notifications"
            className="flex items-center justify-between py-4 hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-amber-500" />
              <div className="space-y-0.5">
                <p className="font-medium text-slate-900">Notifications</p>
                <p className="text-xs text-slate-500">View booking updates and offers</p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </Link>

          <Link
            href="/profile/devices"
            className="flex items-center justify-between py-4 hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <MonitorSmartphone className="h-4 w-4 text-amber-500" />
              <div className="space-y-0.5">
                <p className="font-medium text-slate-900">Devices</p>
                <p className="text-xs text-slate-500">Manage where you&apos;re logged in</p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </Link>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <p className="font-medium text-slate-900">Push Notifications</p>
              <p className="text-xs text-slate-500">Get notified on this device</p>
            </div>
            <Switch
              checked={pushEnabled}
              disabled={isTogglingPush}
              onCheckedChange={(checked) => void handleTogglePush(checked)}
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <p className="font-medium text-slate-900">WhatsApp Updates</p>
              <p className="text-xs text-slate-500">Booking updates over WhatsApp</p>
            </div>
            <Switch
              checked={preference?.whatsappOptIn ?? false}
              onCheckedChange={(checked) => updatePreference.mutate({ whatsappOptIn: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <p className="font-medium text-slate-900">Offers & Promotions</p>
              <p className="text-xs text-slate-500">Occasional deals and discounts</p>
            </div>
            <Switch
              checked={preference?.promotionalOptIn ?? false}
              onCheckedChange={(checked) => updatePreference.mutate({ promotionalOptIn: checked })}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// ==========================================
// 4. ABOUT COMPONENT
// ==========================================
const AboutSection = ({
  onLogout,
  isLoggingOut,
}: {
  onLogout: () => void;
  isLoggingOut: boolean;
}) => {
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
            onClick={onLogout}
            disabled={isLoggingOut}
            className="mt-4 flex w-full items-center justify-between rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
          >
            <span className="font-medium">
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-slate-400">
            App Version 1.0.4
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function ProfilePage() {
  const router = useRouter();

  // Gates this whole page on a present *and* unexpired access token (not
  // just the `isUserLoggedIn` flag, which outlives an actually-expired
  // token) — showAuthModal starts true the moment that check comes back
  // negative, so a visitor lands straight on the login prompt instead of
  // needing to find and click "Login to continue" first.
  const {
    isMounted,
    isLoggedIn: isLogin,
    setIsLoggedIn: setIsLogin,
    showAuthModal,
    setShowAuthModal,
    handleAuthComplete,
  } = useRequireAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // Which accordion section opens first — read from ?section= below so
  // links like the navbar's "Account Settings" can land directly on it,
  // same `new URLSearchParams(window.location.search)` convention
  // useMobileHome.ts already uses for its own ?tab= deep link.
  const [openSection, setOpenSection] = useState("account");

  const { data: profile, isLoading: isProfileLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const removeAddress = useRemoveAddress();

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get("section");
    if (section === "settings") {
      setOpenSection("settings");
    }
  }, []);

  // Called when the user successfully finishes the AuthModal flow.
  const handleLoginSuccess = () => {
    handleAuthComplete();
    // Kept alongside the token check for the other places that still read
    // this flag directly (e.g. Navbar, BottomNav badges).
    localStorage.setItem("isUserLoggedIn", "true");
    toast.success("Successfully logged in!");
  };

  // Do not render the UI until we have checked local storage on the client
  if (!isMounted) return null;

  const handleSaveProfile = (values: { name: string; email: string }) => {
    updateProfile.mutate(values, {
      onSuccess: () => toast.success("Profile updated."),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update your profile."),
    });
  };

  const handleCreateAddress = (values: AddressInput) => {
    if (!profile) return;
    createAddress.mutate(
      { ...values, userId: profile.id },
      {
        onSuccess: () => toast.success("Address added."),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't add this address."),
      },
    );
  };

  const handleUpdateAddress = (addressId: string, values: AddressInput) => {
    updateAddress.mutate(
      { addressId, body: values },
      {
        onSuccess: () => toast.success("Address updated."),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update this address."),
      },
    );
  };

  const handleDeleteAddress = (addressId: string) => {
    removeAddress.mutate(addressId, {
      onSuccess: () => toast.success("Address removed."),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't remove this address."),
    });
  };

  const handleLogout = async () => {
    const accessToken = getAccessToken();
    setIsLoggingOut(true);

    try {
      if (accessToken) {
        await unregisterPushToken(accessToken);
        await authApi.logout(accessToken);
      }
    } catch {
      // The local session should still end if the server session has expired.
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("isUserLoggedIn");
      setIsLogin(false);
      setIsLoggingOut(false);
      router.replace("/");
    }
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
          <div className="w-full max-w-md  p-4 text-center ">
            {/* Decorative Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-500 shadow-inner">
              <UserCircle2 className="h-12 w-12" strokeWidth={1.5} />
            </div>

            {/* Text Content */}
            <h2 className="mb-3 text-2xl font-bold text-slate-900">
              Your Profile
            </h2>
            <p className="mb-6 text-base text-slate-500 leading-relaxed">
              Log in or sign up to view your account details, manage saved
              addresses, and check your bookings.
            </p>

            {/* Shadcn-style Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-fit mx-auto flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-8 py-3 font-bold text-white transition-all active:scale-[0.98] hover:bg-amber-500/90 hover:scale-101  cursor-pointer"
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
                defaultValue={openSection}
                className="w-full"
              >
                <AccountSection
                  profile={profile}
                  isLoading={isProfileLoading}
                  isSaving={updateProfile.isPending}
                  onSave={handleSaveProfile}
                />
                <AddressSection
                  addresses={addresses}
                  isLoading={isAddressesLoading}
                  isSaving={createAddress.isPending || updateAddress.isPending}
                  isDeleting={removeAddress.isPending}
                  onCreate={handleCreateAddress}
                  onUpdate={handleUpdateAddress}
                  onDelete={handleDeleteAddress}
                />
                <SettingsSection />
                <AboutSection
                  onLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                />
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
