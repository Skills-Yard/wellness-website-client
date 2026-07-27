export type ServiceDetailOption = {
  id: string;
  name?: string;
  title?: string;
  duration?: string;
  price?: string | number;
  serviceItemId?: string;
  serviceId?: string;
  isActive?: boolean;
};

export type ServiceDuration = ServiceDetailOption;
export type ServicePackage = ServiceDetailOption;
export type ServiceAddOn = ServiceDetailOption;
