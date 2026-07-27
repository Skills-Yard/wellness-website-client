"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getCategories, getCategoryById } from "@/src/services/categoryApi";
import { CatalogCategory, CategoryDetails } from "@/src/types/categoryTypes";

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

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const detailsCache = useRef<Record<string, CategoryDetails>>({});

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getCategories();
        if (isMounted) setCategories(response.data ?? []);
      } catch (caughtError) {
        if (isMounted) {
          setCategories([]);
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error("Unable to load categories."),
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const findCategoryBySlug = useCallback(
    (slug: string) => {
      const normalizedSlug = normalizeSlug(slug);
      return categories.find(
        (category) => normalizeSlug(category.slug) === normalizedSlug,
      );
    },
    [categories],
  );

  const loadCategory = useCallback(
    async (categoryId: string) => {
      const cachedDetails = detailsCache.current[categoryId];
      if (cachedDetails) return cachedDetails;

      const response = await getCategoryById(categoryId);
      detailsCache.current[categoryId] = response.data;
      return response.data;
    },
    [],
  );

  const value = useMemo(
    () => ({ categories, isLoading, error, findCategoryBySlug, loadCategory }),
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
