"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import { useServiceGenders } from "@/src/hooks/queries/useServiceGenders";
import { useServiceSuites } from "@/src/hooks/queries/useServiceSuites";
import { HomeCategory } from "@/src/types/serviceTypes";
import { ServiceGender, ServiceSuite } from "@/src/types/categoryTypes";

type CategorySelectModalProps = {
  category: HomeCategory;
  zoneId: string;
  onClose: () => void;
};

// Fallback only — the backend's own gender.iconKey (a real illustration,
// see the gender option cards below) is what actually renders whenever
// it's set. This just covers a gender record with no icon configured yet,
// so a card never shows fully blank.
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
 *
 * The gender step (small bottom sheet) and the suite step (full-screen
 * banner + list) are deliberately different visual languages, matching
 * their separate Figma specs — not a stylistic inconsistency.
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
  // Whatever the backend returns, as-is — GET /catalog/service-genders is
  // already filtered by categoryId + isActive server-side (see
  // ServiceGender's own doc comment), which is the correct place to
  // control which genders are offered, not a client-side override here.
  const genders = gendersData ?? [];
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
  // brief ready-to-navigate window while the close animation plays out —
  // always rendered in the gender sheet's shell, same as the error state,
  // since by the time showSuiteStep is true suites are already loaded.
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

  // Whether there's an earlier step for the suite screen's back arrow to
  // return to — if this category has no gender step at all, "back" from
  // the suite screen has nowhere to go but out.
  const canGoBackToGender = genderStepRequired;

  // Portaled straight to <body> rather than rendered inline where
  // CategoryGrid mounts it — CategoryGrid's own wrapper is `relative z-20`
  // (see Categorygrid.tsx), which is a stacking-context-forming ancestor.
  // A `fixed`/`z-70` descendant of that only ever competes for stacking
  // order *within* that z-20 context, not against the rest of the page —
  // so at the document root this whole modal only ever ranked as high as
  // "z-20", losing to BottomNav's root-level z-50 and rendering behind it.
  // Portaling to body escapes that ancestor entirely, so z-70 finally
  // competes where it's actually declared to.
  return createPortal(
    showSuiteStep ? (
      <div
        className="fixed inset-0 z-70 overflow-y-auto bg-white"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative h-[298px] w-full shrink-0">
          {category.homeBannerKey && (
            <Image
              src={category.homeBannerKey}
              alt=""
              fill
              priority
              sizes="390px"
              className="object-cover"
            />
          )}
          {/* Scrim for the white headline text below, independent of
              whatever the banner photo itself looks like. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <button
            type="button"
            onClick={() => (canGoBackToGender ? setGenderId(null) : close())}
            className="absolute left-4 top-13 flex h-8.25 w-8.25 items-center justify-center rounded-[5px] border border-[#EDEDED] bg-white text-black hover:bg-stone-50"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-4.5 bottom-6 text-white">
            {/* sectionHeading/sectionSubheading are the banner-copy fields
                (distinct from title/subtitle, used elsewhere) — not every
                category has them set yet, so this falls back to the plain
                name rather than rendering nothing. */}
            <h1 className="text-2xl font-semibold leading-[112.5%]">
              {category.sectionHeading ?? category.title ?? category.name}
            </h1>
            {(category.sectionSubheading ?? category.subtitle) && (
              <p className="mt-1 text-sm font-semibold">
                {category.sectionSubheading ?? category.subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="divide-y divide-[#F3EFEB] px-4 pt-10">
          {suites.map((suite) => (
            <SuiteTierRow key={suite.id} suite={suite} onSelect={() => setSuiteId(suite.id)} />
          ))}
        </div>
      </div>
    ) : (
      <div
        className={`fixed inset-0 z-70 flex items-end justify-center bg-black/80 backdrop-blur-xs transition-opacity duration-300 sm:items-center sm:p-4 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => close()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button floats above the sheet, on the backdrop, rather
            than sitting inside a bordered header row — matching the Figma
            spec's own close-button placement (offset above the sheet's
            top edge). Grouped with the sheet in one column so both
            slide/fade in together. */}
        <div
          className={`flex w-full max-w-lg flex-col items-end gap-3 transition-transform duration-300 ${
            mounted ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => close()}
            className="flex h-8.25 w-8.25 shrink-0 items-center justify-center rounded-[5px] border border-[#EDEDED] bg-white text-stone-900 hover:bg-stone-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl sm:max-h-[80vh] sm:rounded-3xl">
            <div className="flex items-center gap-2 px-5 pb-1 pt-6">
              <h2 className="flex-1 text-xl font-semibold text-black">
                {`Choose Your ${category.name}`}
              </h2>
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
              ) : (
                // Figma spec has these as a tight left-aligned row (fixed
                // card size, gap between them), not a stretched 2-column
                // grid — flex reads closer to that than grid would once
                // there's only ever 2-3 options.
                <div className="flex flex-row flex-wrap gap-5.5">
                  {genders.map((gender) => (
                    <button
                      key={gender.id}
                      type="button"
                      onClick={() => setGenderId(gender.id)}
                      className="group flex flex-col items-center gap-3"
                    >
                      <span className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[25px] bg-[#FEF3F1] transition-transform group-hover:scale-105">
                        {gender.iconKey ? (
                          <Image
                            src={gender.iconKey}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-contain p-3"
                          />
                        ) : (
                          <span className="text-5xl">{GENDER_EMOJI[gender.code] ?? "🧑"}</span>
                        )}
                      </span>
                      <span className="text-sm font-medium text-black">
                        {gender.title ?? gender.name}
                      </span>
                      {gender.subtitle && (
                        <span className="text-center text-xs text-stone-500">{gender.subtitle}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    document.body,
  );
}

function SuiteTierRow({
  suite,
  onSelect,
}: {
  suite: ServiceSuite;
  onSelect: () => void;
}) {
  const label = suite.title ?? suite.name;

  return (
    <button type="button" onClick={onSelect} className="flex w-full items-start gap-4 py-5 text-left">
      <div className="relative h-24 w-[167px] shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {suite.iconKey && (
          <Image src={suite.iconKey} alt="" fill sizes="167px" className="object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 pt-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-medium text-black">{label}</span>
          <ChevronRight className="h-5 w-5 shrink-0 text-[#25180F]" />
        </div>
        {/* No fabricated "Arriving in N mins" badge here — the Figma spec
            has one, but there's no backend field behind it (checked the
            real ServiceSuite payload directly; nothing suite- or
            category-level backs a per-tier ETA today). Only rendering
            what's real: the tier's own subtitle, when the backend has set
            one — several suites don't yet, so this line just doesn't
            render for those rather than showing empty/placeholder text. */}
        {suite.subtitle && (
          <p className="text-sm font-medium leading-[116%] text-[#666666]">{suite.subtitle}</p>
        )}
      </div>
    </button>
  );
}
