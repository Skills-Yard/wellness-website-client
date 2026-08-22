/**
 * Home renders the desktop and mobile trees at the same time (toggled
 * purely by responsive Tailwind classes, e.g. `hidden md:block` /
 * `block md:hidden` — see app/page.tsx), not by conditionally mounting one
 * or the other. That means a section id like "wellness" exists twice in
 * the DOM at once (once from each tree's own CategoryServices row).
 * `document.getElementById` always returns whichever copy comes first in
 * DOM order — the desktop one — even on mobile, where that copy is
 * display:none and the mobile copy is the one actually on screen.
 *
 * This instead returns the first element with the id that actually has a
 * size (i.e. is the one currently rendered for this viewport), falling
 * back to a plain `getElementById` if neither copy is measurable yet.
 */
export function getVisibleElementById(id: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const elements = document.querySelectorAll(`#${id}`);
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i] as HTMLElement;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 || rect.height > 0) return el;
  }
  return document.getElementById(id);
}
