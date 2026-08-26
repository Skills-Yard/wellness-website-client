import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useHomeDetails } from "./useHomeDetails";
import { getSubCategoriesByCategoryId } from "@/src/services/categoryApi";
import { getServiceItems } from "@/src/services/serviceItemApi";
import { HomeCategory } from "@/src/types/serviceTypes";
import { HomeFaq } from "@/src/types/serviceItemTypes";
import { queryKeys } from "./queryKeys";
import type { CategoryFaqGroup } from "@/src/components/home/faq-accordion";

/**
 * Every category's FAQs, aggregated the same way CategoryServices builds
 * one category's own `categoryFaqs` (dedupe by question+answer across each
 * service item's `faqs`) — but for every category at once, for the
 * dedicated /faq page (see its "Show more" link on the home page).
 *
 * Reuses the exact same subCategories/serviceItems query keys as the home
 * page's CategoryServices rows (queryKeys.subCategories / .serviceItems),
 * so a visitor who already scrolled the home page — the normal way to
 * reach the FAQ section's "Show more" link — hits a warm cache here
 * instead of refetching every category's services again.
 */
export function useAllServiceFaqs(zoneId: string | null | undefined) {
  const enabled = !!zoneId;

  const { data: homeDetails, isLoading: isHomeLoading } = useHomeDetails(zoneId, {
    enabled,
  });

  const categories = useMemo<HomeCategory[]>(
    () => homeDetails?.categories ?? [],
    [homeDetails],
  );

  const subCategoryQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: queryKeys.subCategories(category.id, zoneId ?? ""),
      queryFn: () =>
        getSubCategoriesByCategoryId(category.id, zoneId as string).then(
          (r) => r.data ?? [],
        ),
      enabled: enabled && categories.length > 0,
    })),
    combine: (results) => {
      const isLoading = results.some((result) => result.isLoading);
      const subCategoryIds: string[] = [];
      // subCategoryId -> owning category, so the FAQs collected below can
      // be grouped back under the right category tab.
      const categoryBySubCategoryId = new Map<string, HomeCategory>();
      results.forEach((result, index) => {
        const category = categories[index];
        (result.data ?? []).forEach((subCategory) => {
          categoryBySubCategoryId.set(subCategory.id, category);
          subCategoryIds.push(subCategory.id);
        });
      });
      return { subCategoryIds, categoryBySubCategoryId, isLoading };
    },
  });

  const serviceItemQueries = useQueries({
    queries: subCategoryQueries.subCategoryIds.map((subCategoryId) => ({
      queryKey: queryKeys.serviceItems(subCategoryId, zoneId ?? "", "", ""),
      queryFn: () =>
        getServiceItems({
          isActive: true,
          subCategoryId,
          zoneId: zoneId as string,
        }).then((r) => r.data ?? []),
      enabled,
    })),
    combine: (results) => ({
      isLoading: results.some((result) => result.isLoading),
      services: results.flatMap((result) => result.data ?? []),
    }),
  });

  const categoryFaqs = useMemo<CategoryFaqGroup[]>(() => {
    const faqsByCategoryId = new Map<string, Map<string, HomeFaq>>();

    serviceItemQueries.services.forEach((service) => {
      const category = subCategoryQueries.categoryBySubCategoryId.get(
        service.subCategoryId,
      );
      if (!category) return;

      service.faqs?.forEach((faq) => {
        const question = faq.q ?? faq.question;
        const answer = faq.a ?? faq.answer;
        if (!question || !answer) return;
        const faqs = faqsByCategoryId.get(category.id) ?? new Map<string, HomeFaq>();
        faqs.set(`${question}-${answer}`, { id: faq.id, question, answer });
        faqsByCategoryId.set(category.id, faqs);
      });
    });

    // Ordered by the same category order the home page uses, and only
    // categories that actually have at least one FAQ — same as
    // CategoryServices' onFaqsChange (skips categories with none).
    return categories.flatMap((category) => {
      const faqs = faqsByCategoryId.get(category.id);
      return faqs && faqs.size > 0 ? [{ category, faqs: [...faqs.values()] }] : [];
    });
  }, [categories, serviceItemQueries.services, subCategoryQueries.categoryBySubCategoryId]);

  return {
    categoryFaqs,
    isLoading: enabled && (isHomeLoading || subCategoryQueries.isLoading || serviceItemQueries.isLoading),
  };
}
