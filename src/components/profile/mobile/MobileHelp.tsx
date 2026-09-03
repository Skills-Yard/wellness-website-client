"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Banknote,
  ChevronRight,
  Gauge,
  Home,
  type LucideIcon,
  Wallet,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { IconBadge, MobileScreenHeader } from "./shared";

const FAQS: { icon: LucideIcon; question: string; answer: string }[] = [
  {
    icon: HelpCircle,
    question: "How do I book a service?",
    answer:
      "Pick a category from the home screen, choose a service and time slot, add your address, and confirm — a professional is assigned right after payment.",
  },
  {
    icon: XCircle,
    question: "Can I reschedule or cancel my booking?",
    answer:
      "Yes — open the booking from My Bookings and use Reschedule or Cancel. Cancellations close to the appointment time may carry a fee, shown before you confirm.",
  },
  {
    icon: Gauge,
    question: "How do I track my booking?",
    answer:
      "Once a professional accepts, the booking's detail page shows live status — en route, arrived, in progress — right up to completion.",
  },
  {
    icon: Wallet,
    question: "What payment methods do you accept?",
    answer: "Cards, UPI, and net banking via Razorpay, plus cash on service for eligible bookings.",
  },
  {
    icon: Banknote,
    question: "When will I get a refund?",
    answer:
      "Refunds for cancelled or disputed bookings are issued to your original payment method and usually reflect within 5–7 business days.",
  },
  {
    icon: Home,
    question: "How do I change or add my address?",
    answer: "Go to My Addresses from your profile to add, edit, or set a default delivery address.",
  },
  {
    icon: BadgeCheck,
    question: "How are partners verified?",
    answer:
      "Every professional goes through identity verification, background checks, and a skills assessment before they can accept bookings.",
  },
];

export default function MobileHelp({ onBack }: { onBack: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <MobileScreenHeader title="Help & Support" onBack={onBack} />
      <h2 className="mb-3 text-sm font-medium text-espresso">How can we help you?</h2>

      <div className="space-y-3">
        {FAQS.map(({ icon, question, answer }, i) => {
          const open = openIndex === i;
          return (
            <div key={question} className="rounded-lg border border-black/8">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-3 p-3.5 text-left"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <IconBadge icon={icon} />
                  <span className="text-xs font-medium text-espresso">{question}</span>
                </span>
                <ChevronRight
                  className={`h-4.5 w-4.5 shrink-0 text-[#666] transition-transform ${open ? "rotate-90" : ""}`}
                />
              </button>
              {open && <p className="px-3.5 pb-4 text-xs text-[#666]">{answer}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
