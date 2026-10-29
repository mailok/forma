import {
  categoryIds,
  filterKeys,
  searchQueryMaxLength,
  sortOrders,
} from "@/db/catalog-options";
import { defaultSearchProductsFilters } from "@/db/default-search-products-filters";
import type { CategoryId, FilterKey, SearchProductsFilters } from "@/db/types";

export class InvalidSearchProductsQuery extends Error {}

type GetFilterValues = (key: FilterKey, category: CategoryId) => string[];

export function parseSearchProductsFilters(
  params: URLSearchParams,
  getFilterValues: GetFilterValues,
): SearchProductsFilters {
  const filters = defaultSearchProductsFilters();
  const allowed = new Set([
    "q",
    "category",
    "brand",
    "type",
    "feature",
    "price",
    "inStock",
    "sort",
    "page",
    "limit",
  ]);
  for (const key of params.keys()) {
    if (!allowed.has(key))
      throw new InvalidSearchProductsQuery(`Unknown query parameter: ${key}.`);
  }
  for (const key of ["q", "category", "inStock", "sort", "page", "limit"]) {
    if (params.getAll(key).length > 1)
      throw new InvalidSearchProductsQuery(
        `The ${key} parameter cannot be repeated.`,
      );
  }
  const q = (params.get("q") ?? "").trim();
  if (q.length > searchQueryMaxLength)
    throw new InvalidSearchProductsQuery(
      `Search queries support up to ${searchQueryMaxLength} characters.`,
    );
  filters.q = q;
  const category = params.get("category") ?? "all";
  if (!categoryIds.includes(category as CategoryId))
    throw new InvalidSearchProductsQuery("Invalid category.");
  filters.category = category as CategoryId;
  const sort = params.get("sort") ?? "featured";
  if (!sortOrders.includes(sort as SearchProductsFilters["sort"]))
    throw new InvalidSearchProductsQuery("Invalid sort order.");
  filters.sort = sort as SearchProductsFilters["sort"];
  if (
    params.has("inStock") &&
    !["true", "false"].includes(params.get("inStock")!)
  )
    throw new InvalidSearchProductsQuery("inStock must be true or false.");
  filters.inStock = params.get("inStock") === "true";
  for (const key of ["page", "limit"] as const) {
    if (!params.has(key)) continue;
    const raw = params.get(key)!;
    const value = Number(raw);
    if (
      !/^\d+$/.test(raw) ||
      !Number.isSafeInteger(value) ||
      value < 1 ||
      value > (key === "limit" ? 24 : 10000)
    ) {
      throw new InvalidSearchProductsQuery(
        `${key} must be an integer between 1 and ${key === "limit" ? 24 : 10000}.`,
      );
    }
    filters[key] = value;
  }
  for (const key of filterKeys) {
    const possible = new Set(getFilterValues(key, filters.category));
    const values = [...new Set(params.getAll(key))];
    if (values.length > 24 || values.some((v) => !possible.has(v)))
      throw new InvalidSearchProductsQuery(
        `Invalid ${key} filter for this category.`,
      );
    filters[key] = values;
  }
  return filters;
}
