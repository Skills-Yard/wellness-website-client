"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useAllServiceFaqs } from "@/src/hooks/queries/useAllServiceFaqs";
import ServiceFaq from "@/src/components/home/faq-accordion";

// Reached from the "Show more" link under the home page's 5-FAQ teaser
// (see faq-accordion/index.tsx) — opens on whichever category tab the
// visitor was reading there (`?category=`), with every FAQ for every
// category, not just the first 5.
export default function FaqPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? undefined;

  const { zoneId, zoneExists, isZoneLoading } = useCart();
  const { categoryFaqs, isLoading } = useAllServiceFaqs(zoneId);

  const isLoadingFaqs = isZoneLoading || (zoneExists && isLoading);

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full p-1.5 hover:bg-slate-100 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            All FAQs
          </h1>
        </div>
      </div>

      {isLoadingFaqs ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        </div>
      ) : !zoneExists ? (
        <EmptyState
          title="Not available in your location"
          message="We're currently not serving your area yet."
        />
      ) : categoryFaqs.length === 0 ? (
        <EmptyState
          title="No FAQs yet"
          message="Check back soon — we're still adding answers for this area."
        />
      ) : (
        <ServiceFaq categoryFaqs={categoryFaqs} initialCategoryId={categoryParam} />
      )}
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
      <HelpCircle className="mb-4 h-10 w-10 text-stone-300" strokeWidth={1.5} />
      <h2 className="mb-2 text-lg font-bold text-slate-900">{title}</h2>
      <p className="max-w-xs text-sm text-slate-500">{message}</p>
    </div>
  );
}
