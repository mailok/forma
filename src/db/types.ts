export type CategoryId =
  "all" | "electronics" | "clothing" | "home" | "outdoors";
export type ProductCategoryId = Exclude<CategoryId, "all">;
export type FilterKey = "brand" | "type" | "feature" | "price";
export type SortOrder = "featured" | "price-asc" | "price-desc" | "name";
export type ProductBadge = "new" | "favorite";

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  title: string;
  description: string;
  category: ProductCategoryId;
  brand: string;
  price: number;
  originalPrice: number | null;
  currency: "USD";
  stock: number;
  rating: number;
  reviews: number;
  image: string;
  imageAlt: string;
  colors: string[];
  type: string;
  features: string[];
  badge: ProductBadge | null;
  featuredRank: number;
  specifications: Record<string, string>;
}

export type ProductSummary = Omit<Product, "description" | "specifications">;

export interface SearchProductsFilters {
  q: string;
  category: CategoryId;
  brand: string[];
  type: string[];
  feature: string[];
  price: string[];
  inStock: boolean;
  sort: SortOrder;
  page: number;
  limit: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterGroup {
  key: FilterKey;
  label: string;
  options: FilterOption[];
}

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  count: number;
}

export interface SearchProductsResult {
  items: ProductSummary[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  facets: FilterGroup[];
  filters: SearchProductsFilters;
}
