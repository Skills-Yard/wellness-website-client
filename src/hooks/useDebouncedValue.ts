import { useEffect, useState } from "react";

/** Returns `value`, but only after it has stopped changing for `delayMs` —
 *  standard trailing-edge debounce. Used to avoid re-running the fuzzy
 *  service search (see useServiceSearch) on every keystroke. */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
