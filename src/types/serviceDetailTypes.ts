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
