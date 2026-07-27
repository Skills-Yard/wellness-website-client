import { Category, DynamicService } from "@/src/utils/types/spabooking";
import { DynamicStep } from "@/src/utils/data/detailPage";

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  title?: string;
  subtitle?: string;
};

export type CategoryDetails = {
  id: string;
  name: string;
  slug: string;
  title?: string;
  subtitle?: string;
  media?: string;
  video?: string;
  rating?: string | number;
  reviews?: string | number;
  categories?: Category[];
  services?: DynamicService[];
  steps?: DynamicStep[];
};

export type SubCategory = Category & {
  slug?: string;
  categoryId?: string;
};
