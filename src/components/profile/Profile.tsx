"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  CalendarDays,
  Camera,
  CircleDashed,
  Clock,
  Headset,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  MonitorSmartphone,
  Pencil,
  Phone,
  RefreshCw,
  Settings,
  ShieldCheck,
  Ticket,
  User as UserIcon,
  UserCircle2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Switch } from "@/src/components/ui/switch";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import AuthModal from "../auth/LazyAuthModal";
import BottomNav from "../home/mobile/Bottomnav";
import { authApi } from "@/src/services/authApi";
import { requestPushNotifications, unregisterPushToken } from "@/src/lib/notifications/push";
import {
  useMe,
  useUpdateProfile,
  useUpdateNotificationPreference,
} from "@/src/hooks/queries/useProfile";
import {
  useCreateAddress,
  useUpdateAddress,
  useRemoveAddress,
} from "@/src/hooks/queries/useAddresses";
import type { CreateAddressBody } from "@/src/services/addressApi";
import type { MeAddress, MePreferences, UserProfile } from "@/src/types/auth";
import { userApi } from "@/src/services/userApi";
import { resolveCdnUrl } from "@/src/utils/media";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import AddressBook from "./AddressBook";
import DevicesTable from "./DevicesTable";
import ImageCropModal from "./ImageCropModal";
import type { AddressFormValues } from "./EditAddressModal";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

type SectionId = "overview" | "addresses" | "devices" | "preferences" | "account";

const NAV: { id: SectionId; label: string; icon: typeof UserIcon }[] = [
  { id: "overview", label: "Profile Overview", icon: UserIcon },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "devices", label: "Devices", icon: MonitorSmartphone },
  { id: "preferences", label: "Preferences", icon: Bell },
  { id: "account", label: "Account Settings", icon: Settings },
];

const SECTION_META: Record<SectionId, { title: string; subtitle: string }> = {
  overview: {
    title: "Profile Overview",
    subtitle: "Manage your personal information and account details",
  },
  addresses: { title: "Addresses", subtitle: "Where we deliver your bookings" },
  devices: { title: "Devices", subtitle: "Places you're signed in" },
  preferences: { title: "Preferences", subtitle: "How we keep in touch with you" },
  account: { title: "Account Settings", subtitle: "Security and account controls" },
};

// ── formatting helpers ───────────────────────────────────────────────
const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};
const fmtDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d
        .toLocaleString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", "");
};
const titleCase = (s?: string | null) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "—";
const initials = (name?: string | null) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

// ── shared bits ──────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-black/5 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof UserIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#999]" />
      <div className="min-w-0">
        <p className="text-xs text-[#999]">{label}</p>
        <div className="mt-0.5 text-sm font-medium break-words text-espresso">{children}</div>
      </div>
    </div>
  );
}

const editBtnCls =
  "inline-flex items-center gap-1.5 rounded-lg border border-amber-600/40 px-3 py-1.5 text-xs font-semibold text-amber-600 transition-colors hover:bg-[#FBF1E0]";

// ── Edit Profile modal ───────────────────────────────────────────────
function EditProfileModal({
  profile,
  isSaving,
  onClose,
  onSave,
}: {
  profile: UserProfile;
  isSaving: boolean;
  onClose: () => void;
  onSave: (v: { name: string; email: string; dateOfBirth: string; gender: string }) => void;
}) {
  const [name, setName] = useState(profile.name ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [dob, setDob] = useState(
    profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().slice(0, 10) : "",
  );
  const [gender, setGender] = useState(profile.gender ?? "");

  const inputCls =
    "mt-1 h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-espresso outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25";

  return (
    <Dialog open onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 flex h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-white p-0 sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[90vh] sm:w-[calc(100%-2rem)] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border sm:border-black/10 sm:shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-black/5 px-5 py-4">
          <h2 className="text-base font-semibold text-espresso">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#666] hover:bg-stone-100 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isSaving) onSave({ name: name.trim(), email: email.trim(), dateOfBirth: dob, gender });
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <label className="block">
              <span className="text-xs font-medium text-[#666]">Full Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-[#666]">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-[#666]">Date of Birth</span>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-[#666]">Gender</span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>
            </div>
            <div className="rounded-lg bg-stone-50 px-3 py-2.5 text-xs text-[#666]">
              Mobile number:{" "}
              <span className="font-medium text-espresso">
                {profile.phone ? `${profile.countryCode} ${profile.phone}` : "—"}
              </span>{" "}
              {profile.isPhoneVerified && <span className="text-[#208900]">· Verified</span>}
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-black/5 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium text-[#666] hover:bg-stone-50 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Preferences panel (used in Overview + its own section) ────────────
// Toggles apply immediately — there's no separate "Edit Preferences" step.
const PREF_ROWS: { key: keyof MePreferences; label: string; hint: string; icon: typeof Bell }[] = [
  { key: "whatsappOptIn", label: "WhatsApp Notifications", hint: "Booking updates over WhatsApp", icon: MessageCircle },
  { key: "emailOptIn", label: "Email Notifications", hint: "Receipts and confirmations by email", icon: Mail },
  { key: "pushOptIn", label: "Push Notifications", hint: "Alerts on your devices", icon: Bell },
  { key: "promotionalOptIn", label: "Promotional Updates", hint: "Occasional offers and deals", icon: Megaphone },
];

function PreferencesPanel({
  preferences,
  isSaving,
  onToggle,
}: {
  preferences: MePreferences;
  isSaving: boolean;
  onToggle: (key: keyof MePreferences, value: boolean) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Bell className="h-4.5 w-4.5 text-brown" />
        <h2 className="text-base font-semibold text-espresso">Preferences</h2>
      </div>
      <div className="divide-y divide-black/5">
        {PREF_ROWS.map(({ key, label, hint, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between gap-3 py-3.5">
            <div className="flex min-w-0 items-start gap-2.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brown" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-espresso">{label}</p>
                <p className="text-xs text-[#999]">{hint}</p>
              </div>
            </div>
            <Switch
              checked={preferences[key]}
              disabled={isSaving}
              onCheckedChange={(v) => onToggle(key, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const {
    isMounted,
    isLoggedIn: isLogin,
    setIsLoggedIn: setIsLogin,
    showAuthModal,
    setShowAuthModal,
    handleAuthComplete,
  } = useRequireAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // Deep link: /profile?section=settings (navbar's "Account Settings") etc.
  // Read once, synchronously — this is a client-only component.
  const [section, setSection] = useState<SectionId>(() => {
    if (typeof window === "undefined") return "overview";
    const raw = new URLSearchParams(window.location.search).get("section");
    const map: Record<string, SectionId> = {
      settings: "account",
      account: "account",
      addresses: "addresses",
      devices: "devices",
      preferences: "preferences",
      overview: "overview",
    };
    return (raw && map[raw]) || "overview";
  });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pushEnabled, setPushEnabled] = useState(
    () =>
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted",
  );
  const [isTogglingPush, setIsTogglingPush] = useState(false);

  const { data: profile, isLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const updatePreference = useUpdateNotificationPreference();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const removeAddress = useRemoveAddress();

  const preferences: MePreferences = useMemo(
    () => ({
      whatsappOptIn: profile?.preferences?.whatsappOptIn ?? false,
      emailOptIn: profile?.preferences?.emailOptIn ?? false,
      pushOptIn: profile?.preferences?.pushOptIn ?? false,
      promotionalOptIn: profile?.preferences?.promotionalOptIn ?? false,
    }),
    [profile],
  );

  const addresses: MeAddress[] = profile?.addresses ?? [];
  const isAddressSaving = createAddress.isPending || updateAddress.isPending;
  const photoUrl = photoPreview ?? resolveCdnUrl(profile?.profilePhotoKey);

  if (!isMounted) return null;

  // ── handlers ──
  const handleLoginSuccess = () => {
    handleAuthComplete();
    localStorage.setItem("isUserLoggedIn", "true");
    toast.success("Successfully logged in!");
  };

  const handleSaveProfile = (v: {
    name: string;
    email: string;
    dateOfBirth: string;
    gender: string;
  }) => {
    const body: Record<string, string> = {};
    if (v.name) body.name = v.name;
    if (v.email) body.email = v.email;
    if (v.dateOfBirth) body.dateOfBirth = `${v.dateOfBirth}T00:00:00.000Z`;
    if (v.gender) body.gender = v.gender;
    updateProfile.mutate(body, {
      onSuccess: () => {
        toast.success("Profile updated.");
        setProfileModalOpen(false);
      },
      onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't update your profile."),
    });
  };

  // Step 1: a file was picked — validate, then open the crop modal.
  // Nothing hits the network until the user confirms a crop.
  const handlePhotoPicked = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB.");
      return;
    }
    setCropFile(file);
  };

  // Step 2: crop confirmed — show the cropped preview instantly, then
  // upload the cropped square.
  const handleCropConfirm = (blob: Blob, previewUrl: string) => {
    setCropFile(null);
    setPhotoPreview(previewUrl);
    void handlePhotoUpload(new File([blob], "profile-photo.jpg", { type: "image/jpeg" }));
  };

  const handlePhotoUpload = async (file: File) => {
    if (isUploadingPhoto) return;
    const token = getAccessToken();
    if (!token) return;
    setIsUploadingPhoto(true);
    try {
      // Store the raw r2Key on the profile — the CDN domain is joined on
      // only for display (resolveCdnUrl), never persisted.
      const r2Key = await userApi.uploadProfilePhoto(file, token);
      updateProfile.mutate(
        { profilePhotoKey: r2Key },
        {
          onSuccess: () => {
            toast.success("Photo updated.");
            setPhotoPreview(null);
          },
          onError: (e) => {
            setPhotoPreview(null);
            toast.error(e instanceof Error ? e.message : "Couldn't save the photo.");
          },
        },
      );
    } catch (e) {
      setPhotoPreview(null);
      toast.error(e instanceof Error ? e.message : "Couldn't upload the photo.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleTogglePref = (key: keyof MePreferences, value: boolean) => {
    // The switch itself flips instantly (useUpdateNotificationPreference
    // patches the cache optimistically) — this toast just lets the user
    // know the change is still being saved in the background, and confirms
    // or reverts once the request settles.
    const toastId = toast.loading("Saving changes…");
    updatePreference.mutate(
      { ...preferences, [key]: value },
      {
        onSuccess: () =>
          toast.update(toastId, {
            render: "Preferences updated.",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          }),
        onError: (e) =>
          toast.update(toastId, {
            render: e instanceof Error ? e.message : "Couldn't update preferences.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          }),
      },
    );
  };

  const toNum = (s: string) => {
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  // POST and PATCH take the identical body, so create/update/set-default
  // all go through here. `base` (an existing address) fills the gaps for
  // the partial "set as default" case.
  const buildAddressBody = (
    v: Partial<AddressFormValues> & { isDefault?: boolean },
    base?: MeAddress,
  ): CreateAddressBody => {
    const body: CreateAddressBody = {
      userId: profile?.id ?? "",
      label: v.label ?? base?.label ?? "HOME",
      customLabel: v.customLabel ?? base?.customLabel ?? "",
      line1: (v.line1 ?? base?.line1 ?? "").trim(),
      line2: (v.line2 ?? base?.line2 ?? "").trim(),
      landmark: (v.landmark ?? base?.landmark ?? "").trim(),
      city: (v.city ?? base?.city ?? "").trim(),
      state: (v.state ?? base?.state ?? "").trim(),
      pincode: (v.pincode ?? base?.pincode ?? "").trim(),
      latitude: v.latitude != null ? toNum(v.latitude) : (base?.latitude ?? 0),
      longitude: v.longitude != null ? toNum(v.longitude) : (base?.longitude ?? 0),
      isDefault: v.isDefault ?? base?.isDefault ?? false,
    };
    const name = v.customerName ?? base?.customerName;
    const code = v.customerCountryCode ?? base?.customerCountryCode;
    if (name) body.customerName = name.trim();
    if (code) body.customerCountryCode = code;
    if (v.customerPhone) body.customerPhone = v.customerPhone.trim();
    return body;
  };

  const handleCreateAddress = (v: AddressFormValues) => {
    if (!profile) return;
    createAddress.mutate(buildAddressBody(v), {
      onSuccess: () => toast.success("Address added."),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't add this address."),
    });
  };

  const handleUpdateAddress = (id: string, v: AddressFormValues) => {
    updateAddress.mutate(
      { addressId: id, body: buildAddressBody(v) },
      {
        onSuccess: () => toast.success("Address updated."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't update this address."),
      },
    );
  };

  const handleSetDefault = (addr: MeAddress) => {
    updateAddress.mutate(
      { addressId: addr.id, body: buildAddressBody({ isDefault: true }, addr) },
      {
        onSuccess: () => toast.success("Default address updated."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't set default."),
      },
    );
  };

  const handleDeleteAddress = (id: string) => {
    if (!window.confirm("Remove this address?")) return;
    removeAddress.mutate(id, {
      onSuccess: () => toast.success("Address removed."),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't remove this address."),
    });
  };

  const handleTogglePush = async (checked: boolean) => {
    const token = getAccessToken();
    if (!token || isTogglingPush) return;
    setIsTogglingPush(true);
    try {
      if (checked) {
        const ok = await requestPushNotifications(token);
        setPushEnabled(ok);
        if (!ok) toast.error("Couldn't enable notifications. Check your browser permissions.");
      } else {
        await unregisterPushToken(token);
        setPushEnabled(false);
      }
    } finally {
      setIsTogglingPush(false);
    }
  };

  const handleLogout = async () => {
    const token = getAccessToken();
    setIsLoggingOut(true);
    try {
      if (token) {
        await unregisterPushToken(token);
        await authApi.logout(token);
      }
    } catch {
      /* local session ends regardless */
    } finally {
      ["accessToken", "refreshToken", "userProfile", "isUserLoggedIn"].forEach((k) =>
        localStorage.removeItem(k),
      );
      setIsLogin(false);
      setIsLoggingOut(false);
      router.replace("/");
    }
  };

  // ── unauthenticated ──
  if (!isLogin) {
    return (
      <div className="min-h-screen bg-[#FAF8F4]">
        <ToastContainer position="top-center" />
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#FBF7ED] text-amber-600">
            <UserCircle2 className="h-12 w-12" strokeWidth={1.5} />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-espresso">Your Profile</h2>
          <p className="mb-6 max-w-md text-base leading-relaxed text-[#666]">
            Log in or sign up to view your account details, manage saved addresses, and check your
            bookings.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="mx-auto flex w-fit items-center justify-center gap-2 rounded-xl bg-amber-600 px-8 py-3 font-semibold text-white transition-all hover:bg-amber-700 active:scale-[0.98]"
          >
            <ShieldCheck className="h-5 w-5" />
            Login to continue
          </button>
        </div>
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} onComplete={handleLoginSuccess} />
        )}
      </div>
    );
  }

  const meta = SECTION_META[section];

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-24 lg:h-screen lg:overflow-hidden lg:pb-0">
      <ToastContainer position="top-center" />

      <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:h-full lg:px-8 lg:py-6">
        {/* Page header */}
        <div className="mb-4 flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white text-espresso hover:bg-stone-50 lg:hidden"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-espresso sm:text-2xl">
            {meta.title}
          </h1>
        </div>

        <div className="lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
          {/* Sidebar — stays put; only the content pane scrolls */}
          <aside className="lg:h-full lg:overflow-hidden">
            <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0">
              {NAV.map(({ id, label, icon: Icon }) => {
                const active = section === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSection(id)}
                    className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors lg:w-full ${
                      active
                        ? "bg-espresso text-white"
                        : "text-[#666] hover:bg-black/5 lg:hover:bg-black/[0.04]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 hidden rounded-2xl border border-black/5 bg-white p-4 lg:block">
              <div className="flex items-center gap-2.5">
                <Headset className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-espresso">Need Help?</p>
                  <p className="text-xs text-[#999]">We&apos;re here to help you</p>
                </div>
              </div>
              <Link
                href="/faq"
                className="mt-3 block rounded-lg bg-[#FBF7ED] py-2 text-center text-xs font-semibold text-amber-600 hover:bg-[#F7EBD3]"
              >
                Contact Support
              </Link>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-4 hidden w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 lg:flex"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out…" : "Logout"}
            </button>
          </aside>

          {/* Content — the only scrollable pane on desktop */}
          <div className="mt-4 space-y-5 lg:mt-0 lg:h-full lg:overflow-y-auto lg:pr-1 lg:pb-6">
            {isLoading || !profile ? (
              <Card>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Skeleton className="h-28 w-28 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full rounded" />
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              <>
                {(section === "overview" || section === "account") && (
                  <Card className="relative">
                    <button
                      type="button"
                      onClick={() => setProfileModalOpen(true)}
                      className={`${editBtnCls} absolute right-4 top-4 z-10`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Profile
                    </button>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex shrink-0 flex-col items-center gap-1.5 sm:w-36">
                        <div className="relative h-24 w-24">
                          {photoUrl ? (
                            // Plain <img>: src can be a CDN URL or a data:
                            // URL (the just-cropped preview) — next/image
                            // rejects data URIs.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photoUrl}
                              alt={profile.name || "Profile photo"}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#FBF7ED] text-2xl font-bold text-amber-600">
                              {initials(profile.name)}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingPhoto}
                            aria-label="Change photo"
                            className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-amber-600 text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
                          >
                            {isUploadingPhoto ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Camera className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (file) handlePhotoPicked(file);
                            }}
                          />
                        </div>
                        <p className="mt-1 text-center text-base font-semibold text-espresso">
                          {profile.name || "Unnamed"}
                        </p>
                        <span className="rounded-full bg-[#FBF1E0] px-2 py-0.5 text-[10px] font-semibold text-[#8a5a20]">
                          {profile.userRole ?? "CLIENT"}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-[#208900]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#208900]" />
                          {profile.isActive === false ? "Inactive" : "Active"}
                        </span>
                      </div>

                      <div className="grid flex-1 grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2 sm:pt-10 lg:grid-cols-3">
                        <Field icon={Mail} label="Email">
                          <span className="block truncate">{profile.email || "—"}</span>
                        </Field>
                        <Field icon={Phone} label="Phone">
                          <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                            <span className="whitespace-nowrap">
                              {profile.phone ? `${profile.countryCode} ${profile.phone}` : "—"}
                            </span>
                            {profile.isPhoneVerified && (
                              <span className="rounded-full bg-[#E7F4E4] px-1.5 py-0.5 text-[10px] font-semibold text-[#208900]">
                                Verified
                              </span>
                            )}
                          </span>
                        </Field>
                        <Field icon={CalendarDays} label="Date of Birth">
                          {fmtDate(profile.dateOfBirth)}
                        </Field>
                        <Field icon={Users} label="Gender">
                          {titleCase(profile.gender)}
                        </Field>
                        <Field icon={Ticket} label="Referral Code">
                          {profile.referralCode || "—"}
                        </Field>
                        <Field icon={UserPlus} label="Referred By">
                          {profile.referredBy || "—"}
                        </Field>
                        <Field icon={CircleDashed} label="Profile Complete">
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                              profile.isProfileComplete
                                ? "bg-[#E7F4E4] text-[#208900]"
                                : "bg-red-50 text-red-500"
                            }`}
                          >
                            {profile.isProfileComplete ? "Yes" : "No"}
                          </span>
                        </Field>
                        <Field icon={Clock} label="Last Login">
                          {fmtDateTime(profile.lastLoginAt)}
                        </Field>
                        <Field icon={CalendarClock} label="Member Since">
                          {fmtDateTime(profile.createdAt)}
                        </Field>
                        <Field icon={RefreshCw} label="Last Updated">
                          {fmtDateTime(profile.updatedAt)}
                        </Field>
                      </div>
                    </div>
                  </Card>
                )}

                {section === "overview" && (
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <AddressBook
                        addresses={addresses}
                        isSaving={isAddressSaving}
                        limit={3}
                        onCreate={handleCreateAddress}
                        onUpdate={handleUpdateAddress}
                        onDelete={handleDeleteAddress}
                        onSetDefault={handleSetDefault}
                        onViewAll={() => setSection("addresses")}
                      />
                    </Card>
                    <Card>
                      <PreferencesPanel
                        preferences={preferences}
                        isSaving={updatePreference.isPending}
                        onToggle={handleTogglePref}
                      />
                    </Card>
                  </div>
                )}

                {section === "overview" && (
                  <Card>
                    <DevicesTable devices={profile.devices ?? []} />
                  </Card>
                )}

                {section === "addresses" && (
                  <Card>
                    <AddressBook
                      addresses={addresses}
                      isSaving={isAddressSaving}
                      onCreate={handleCreateAddress}
                      onUpdate={handleUpdateAddress}
                      onDelete={handleDeleteAddress}
                      onSetDefault={handleSetDefault}
                    />
                  </Card>
                )}

                {section === "devices" && (
                  <Card>
                    <DevicesTable devices={profile.devices ?? []} />
                  </Card>
                )}

                {section === "preferences" && (
                  <Card>
                    <PreferencesPanel
                      preferences={preferences}
                      isSaving={updatePreference.isPending}
                      onToggle={handleTogglePref}
                    />
                  </Card>
                )}

                {section === "account" && (
                  <Card>
                    <div className="mb-4 flex items-center gap-2">
                      <Settings className="h-4.5 w-4.5 text-brown" />
                      <h2 className="text-base font-semibold text-espresso">Account Settings</h2>
                    </div>
                    <div className="divide-y divide-black/5">
                      <div className="flex items-center justify-between gap-3 py-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-espresso">
                            Push notifications on this device
                          </p>
                          <p className="text-xs text-[#999]">
                            Uses your browser&apos;s notification permission.
                          </p>
                        </div>
                        <Switch
                          checked={pushEnabled}
                          disabled={isTogglingPush}
                          onCheckedChange={(c) => void handleTogglePush(c)}
                        />
                      </div>
                      <Link
                        href="/profile/notifications"
                        className="flex items-center justify-between gap-3 py-4 text-sm text-espresso hover:text-amber-600"
                      >
                        <span className="flex items-center gap-2.5">
                          <Bell className="h-4 w-4 text-brown" />
                          Notification history
                        </span>
                        <span className="text-[#999]">→</span>
                      </Link>
                      <Link
                        href="/bookings"
                        className="flex items-center justify-between gap-3 py-4 text-sm text-espresso hover:text-amber-600"
                      >
                        <span className="flex items-center gap-2.5">
                          <CalendarClock className="h-4 w-4 text-brown" />
                          My bookings
                        </span>
                        <span className="text-[#999]">→</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-2.5 py-4 text-sm font-medium text-red-600 disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Logging out…" : "Log out"}
                      </button>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="block lg:hidden">
        <BottomNav onHomeClick={() => router.push("/")} />
      </div>

      {profileModalOpen && profile && (
        <EditProfileModal
          profile={profile}
          isSaving={updateProfile.isPending}
          onClose={() => setProfileModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
      {cropFile && (
        <ImageCropModal
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onCropped={handleCropConfirm}
        />
      )}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onComplete={handleLoginSuccess} />
      )}
    </div>
  );
}
