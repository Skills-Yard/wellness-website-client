import { ServiceAddOn } from "@/src/types/serviceDetailTypes";

interface AddonIconsProps {
  addOns?: ServiceAddOn[];
  max?: number;
  size?: number;
  className?: string;
}

// Mirrors resolveImageSrc in bookingStatus.ts — GET /catalog/service-add-ons
// returns imageKey as a full URL for most rows, but some (e.g. "Extra
// towel") still carry a raw, unresolved storage key like "addons/towel.jpg"
// with no host to load it from. Only render icons this can actually load.
export const isResolvedUrl = (value?: string | null): value is string =>
  !!value &&
  (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/"));

/** Small overlapping icon cluster for the add-ons a service offers — shown
 *  on the outer preview cards (home swiper cards, Standard/SpotlightServiceCard)
 *  as a quick "this service has add-ons" signal, built from each add-on's own
 *  imageKey (see ServiceAddOn in serviceDetailTypes.ts). Add-ons without a
 *  usable imageKey are skipped rather than shown as a blank/broken circle;
 *  renders nothing once none are left. */
export default function AddonIcons({
  addOns,
  max = 3,
  size = 20,
  className = "",
}: AddonIconsProps) {
  const withIcons = (addOns ?? []).filter(
    (addon): addon is ServiceAddOn & { imageKey: string } => isResolvedUrl(addon.imageKey),
  );
  if (withIcons.length === 0) return null;

  const shown = withIcons.slice(0, max);
  const extra = withIcons.length - shown.length;

  return (
    <div className={`flex items-center -space-x-1.5 ${className}`}>
      {shown.map((addon) => (
        <img
          key={addon.id}
          src={addon.imageKey}
          alt={addon.name ?? addon.title ?? "Add-on"}
          title={addon.name ?? addon.title ?? "Add-on"}
          width={size}
          height={size}
          className="shrink-0 rounded-full border border-white bg-stone-100 object-cover"
          style={{ width: size, height: size }}
        />
      ))}
      {extra > 0 && (
        <span
          className="flex shrink-0 items-center justify-center rounded-full border border-white bg-stone-200 text-[9px] font-semibold text-stone-600"
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
