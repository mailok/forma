import type { SearchProductsFilters } from "./types";

export function defaultSearchProductsFilters(): SearchProductsFilters {
  return {
    q: "",
    category: "all",
    brand: [],
    type: [],
    feature: [],
    price: [],
    inStock: false,
    sort: "featured",
    page: 1,
    limit: 9,
  };
}
