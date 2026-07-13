export interface DynamicService {
  id: string;
  title: string;
  price: string;
  originalPrice?: string | null;
  duration: string;
  media: string;
  rating: string | number; 
  reviews: string | number;  
  category: string;
  tag?: string;
  isSpotlight?: boolean;
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
}

export interface DetailData {
  title: string;
  rating: string | number; 
  reviews: string | number;  
  media: string;
  video: string;
  categories: Category[];
  services: DynamicService[];
  steps?: unknown[];
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  duration: string;
}