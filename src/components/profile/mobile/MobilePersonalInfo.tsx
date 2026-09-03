"use client";

import { useState } from "react";
import type { UserProfile } from "@/src/types/auth";
import { MobileScreenHeader } from "./shared";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 90 }, (_, i) => CURRENT_YEAR - 5 - i);

const inputCls =
  "h-12 w-full rounded-lg border border-black/10 bg-white px-3 text-xs text-espresso outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25";
const labelCls = "mb-1.5 block text-xs font-medium text-espresso";

/** Full-screen "Personal Information" form — the phone version of what the
 *  Edit Profile modal does on desktop/tablet. Phone number stays read-only:
 *  there's no API to change a verified number without re-doing OTP
 *  verification, so it's shown for reference only, same as in the modal. */
export default function MobilePersonalInfo({
  profile,
  isSaving,
  onBack,
  onSave,
}: {
  profile: UserProfile;
  isSaving: boolean;
  onBack: () => void;
  onSave: (v: { name: string; email: string; dateOfBirth: string; gender: string }) => void;
}) {
  const seedDob = profile.dateOfBirth ? new Date(profile.dateOfBirth) : null;
  const [name, setName] = useState(profile.name ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [gender, setGender] = useState(profile.gender ?? "");
  const [day, setDay] = useState(seedDob ? String(seedDob.getDate()) : "");
  const [month, setMonth] = useState(seedDob ? String(seedDob.getMonth() + 1) : "");
  const [year, setYear] = useState(seedDob ? String(seedDob.getFullYear()) : "");

  const dateOfBirth = day && month && year
    ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    : "";

  const daysInMonth = month && year ? new Date(Number(year), Number(month), 0).getDate() : 31;

  return (
    <div>
      <MobileScreenHeader title="Personal Information" onBack={onBack} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSaving) onSave({ name: name.trim(), email: email.trim(), dateOfBirth, gender });
        }}
        className="space-y-5"
      >
        <label className="block">
          <span className={labelCls}>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className={inputCls}
          />
        </label>

        <div>
          <span className={labelCls}>Phone Number</span>
          <div className="flex h-12 items-center overflow-hidden rounded-lg border border-black/10">
            <span className="flex h-full shrink-0 items-center bg-[#FBF7ED] px-3 text-xs font-medium text-espresso">
              {profile.countryCode || "+91"}
            </span>
            <span className="flex-1 px-3 text-xs text-[#666]">
              {profile.phone || "Not added"}
              {profile.isPhoneVerified && (
                <span className="ml-2 text-[11px] font-semibold text-[#208900]">Verified</span>
              )}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#999]">
            Contact support to change your verified mobile number.
          </p>
        </div>

        <div>
          <span className={labelCls}>Date of Birth</span>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={`${inputCls} px-2 text-center`}
            >
              <option value="">Date</option>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={`${inputCls} px-2 text-center`}
            >
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={`${inputCls} px-2 text-center`}
            >
              <option value="">Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="block">
          <span className={labelCls}>Gender</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputCls}>
            <option value="">Enter gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-lg bg-espresso py-3.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
