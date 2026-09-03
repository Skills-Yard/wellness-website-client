"use client";

import {
  CreditCard,
  Gift,
  Headset,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Settings as SettingsIcon,
  Star,
  Tag,
  User as UserIcon,
} from "lucide-react";
import type { UserProfile } from "@/src/types/auth";
import { MenuCard, MenuRow, MobileScreenHeader } from "./shared";
import type { MobilePage } from "./types";

const MENU: { id: MobilePage; label: string; icon: typeof UserIcon }[] = [
  { id: "personal", label: "Personal Information", icon: UserIcon },
  { id: "addresses", label: "My Addresses", icon: MapPin },
  { id: "payments", label: "Payment Methods", icon: CreditCard },
  { id: "reviews", label: "My Reviews", icon: Star },
  { id: "offers", label: "Offers & Coupons", icon: Tag },
  { id: "refer", label: "Refer & Earn", icon: Gift },
  { id: "help", label: "Help & Support", icon: Headset },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

/** Phone-only Profile hub — the menu screen a tap on any of these rows
 *  drills into. Matches the Figma "Profile" frame: a warm gradient identity
 *  card up top, then the flat menu list, then Log Out on its own. */
export default function MobileHub({
  profile,
  photoUrl,
  initials,
  isUploadingPhoto,
  onChangePhoto,
  onNavigate,
  onLogout,
  isLoggingOut,
  onBack,
}: {
  profile: UserProfile;
  photoUrl: string | null;
  initials: string;
  isUploadingPhoto: boolean;
  onChangePhoto: () => void;
  onNavigate: (id: MobilePage) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  onBack: () => void;
}) {
  return (
    <div className="space-y-3">
      <MobileScreenHeader title="Profile" onBack={onBack} />

      {/* Identity card */}
      <div
        className="flex items-center gap-6 rounded-lg border border-black/8 p-3.5"
        style={{
          background:
            "radial-gradient(159% 352% at 62% -12%, #FDE8CF 0%, rgba(254,229,189,0.47) 0%, rgba(255,226,173,0) 51%, rgba(255,227,176,0.07) 75%, #FDE8CF 100%)",
        }}
      >
        <div className="relative h-22 w-22 shrink-0">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={profile.name || "Profile photo"}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white/70 text-xl font-bold text-amber-600">
              {initials}
            </div>
          )}
          <button
            type="button"
            onClick={onChangePhoto}
            disabled={isUploadingPhoto}
            aria-label="Change photo"
            className="absolute -right-0.5 -bottom-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm"
          >
            {isUploadingPhoto ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-base font-medium text-espresso">{profile.name || "Unnamed"}</p>
          <p className="flex items-center gap-1.5 truncate text-xs font-medium text-[#666]">
            <Mail className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span className="truncate">{profile.email || "—"}</span>
          </p>
          <p className="flex items-center gap-1.5 text-xs font-medium text-[#666]">
            <Phone className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            {profile.phone ? `${profile.countryCode} ${profile.phone}` : "—"}
          </p>
        </div>
      </div>

      {/* Menu */}
      <MenuCard>
        {MENU.map(({ id, label, icon }) => (
          <MenuRow key={id} icon={icon} label={label} onClick={() => onNavigate(id)} />
        ))}
      </MenuCard>

      {/* Log out */}
      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="flex w-full items-center gap-2 rounded-lg border border-black/4 px-3 py-4 text-xs font-medium text-red-500 disabled:opacity-50"
      >
        <LogOut className="h-5 w-5" />
        {isLoggingOut ? "Logging out…" : "Log Out"}
      </button>
    </div>
  );
}
