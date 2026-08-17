"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCategoryById } from "@/src/services/categoryApi";
import { CatalogCategory, CategoryDetails } from "@/src/types/categoryTypes";
import { useCategories as useCategoriesQuery } from "@/src/hooks/queries/useCategories";
import { queryKeys } from "@/src/hooks/queries/queryKeys";
import { useCart } from "./CartContext";

type CategoryContextValue = {
  categories: CatalogCategory[];
  isLoading: boolean;
  error: Error | null;
  findCategoryBySlug: (slug: string) => CatalogCategory | undefined;
  loadCategory: (categoryId: string) => Promise<CategoryDetails>;
};

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined);

const normalizeSlug = (slug: string) =>
  slug === "physiotherapy" ? "physio" : slug;

// A module-level constant, not `data ?? []` inline — the latter builds a
// brand new array every render while `data` is still undefined (loading/
// logged-out), which cascades into findCategoryBySlug/value below being
// rebuilt every render too (see useServiceItemsForSubCategories' `combine`
// comment for why an unstable derived reference like this is worth
// avoiding, not just wasteful).
const EMPTY_CATEGORIES: CatalogCategory[] = [];

export function CategoryProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // Categories are zone-filtered on the backend (see categoryApi.ts) — this
  // provider must sit inside CartProvider (see layout.tsx) to read the zone
  // it resolves.
  const { zoneId } = useCart();
  const { data, isLoading, error } = useCategoriesQuery(zoneId);
  const categories = data ?? EMPTY_CATEGORIES;

  const findCategoryBySlug = useCallback(
    (slug: string) => {
      const normalizedSlug = normalizeSlug(slug);
      return categories.find(
        (category) => normalizeSlug(category.slug) === normalizedSlug,
      );
    },
    [categories],
  );

  // Imperative (not a hook) because callers — see spa-booking/index.tsx —
  // fetch this alongside other data in a Promise.all inside their own
  // effect, rather than rendering it directly. queryClient.fetchQuery is
  // React Query's cache-backed equivalent of the old useRef details cache
  // this replaced: cached results resolve instantly, cache misses fetch
  // and populate the cache for every other caller (e.g. the home page's
  // "See all" link into the same category's detail page).
  const loadCategory = useCallback(
    (categoryId: string) =>
      queryClient.fetchQuery({
        queryKey: queryKeys.category(categoryId, zoneId ?? ""),
        queryFn: () => getCategoryById(categoryId, zoneId ?? undefined).then((r) => r.data),
      }),
    [queryClient, zoneId],
  );

  const value = useMemo(
    () => ({
      categories,
      isLoading,
      error: error as Error | null,
      findCategoryBySlug,
      loadCategory,
    }),
    [categories, isLoading, error, findCategoryBySlug, loadCategory],
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within CategoryProvider.");
  }
  return context;
}
