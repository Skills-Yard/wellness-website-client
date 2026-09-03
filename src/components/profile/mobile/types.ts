/** Which phone-only screen is showing, below the `md` breakpoint. "hub" is
 *  the root menu (Profile.tsx's own equivalent of `section === "overview"`
 *  on desktop) — every other value is a screen reached by tapping a hub
 *  row. */
export type MobilePage =
  | "hub"
  | "personal"
  | "addresses"
  | "payments"
  | "reviews"
  | "offers"
  | "refer"
  | "help"
  | "settings";
