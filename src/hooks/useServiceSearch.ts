import { useMemo, useState } from "react";
import Fuse, { type IFuseOptions } from "fuse.js";
import { useDebouncedValue } from "./useDebouncedValue";
import { SearchableService } from "./queries/useServiceSearchIndex";

const MAX_RESULTS = 8;

// threshold 0.4 is Fuse's own "fairly permissive" recommendation — loose
// enough that "mesage"/"swedsh" still surface "Massage"/"Swedish Massage",
// tight enough it won't start matching unrelated service names.
// ignoreLocation: matches anywhere in the name, not just near the start,
// since "hot stone" should still find "Hot Stone Massage" as you type.
const FUSE_OPTIONS: IFuseOptions<SearchableService> = {
  keys: ["name"],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/** Fuzzy, closest-match search over the service catalog index (see
 *  useServiceSearchIndex), debounced so the search only re-runs once
 *  typing pauses. Ranked by Fuse's own match score, best first. */
export function useServiceSearch(items: SearchableService[]) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);

  const fuse = useMemo(() => new Fuse(items, FUSE_OPTIONS), [items]);

  const results = useMemo(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) return [];
    return fuse.search(trimmed, { limit: MAX_RESULTS }).map((result) => result.item);
  }, [fuse, debouncedQuery]);

  return { query, setQuery, results, isSearching: query.trim() !== debouncedQuery.trim() };
}
