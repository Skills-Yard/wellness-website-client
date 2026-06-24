"use client";

import Dropdown from "./Dropdown";

interface RequirementSelectorProps {
  service: any;
}

export default function RequirementSelector({ service }: RequirementSelectorProps) {
  if (!service) return null;

  const primaryDuration = service.duration || "60 mins";
  const basePriceVal = parseInt(service.price.replace(/[^\d]/g, "")) || 999;
  
  // Calculate dynamic duration options
  const durationOptions = [
    { id: 1, title: primaryDuration, price: `₹${basePriceVal.toLocaleString('en-IN')}` }
  ];
  
  if (primaryDuration.includes("60")) {
    durationOptions.push({ id: 2, title: "90 mins", price: `₹${Math.round(basePriceVal * 1.35).toLocaleString('en-IN')}` });
  } else if (primaryDuration.includes("75")) {
    durationOptions.push({ id: 2, title: "105 mins", price: `₹${Math.round(basePriceVal * 1.3).toLocaleString('en-IN')}` });
  } else if (primaryDuration.includes("50")) {
    durationOptions.push({ id: 2, title: "80 mins", price: `₹${Math.round(basePriceVal * 1.4).toLocaleString('en-IN')}` });
  } else if (primaryDuration.includes("45")) {
    durationOptions.push({ id: 2, title: "75 mins", price: `₹${Math.round(basePriceVal * 1.45).toLocaleString('en-IN')}` });
  } else if (primaryDuration.includes("90")) {
    durationOptions.push({ id: 2, title: "120 mins", price: `₹${Math.round(basePriceVal * 1.25).toLocaleString('en-IN')}` });
  } else if (primaryDuration.includes("40")) {
    durationOptions.push({ id: 2, title: "60 mins", price: `₹${Math.round(basePriceVal * 1.35).toLocaleString('en-IN')}` });
  } else if (primaryDuration.includes("70")) {
    durationOptions.push({ id: 2, title: "100 mins", price: `₹${Math.round(basePriceVal * 1.35).toLocaleString('en-IN')}` });
  } else {
    durationOptions.push({ id: 2, title: "90 mins", price: `₹${Math.round(basePriceVal * 1.35).toLocaleString('en-IN')}` });
  }

  // Calculate dynamic package options
  const packOptions = [
    {
      id: 1,
      title: "1 session",
      subtitle: `₹${basePriceVal.toLocaleString('en-IN')}/session`,
      price: `₹${basePriceVal.toLocaleString('en-IN')}`,
    },
    {
      id: 2,
      title: "2 sessions",
      subtitle: `₹${Math.round(basePriceVal * 0.85).toLocaleString('en-IN')}/session (15% off)`,
      price: `₹${Math.round(basePriceVal * 2 * 0.85).toLocaleString('en-IN')}`,
      badge: "15% off",
    },
    {
      id: 3,
      title: "3 sessions",
      subtitle: `₹${Math.round(basePriceVal * 0.8).toLocaleString('en-IN')}/session (20% off)`,
      price: `₹${Math.round(basePriceVal * 3 * 0.8).toLocaleString('en-IN')}`,
      badge: "20% off",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-0 pb-0 sm:px-6 lg:px-0">
      <div className="border-b border-slate-100 bg-white p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Select requirement
          </h2>
        </div>

        <div className="grid gap-2 grid-cols-1">
          <Dropdown
            label="Select duration"
            items={durationOptions}
            visibleCount={2}
          />
          <Dropdown
            label="Select a pack"
            items={packOptions}
            visibleCount={2}
          />
        </div>
      </div>
    </section>
  );
}
