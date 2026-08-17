import { apiClient } from "@/src/lib/api/apiClient";
import { ApiResponse } from "@/src/types/serviceTypes";
import { ServiceGender } from "@/src/types/categoryTypes";

/**
 * Fetches the active genders offered under one category — the first step
 * of the category-select flow (Homepage category -> gender -> suite).
 * Not zone-dependent, same as getCategories (see backend's
 * ClientServiceGenderController).
 */
export const getServiceGendersByCategoryId = (
  categoryId: string,
): Promise<ApiResponse<ServiceGender[]>> =>
  apiClient.get<ApiResponse<ServiceGender[]>>("/catalog/service-genders", {
    params: { categoryId },
  });
