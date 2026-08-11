export type ServiceDetailOption = {
  id: string;
  /** Duration and package display name returned by the catalog API. */
  label?: string;
  name?: string;
  title?: string;
  duration?: string;
  durationMinutes?: number;
  sessions?: number;
  price?: string | number;
  discountedPrice?: string | number | null;
  pricePerSession?: string | number;
  originalPrice?: string | number;
  savings?: string | number;
  savingsPercent?: string | number;
  discount?: string | number;
  badgeText?: string;
  description?: string | null;
  extraMinutes?: number;
  imageKey?: string | null;
  serviceItemId?: string;
  serviceId?: string;
  isActive?: boolean;
  isDefault?: boolean;
  isPopular?: boolean;
  displayOrder?: number;
};

export type ServiceDuration = ServiceDetailOption;
export type ServicePackage = ServiceDetailOption;
export type ServiceAddOn = ServiceDetailOption;

/** Matches the admin panel's shape for the ServiceItem JSON content columns
 *  (procedureSteps, itemsUsed, whatsIncluded — see catalog.prisma). */
export type ImageCardItem = {
  id?: string;
  title: string;
  subtitle?: string;
  image: string;
};

/** Matches the admin panel's shape for ServiceItem.customReviews. */
export type ReviewItem = {
  id?: string;
  name: string;
  content: string;
  displayOrder?: number;
  image?: string;
};
