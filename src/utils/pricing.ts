// Shared pricing math for a service's duration/package/add-on selection —
// used both while picking a pack (SelectPack) and when re-deriving a synced
// cart item's price from the server's cart response (CartContext.toCartItem).
// Keeping this in one place matters: the backend always reports a
// package's own price/pricePerSession as 0 (package pricing is derived, not
// stored — see GET /cart), so both call sites must compute it the same way
// rather than one of them quietly falling back to that 0.

export type PricingOption = {
  price?: string | number | null;
  discountedPrice?: string | number | null;
  sessions?: string | number | null;
  savingsPercent?: string | number | null;
};

const toNumber = (value?: string | number | null): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

/**
 * discountedPrice, when present and actually lower, is what a duration
 * really costs today — displayPrice is what pack math (getPackPricing) and
 * the UI should treat as "the duration's price"; price is what to strike
 * through next to it.
 */
export const getDurationPricing = (duration: PricingOption) => {
  const price = toNumber(duration.price);
  const raw = duration.discountedPrice;
  const discountedPrice =
    raw === null || raw === undefined || raw === "" ? null : Number(raw);
  const hasDiscount =
    discountedPrice !== null &&
    !Number.isNaN(discountedPrice) &&
    discountedPrice < price;

  return {
    price,
    displayPrice: hasDiscount ? (discountedPrice as number) : price,
    hasDiscount,
  };
};

/**
 * A pack's price is never trusted straight off the API — "original" is
 * defined relative to whichever duration is currently selected (sessions ×
 * that duration's price), with the pack's own savingsPercent applied on
 * top. That keeps a "4 Session" pack's numbers correct (and in sync with
 * the duration picker) no matter which duration is active, and sidesteps
 * the package.price/pricePerSession fields the backend always zeroes out.
 */
export const getPackPricing = (pack: PricingOption, durationPrice: number) => {
  const sessionCount = toNumber(pack.sessions) || 1;
  const originalTotal = sessionCount * durationPrice;
  const savingsPercent = toNumber(pack.savingsPercent);
  const discountedTotal =
    savingsPercent > 0
      ? originalTotal * (1 - savingsPercent / 100)
      : originalTotal;

  return {
    sessionCount,
    originalTotal,
    discountedTotal,
    perSessionPrice: discountedTotal / sessionCount,
    savingsPercent,
  };
};

/** Sum of `price` for every add-on in `addOns` whose id is in `selectedIds`. */
export const getAddOnsTotal = <
  T extends { id?: string; price?: string | number | null },
>(
  addOns: T[],
  selectedIds: string[],
) =>
  addOns
    .filter((addOn) => addOn.id && selectedIds.includes(addOn.id))
    .reduce((total, addOn) => total + toNumber(addOn.price), 0);

/**
 * The per-unit price a selection should charge/display: the selected
 * package's total (sessions × the selected duration's price, minus the
 * package's savingsPercent) plus every selected add-on's price. Rounded
 * once here — the package total can be fractional (e.g. a 10% cut off an
 * odd-numbered total).
 */
export const getUnitPrice = (
  duration: PricingOption | undefined,
  pack: PricingOption | undefined,
  addOns: { id?: string; price?: string | number | null }[],
  selectedAddOnIds: string[],
) => {
  const durationPrice = duration
    ? getDurationPricing(duration).displayPrice
    : 0;
  const packagePrice = pack
    ? getPackPricing(pack, durationPrice).discountedTotal
    : 0;
  const addOnsTotal = getAddOnsTotal(addOns, selectedAddOnIds);
  return Math.round(packagePrice + addOnsTotal);
};

/**
 * The unitPrice/addOnsTotal/totalPrice breakdown sent to the backend on
 * every cart write (add, quantity change, slot pick — see CartContext).
 * The backend itself always reports these three as 0 on GET /cart (same
 * reason package.price does — see getPackPricing above), so the client is
 * the source of truth for them and must send real numbers rather than
 * leaving the request to imply 0 by omission.
 */
export const getCartItemPricing = (
  duration: PricingOption | undefined,
  pack: PricingOption | undefined,
  addOns: { id?: string; price?: string | number | null }[],
  selectedAddOnIds: string[],
  quantity: number,
) => {
  const unitPrice = getUnitPrice(duration, pack, addOns, selectedAddOnIds);
  const addOnsTotal = Math.round(getAddOnsTotal(addOns, selectedAddOnIds));
  return {
    unitPrice,
    addOnsTotal,
    totalPrice: unitPrice * quantity,
  };
};
