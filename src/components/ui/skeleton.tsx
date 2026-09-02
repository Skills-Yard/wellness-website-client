import * as React from "react";

import { cn } from "@/src/lib/utils";

/**
 * Shimmer skeleton placeholder. Use in place of spinners / "Loading…"
 * text for any pending UI — size and shape it with `className` to match
 * the real content it stands in for.
 *
 *   <Skeleton className="h-4 w-32 rounded" />
 *   <Skeleton className="h-40 w-full rounded-2xl" />
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-md bg-stone-200/70",
        className,
      )}
      {...props}
    >
      <span
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent motion-reduce:animate-none motion-reduce:hidden"
      />
    </div>
  );
}

export { Skeleton };
