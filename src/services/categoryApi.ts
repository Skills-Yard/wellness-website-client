import { apiClient } from "@/src/lib/api/apiClient";
import { ApiResponse } from "@/src/types/serviceTypes";
import {
  CatalogCategory,
  CategoryDetails,
  SubCategory,
} from "@/src/types/categoryTypes";

const CATEGORIES_PATH = "/catalog/categories";

// All three endpoints below are @LocationRequired (FLEXIBLE mode) on the
// backend — zoneId is optional there (it falls back to IP/Cloudflare-edge
// resolution when omitted), but that fallback only actually resolves a real
// zone behind Cloudflare; a bare backend (e.g. local dev) has nothing to
// fall back to and 404s "Service is not available in the requested region."
// Sending x-zone-id whenever we already have one avoids depending on that
// edge-only fallback at all.
const zoneHeaders = (zoneId?: string) =>
  zoneId ? { headers: { "x-zone-id": zoneId } } : undefined;

/** Fetches categories for client navigation, filtered to what's actually
 *  offered in the given zone. */
export const getCategories = (
  zoneId?: string,
): Promise<ApiResponse<CatalogCategory[]>> =>
  apiClient.get<ApiResponse<CatalogCategory[]>>(CATEGORIES_PATH, zoneHeaders(zoneId));

/** Fetches one category page using the category ID supplied by the client. */
export const getCategoryById = (
  categoryId: string,
  zoneId?: string,
): Promise<ApiResponse<CategoryDetails>> =>
  apiClient.get<ApiResponse<CategoryDetails>>(
    `${CATEGORIES_PATH}/${encodeURIComponent(categoryId)}`,
    zoneHeaders(zoneId),
  );

/** Fetches the sub-categories that belong to one selected category, in one zone. */
export const getSubCategoriesByCategoryId = (
  categoryId: string,
  zoneId?: string,
): Promise<ApiResponse<SubCategory[]>> =>
  apiClient.get<ApiResponse<SubCategory[]>>(
    `/catalog/sub-categories/category/${encodeURIComponent(categoryId)}`,
    zoneHeaders(zoneId),
  );
