"use client";

import { useState } from "react";
import { Clock, Package } from "lucide-react";
import Dropdown from "./Dropdown";

interface RequirementSelectorProps {
  service: any;
  onDurationChange?: (duration: string, price: number) => void;
  onPackageChange?: (sessions: number, totalPrice: number) => void;
}

export default function RequirementSelector({
  service,
  onDurationChange,
  onPackageChange,
}: RequirementSelectorProps) {
  const [selectedDuration, setSelectedDuration] = useState("1");
  const [selectedPackage, setSelectedPackage] = useState("1");

  if (!service) return null;

  const primaryDuration = service.duration || "60 mins";
  const basePriceVal = parseInt(service.price.replace(/[^\d]/g, "")) || 999;

  // Generate duration options
  const durationOptions = [
    { id: 1, title: primaryDuration, price: `₹${basePriceVal.toLocaleString("en-IN")}` }
  ];

  if (primaryDuration.includes("60")) {
    durationOptions.push({
      id: 2,
      title: "90 mins",
      price: `₹${Math.round(basePriceVal * 1.35).toLocaleString("en-IN")}`,
    });
  } else if (primaryDuration.includes("75")) {
    durationOptions.push({
      id: 2,
      title: "105 mins",
      price: `₹${Math.round(basePriceVal * 1.3).toLocaleString("en-IN")}`,
    });
  } else if (primaryDuration.includes("90")) {
    durationOptions.push({
      id: 2,
      title: "120 mins",
      price: `₹${Math.round(basePriceVal * 1.25).toLocaleString("en-IN")}`,
    });
  } else {
    durationOptions.push({
      id: 2,
      title: "90 mins",
      price: `₹${Math.round(basePriceVal * 1.35).toLocaleString("en-IN")}`,
    });
  }

  // Generate package options
  const packOptions = [
    {
      id: 1,
      title: "1 session",
      subtitle: `₹${basePriceVal.toLocaleString("en-IN")}/session`,
      price: `₹${basePriceVal.toLocaleString("en-IN")}`,
    },
    {
      id: 2,
      title: "2 sessions",
      subtitle: `₹${Math.round(basePriceVal * 0.85).toLocaleString("en-IN")}/session`,
      price: `₹${Math.round(basePriceVal * 2 * 0.85).toLocaleString("en-IN")}`,
      badge: "Save 15%",
    },
    {
      id: 3,
      title: "3 sessions",
      subtitle: `₹${Math.round(basePriceVal * 0.8).toLocaleString("en-IN")}/session`,
      price: `₹${Math.round(basePriceVal * 3 * 0.8).toLocaleString("en-IN")}`,
      badge: "Save 20%",
    },
    {
      id: 4,
      title: "4 sessions",
      subtitle: `₹${Math.round(basePriceVal * 0.75).toLocaleString("en-IN")}/session`,
      price: `₹${Math.round(basePriceVal * 4 * 0.75).toLocaleString("en-IN")}`,
      badge: "Save 25%",
    },
  ];

  return (
    <section className="mx-auto w-full border-b border-slate-100 bg-white px-6 py-8 sm:py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Customize your experience
          </h2>
          <p className="text-sm text-slate-500">
            Select your preferred duration and package to get started
          </p>
        </div>

        {/* Duration Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <label className="text-sm font-semibold text-slate-900">
              Select duration
            </label>
          </div>
          <Dropdown
            label="Duration"
            items={durationOptions}
            onSelect={(item) => {
              setSelectedDuration(String(item.id));
              const price = parseInt(
                (item.price as string).replace(/[^\d]/g, "")
              );
              onDurationChange?.(item.title as string, price);
            }}
          />
        </div>

        {/* Package Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <label className="text-sm font-semibold text-slate-900">
              Select package
            </label>
          </div>
          <Dropdown
            label="Package"
            items={packOptions}
            onSelect={(item) => {
              setSelectedPackage(String(item.id));
              const totalPrice = parseInt(
                (item.price as string).replace(/[^\d]/g, "")
              );
              const sessions = parseInt(String(item.id));
              onPackageChange?.(sessions, totalPrice);
            }}
          />
        </div>

        {/* Summary Card */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100 space-y-2">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Your Selection
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Duration</p>
              <p className="text-sm font-bold text-slate-900">
                {durationOptions.find((d) => d.id === parseInt(selectedDuration))
                  ?.title || "60 mins"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Package</p>
              <p className="text-sm font-bold text-slate-900">
                {packOptions.find((p) => p.id === parseInt(selectedPackage))
                  ?.title || "1 session"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}