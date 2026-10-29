import { filterKeys } from "@/db/catalog-options";
import type { SearchProductsFilters } from "@/db/types";

export function searchProductsFiltersToParams(
  filters: SearchProductsFilters,
  pagination = true,
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category !== "all") params.set("category", filters.category);
  for (const key of filterKeys) {
    for (const value of filters[key]) params.append(key, value);
  }
  if (filters.inStock) params.set("inStock", "true");
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  if (pagination) {
    params.set("page", String(filters.page));
    params.set("limit", String(filters.limit));
  }
  return params;
}

export function countSearchProductsFilters(
  filters: SearchProductsFilters,
): number {
  return (
    filters.brand.length +
    filters.type.length +
    filters.feature.length +
    filters.price.length +
    Number(filters.inStock)
  );
}
