export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ServiceFeature {
  icon: string;
  text: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: ServiceImage;
  images: ServiceImage[];
  rating: number;
  reviewCount: number;
  duration: string;
  currentPrice: number;
  originalPrice: number;
  currency: string;
  badge?: "best-seller" | "recommended" | "new" | "trending";
  features: string[];
  isPopular: boolean;
  bookingsCount: number;
  professionals: number;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  serviceCount: number;
}

export interface ServicePageData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImages: ServiceImage[];
  rating: number;
  reviewCount: number;
  bookingsCount: number;
  startingPrice: number;
  currency: string;
  duration: string;
  categories: ServiceCategory[];
  services: ServiceItem[];
  benefits: ServiceBenefit[];
  howItWorks: HowItWorksStep[];
  professionals: Professional[];
}

export interface ServiceBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface Professional {
  id: string;
  name: string;
  avatar: ServiceImage;
  rating: number;
  reviewCount: number;
  experience: string;
  specializations: string[];
  completedJobs: number;
  isVerified: boolean;
}

export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userAvatar: ServiceImage;
  rating: number;
  date: string;
  comment: string;
  serviceType: string;
  images?: ServiceImage[];
  isVerified: boolean;
  helpfulCount: number;
}

export interface FAQ {
  id: string;
  serviceSlug: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface CartItem {
  serviceId: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  duration: string;
  thumbnail: ServiceImage;
}

export interface Coupon {
  code: string;
  description: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrderValue: number;
  maxDiscount?: number;
}

export interface RatingSummary {
  average: number;
  total: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface PromoCardItem {
  id: string;
  media: {
    type: "image" | "video";
    src: string;
    alt: string;
    poster?: string; // poster for video
  };
  overlay?: {
    headline: string;
    sublines?: string[];
  };
  badge?: string;
  title: string;
  rating: number;
  reviewCount: number;
  currentPrice: number;
  originalPrice?: number;
  duration: string;
  highlights: string[];
}
