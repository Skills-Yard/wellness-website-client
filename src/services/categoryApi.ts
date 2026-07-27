import { apiClient } from "@/src/lib/api/apiClient";
import { ApiResponse } from "@/src/types/serviceTypes";
import {
  CatalogCategory,
  CategoryDetails,
  SubCategory,
} from "@/src/types/categoryTypes";

const CATEGORIES_PATH = "/catalog/categories";

/** Fetches categories for client navigation. This API is not zone-dependent. */
export const getCategories = (): Promise<ApiResponse<CatalogCategory[]>> =>
  apiClient.get<ApiResponse<CatalogCategory[]>>(CATEGORIES_PATH);

/** Fetches one category page using the category ID supplied by the client. */
export const getCategoryById = (
  categoryId: string,
): Promise<ApiResponse<CategoryDetails>> =>
  apiClient.get<ApiResponse<CategoryDetails>>(
    `${CATEGORIES_PATH}/${encodeURIComponent(categoryId)}`,
  );

/** Fetches the sub-categories that belong to one selected category. */
export const getSubCategoriesByCategoryId = (
  categoryId: string,
): Promise<ApiResponse<SubCategory[]>> =>
  apiClient.get<ApiResponse<SubCategory[]>>(
    `/catalog/sub-categories/category/${encodeURIComponent(categoryId)}`,
  );
