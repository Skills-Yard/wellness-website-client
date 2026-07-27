import { apiClient } from "@/src/lib/api/apiClient";
import { ApiResponse } from "@/src/types/serviceTypes";
import {
  ServiceAddOn,
  ServiceDuration,
  ServicePackage,
} from "@/src/types/serviceDetailTypes";

const SERVICE_DURATIONS_PATH = "/catalog/service-durations";
const SERVICE_PACKAGES_PATH = "/catalog/service-packages";
const SERVICE_ADD_ONS_PATH = "/catalog/service-add-ons";

export const getServiceDurations = (): Promise<ApiResponse<ServiceDuration[]>> =>
  apiClient.get<ApiResponse<ServiceDuration[]>>(SERVICE_DURATIONS_PATH);

export const getServiceDurationById = (
  id: string,
): Promise<ApiResponse<ServiceDuration>> =>
  apiClient.get<ApiResponse<ServiceDuration>>(
    `${SERVICE_DURATIONS_PATH}/${encodeURIComponent(id)}`,
  );

export const getServicePackages = (): Promise<ApiResponse<ServicePackage[]>> =>
  apiClient.get<ApiResponse<ServicePackage[]>>(SERVICE_PACKAGES_PATH);

export const getServicePackageById = (
  id: string,
): Promise<ApiResponse<ServicePackage>> =>
  apiClient.get<ApiResponse<ServicePackage>>(
    `${SERVICE_PACKAGES_PATH}/${encodeURIComponent(id)}`,
  );

export const getServiceAddOns = (): Promise<ApiResponse<ServiceAddOn[]>> =>
  apiClient.get<ApiResponse<ServiceAddOn[]>>(SERVICE_ADD_ONS_PATH);

export const getServiceAddOnById = (
  id: string,
): Promise<ApiResponse<ServiceAddOn>> =>
  apiClient.get<ApiResponse<ServiceAddOn>>(
    `${SERVICE_ADD_ONS_PATH}/${encodeURIComponent(id)}`,
  );
