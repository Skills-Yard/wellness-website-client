import { apiClient } from "@/src/lib/api/apiClient";
import { ApiResponse, CampaignType, HomeCampaign } from "@/src/types/serviceTypes";

const PROMOTIONAL_CAMPAIGNS_PATH = "/catalog/promotional-campaigns";

export type GetPromotionalCampaignsParams = {
  categoryId?: string;
  subCategoryId?: string;
  serviceItemId?: string;
  type?: CampaignType;
  zoneId?: string;
};

/** Fetches active promotional campaigns, optionally scoped to a category/sub-category/service item and zone. */
export const getPromotionalCampaigns = ({
  zoneId,
  ...query
}: GetPromotionalCampaignsParams): Promise<ApiResponse<HomeCampaign[]>> =>
  apiClient.get<ApiResponse<HomeCampaign[]>>(PROMOTIONAL_CAMPAIGNS_PATH, {
    params: query,
    ...(zoneId ? { headers: { "x-zone-id": zoneId } } : {}),
  });
