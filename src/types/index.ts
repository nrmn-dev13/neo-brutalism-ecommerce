export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface SortOption {
  value: string;
  label: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterOptions {
  priceRange?: PriceRange;
  minRating?: number;
}