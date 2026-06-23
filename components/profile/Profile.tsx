"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { tempUser, UserProfile } from "@/utils/data/tempUserData";

// ==========================================
// 1. ACCOUNT COMPONENT
// ==========================================
const AccountSection = ({ user, onEdit }: { user: UserProfile; onEdit: () => void }) => {
  const isProfileComplete = user.name && user.email;

  return (
    <AccordionItem value="account" className="border-b-slate-200 py-2">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <span className="text-lg font-bold text-slate-900">Account Details</span>
          {!isProfileComplete && (
            <span className="inline-flex animate-pulse items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800">
              INCOMPLETE
            </span>
          )}
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="pt-2 text-slate-600">
        <p className="mb-6 text-sm text-slate-500">Manage your personal information</p>

        {!isProfileComplete && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              Please complete your profile to receive booking confirmations and exclusive offers.
            </p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-slate-500">Mobile Number</label>
            <div className="mt-1 flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <span className="font-medium">{user.phone}</span>
              <span className="text-xs font-semibold text-green-600">Verified ✓</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Full Name</label>
            <div className="mt-1 flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
              <span className={user.name ? "text-slate-900" : "text-slate-400 italic"}>
                {user.name || "Not provided yet"}
              </span>
              <button onClick={onEdit} className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
                {user.name ? "Edit" : "Add"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Email Address</label>
            <div className="mt-1 flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
              <span className={user.email ? "text-slate-900" : "text-slate-400 italic"}>
                {user.email || "Not provided yet"}
              </span>
              <button onClick={onEdit} className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
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
      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-indigo-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 active:scale-[0.98]"
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
        <span className="text-lg font-bold text-slate-900">Saved Addresses</span>
      </AccordionTrigger>
      
      <AccordionContent className="pt-2">
        <p className="mb-6 text-sm text-slate-500">Manage where we deliver our spa services.</p>
        
        <div className="space-y-4">
          {/* List Existing Addresses */}
          {user.addresses.map((address) => (
            <div key={address.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {address.type}
                </span>
                <div className="flex gap-3 text-sm font-medium text-indigo-600">
                  <button className="hover:text-indigo-700">Edit</button>
                  <button className="text-red-500 hover:text-red-600">Delete</button>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{address.fullAddress}</p>
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
              <p className="text-xs text-slate-500">For accurate service delivery</p>
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
  return (
    <AccordionItem value="about" className="border-none py-2">
      <AccordionTrigger className="hover:no-underline">
        <span className="text-lg font-bold text-slate-900">About Spa Prime</span>
      </AccordionTrigger>
      
      <AccordionContent className="pt-2">
        <div className="space-y-2 text-sm text-slate-700">
          <button className="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50 hover:text-indigo-600">
            <span className="font-medium">Terms & Conditions</span>
            <span className="text-slate-400">→</span>
          </button>
          <button className="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50 hover:text-indigo-600">
            <span className="font-medium">Privacy Policy</span>
            <span className="text-slate-400">→</span>
          </button>
          <button className="mt-4 flex w-full items-center justify-between rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50">
            <span className="font-medium">Log Out</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-slate-400">App Version 1.0.4</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function ProfilePage() {
  // Initialize state with the imported temp data
  const [user, setUser] = useState<UserProfile>(tempUser);

  const handleEditProfile = () => {
    alert("Open an edit modal or navigate to an edit page here!");
  };

  return (
    <div className="mx-auto max-w-2xl bg-white px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
      </div>

      {/* Accordion Layout wrapper */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 shadow-sm">
        <Accordion type="single" collapsible defaultValue="account" className="w-full">
          <AccountSection user={user} onEdit={handleEditProfile} />
          <AddressSection user={user} />
          <SettingsSection />
          <AboutSection />
        </Accordion>
      </div>
    </div>
  );
}