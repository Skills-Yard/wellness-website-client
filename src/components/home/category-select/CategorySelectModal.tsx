"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { useServiceGenders } from "@/src/hooks/queries/useServiceGenders";
import { useServiceSuites } from "@/src/hooks/queries/useServiceSuites";
import { HomeCategory } from "@/src/types/serviceTypes";
import { ServiceGender, ServiceSuite } from "@/src/types/categoryTypes";

type CategorySelectModalProps = {
  category: HomeCategory;
  zoneId: string;
  onClose: () => void;
};

const GENDER_EMOJI: Record<ServiceGender["code"], string> = {
  MALE: "👨",
  FEMALE: "👩",
};

/**
 * Homepage category click -> gender -> suite -> category detail page.
 *
 * Genders and suites are fetched together as soon as the modal opens
 * (they're independent axes — suites belong to categoryId+zone, not to a
 * gender), so a slow suite fetch never blocks the gender step from
 * showing. A step is skipped only when it has zero options (nothing to
 * choose between — same as the backend's own "zero suites -> no suite
 * step" design for ZoneSuiteConfig, see useServiceSuites); a single option
 * is still shown and must be tapped explicitly, rather than being
 * auto-selected silently.
 */
export default function CategorySelectModal({
  category,
  zoneId,
  onClose,
}: CategorySelectModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [genderId, setGenderId] = useState<string | null>(null);
  const [suiteId, setSuiteId] = useState<string | null>(null);
  const navigatedRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setMounted(true));
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const close = (after?: () => void) => {
    setMounted(false);
    window.setTimeout(() => {
      onClose();
      after?.();
    }, 300);
  };

  const {
    data: gendersData,
    isLoading: isGendersLoading,
    isError: isGendersError,
    refetch: refetchGenders,
  } = useServiceGenders(category.id);
  // TEMP: Men has no service items catalogued anywhere yet, so offering
  // "Men" here would just dead-end into an empty results screen. Hide it
  // until Men's catalog is populated, then drop this filter.
  const genders = useMemo(
    () => (gendersData ?? []).filter((gender) => gender.code !== "MALE"),
    [gendersData],
  );
  const gendersReady = !isGendersLoading && !isGendersError;

  const {
    data: suitesData,
    isLoading: isSuitesLoading,
    isError: isSuitesError,
    refetch: refetchSuites,
  } = useServiceSuites(category.id, zoneId);
  const suites = suitesData ?? [];
  const suitesReady = !isSuitesLoading && !isSuitesError;

  // A step only "requires" a choice when it has at least one option —
  // zero means nothing to filter by (skip straight through), and even a
  // single option is shown and must be tapped explicitly rather than
  // auto-selected silently.
  const genderStepRequired = genders.length > 0;
  const genderStepDone = gendersReady && (!genderStepRequired || genderId !== null);

  const suiteStepRequired = genderStepDone && suites.length > 0;
  const suiteStepDone =
    genderStepDone && suitesReady && (!suiteStepRequired || suiteId !== null);

  const isError = isGendersError || isSuitesError;
  const showGenderStep = gendersReady && !genderStepDone;
  const showSuiteStep = genderStepDone && suitesReady && !suiteStepDone;
  // Covers the initial fetch, gender-done-but-suites-still-loading, and the
  // brief ready-to-navigate window while the close animation plays out.
  const showLoading = !isError && !showGenderStep && !showSuiteStep;
  const readyToNavigate = !isError && genderStepDone && suiteStepDone;

  useEffect(() => {
    if (!readyToNavigate || navigatedRef.current) return;
    navigatedRef.current = true;

    // Both steps require an explicit tap whenever they have any options
    // (see genderStepRequired/suiteStepRequired above), so by the time
    // we're ready to navigate, genderId/suiteId are already set for every
    // category that has genders/suites at all — nothing to default here.
    const params = new URLSearchParams({ categoryId: category.id });
    if (genderId) params.set("genderId", genderId);
    if (suiteId) params.set("suiteId", suiteId);

    close(() => router.push(`/detail/${category.slug}?${params.toString()}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToNavigate]);

  const canGoBackToGender = showSuiteStep && genderStepRequired;

  return (
    <div
      className={`fixed inset-0 z-70 flex items-end justify-center bg-black/80 backdrop-blur-xs transition-opacity duration-300 sm:items-center sm:p-4 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => close()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl transition-transform duration-300 sm:max-h-[80vh] sm:rounded-3xl ${
          mounted ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-stone-100 px-5 py-4">
          {canGoBackToGender && (
            <button
              type="button"
              onClick={() => setSuiteId(null)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50"
              aria-label="Back"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              {category.title ?? category.name}
            </p>
            <h2 className="text-lg font-bold text-stone-900">
              {showSuiteStep ? "Choose a suite" : "Who is this for?"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => close()}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          {isError ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm font-medium text-stone-500">
                Something went wrong. Please try again.
              </p>
              <button
                type="button"
                onClick={() => {
                  void refetchGenders();
                  void refetchSuites();
                }}
                className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                Try again
              </button>
            </div>
          ) : showLoading ? (
            <div className="grid grid-cols-2 gap-3 py-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-2xl bg-stone-100" />
              ))}
            </div>
          ) : showGenderStep ? (
            <div className="grid grid-cols-2 gap-3">
              {genders.map((gender) => (
                <button
                  key={gender.id}
                  type="button"
                  onClick={() => setGenderId(gender.id)}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-6 transition-all hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-md"
                >
                  <span className="text-3xl">{GENDER_EMOJI[gender.code] ?? "🧑"}</span>
                  <span className="text-sm font-bold text-stone-800">
                    {gender.title ?? gender.name}
                  </span>
                  {gender.subtitle && (
                    <span className="text-center text-xs text-stone-500">{gender.subtitle}</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {suites.map((suite) => (
                <SuiteCard key={suite.id} suite={suite} onSelect={() => setSuiteId(suite.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SuiteCard({
  suite,
  onSelect,
}: {
  suite: ServiceSuite;
  onSelect: () => void;
}) {
  const label = suite.title ?? suite.name;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-6 transition-all hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-md"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-600">
        {label.charAt(0)}
      </span>
      <span className="text-sm font-bold text-stone-800">{label}</span>
      {suite.subtitle && (
        <span className="text-center text-xs text-stone-500">{suite.subtitle}</span>
      )}
    </button>
  );
}
