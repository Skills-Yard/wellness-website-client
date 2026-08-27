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
  iconKey?: string | null;
};

/** GET /catalog/service-genders — not zone-scoped, just filtered by
 *  categoryId + isActive (see backend's ClientServiceGenderController). */
export type ServiceGender = {
  id: string;
  code: "MALE" | "FEMALE";
  name: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  /** The real per-gender illustration (e.g. CategorySelectModal's option
   *  cards) — optional since older data/categories may not have one set. */
  iconKey?: string | null;
};

/** GET /catalog/service-suites — zone-scoped (ZoneSuiteConfig). An empty
 *  list for a category+zone means that category has no suite step there;
 *  the caller falls back to listing its service items directly. */
export type ServiceSuite = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  /** The tier's own thumbnail (e.g. the suite-selection screen's row
   *  image) — optional since not every suite has one set. */
  iconKey?: string | null;
};
