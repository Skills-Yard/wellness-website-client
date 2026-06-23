"use client";

import Dropdown from "./Dropdown";

const durationOptions = [
  { id: 1, title: "60 mins", price: "₹1,319" },
  { id: 2, title: "90 mins", price: "₹1,629" },
  { id: 3, title: "120 mins", price: "₹1,899" },
];

const packOptions = [
  {
    id: 1,
    title: "1 session",
    subtitle: "₹1,319/session",
    price: "₹1,319",
  },
  {
    id: 2,
    title: "2 sessions",
    subtitle: "(Mon-Sat only) in 6 months",
    price: "₹1,978",
    badge: "25% off",
  },
  {
    id: 3,
    title: "3 sessions",
    subtitle: "(2 sessions in 6 days)",
    price: "₹2,374",
    badge: "10% off",
  },
];

export default function RequirementSelector() {
  return (
    <section className="mx-auto max-w-6xl px-0 pb-0 sm:px-6 lg:px-0">
      <div className=" border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
              Select requirement
            </h2>
          </div>
        </div>

        <div className="grid gap-1 grid-cols-1">
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
