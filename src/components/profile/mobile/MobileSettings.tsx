"use client";

import {
  Bell,
  ChevronRight,
  FileText,
  Info,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  Sun,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Switch } from "@/src/components/ui/switch";
import type { MePreferences } from "@/src/types/auth";
import { MenuCard, MenuRow, MobileScreenHeader } from "./shared";

/** Phone-only Settings screen. The four notification toggles and the
 *  device push switch are real, wired to the same mutations as the
 *  desktop Preferences/Account panels. Theme and Location Access have no
 *  backing feature (the app is light-only, and there's no in-app location
 *  permission flow) so they're shown as read-only info with a note on tap.
 *  Privacy Policy / Terms / About open a "coming soon" placeholder — none
 *  of those documents exist yet. Delete Account isn't a real destructive
 *  action here (no account-deletion API) — it points the user to support
 *  instead of pretending to delete anything. */
export default function MobileSettings({
  preferences,
  isSavingPreferences,
  onTogglePreference,
  pushEnabled,
  isTogglingPush,
  onTogglePush,
  onOpenComingSoon,
  onBack,
}: {
  preferences: MePreferences;
  isSavingPreferences: boolean;
  onTogglePreference: (key: keyof MePreferences, value: boolean) => void;
  pushEnabled: boolean;
  isTogglingPush: boolean;
  onTogglePush: (checked: boolean) => void;
  onOpenComingSoon: (title: string) => void;
  onBack: () => void;
}) {
  const infoRow = (message: string) => () => toast.info(message);

  return (
    <div>
      <MobileScreenHeader title="Settings" onBack={onBack} />

      <div className="space-y-3">
        <MenuCard>
          <MenuRow
            as="div"
            icon={Bell}
            label="Push notifications on this device"
            trailing={
              <Switch checked={pushEnabled} disabled={isTogglingPush} onCheckedChange={onTogglePush} />
            }
          />
          <MenuRow
            as="div"
            icon={Bell}
            label="Push Notifications"
            trailing={
              <Switch
                checked={preferences.pushOptIn}
                disabled={isSavingPreferences}
                onCheckedChange={(v) => onTogglePreference("pushOptIn", v)}
              />
            }
          />
          <MenuRow
            as="div"
            icon={MessageCircle}
            label="WhatsApp Notifications"
            trailing={
              <Switch
                checked={preferences.whatsappOptIn}
                disabled={isSavingPreferences}
                onCheckedChange={(v) => onTogglePreference("whatsappOptIn", v)}
              />
            }
          />
          <MenuRow
            as="div"
            icon={Mail}
            label="Email Notifications"
            trailing={
              <Switch
                checked={preferences.emailOptIn}
                disabled={isSavingPreferences}
                onCheckedChange={(v) => onTogglePreference("emailOptIn", v)}
              />
            }
          />
          <MenuRow
            as="div"
            icon={Megaphone}
            label="Promotional Updates"
            trailing={
              <Switch
                checked={preferences.promotionalOptIn}
                disabled={isSavingPreferences}
                onCheckedChange={(v) => onTogglePreference("promotionalOptIn", v)}
              />
            }
          />
        </MenuCard>

        <MenuCard>
          <MenuRow
            icon={Sun}
            label="Theme"
            onClick={infoRow("Dark mode is coming soon.")}
            trailing={
              <span className="flex items-center gap-1 text-xs text-[#666]">
                Light <ChevronRight className="h-4.5 w-4.5" />
              </span>
            }
          />
          <MenuRow
            icon={MapPin}
            label="Location Access"
            onClick={infoRow("Manage location access from your browser or device settings.")}
            trailing={
              <span className="flex items-center gap-1 text-xs text-[#666]">
                While using <ChevronRight className="h-4.5 w-4.5" />
              </span>
            }
          />
        </MenuCard>

        <MenuCard>
          <MenuRow
            icon={ShieldCheck}
            label="Privacy Policy"
            onClick={() => onOpenComingSoon("Privacy Policy")}
          />
          <MenuRow
            icon={FileText}
            label="Terms & Conditions"
            onClick={() => onOpenComingSoon("Terms & Conditions")}
          />
          <MenuRow icon={Info} label="About Eezit" onClick={() => onOpenComingSoon("About Eezit")} />
        </MenuCard>

        <MenuCard>
          <MenuRow
            icon={Trash2}
            label="Delete Account"
            danger
            trailing={<span />}
            onClick={infoRow("Please contact support to delete your account.")}
          />
        </MenuCard>
      </div>
    </div>
  );
}
