import database from "./products.json" with { type: "json" };
import { categoryIds, filterKeys } from "./catalog-options";
import {
  categoryCopy,
  filterGroupLabels,
  filterOptionLabel,
} from "./catalog-labels";
import { priceRangeOf, priceRanges } from "./price-ranges";
import type {
  Category,
  CategoryId,
  FilterGroup,
  FilterKey,
  Product,
  ProductSummary,
  SearchProductsFilters,
  SearchProductsResult,
  SortOrder,
} from "./types";

type ProductComparator = (a: Product, b: Product) => number;

// This module is server-only. The browser receives summaries, never the JSON database.
const products = database as Product[];

// Read-only JSON client shared by API handlers and Astro's server-side rendering.
export const db = {
  categories: {
    findMany: findCategories,
  },
  products: {
    search: searchProducts,
    findUnique: findProduct,
    filterValues: listFilterValues,
  },
};

const byFeaturedRank: ProductComparator = (a, b) =>
  a.featuredRank - b.featuredRank;

const sortComparators: Record<SortOrder, ProductComparator> = {
  featured: byFeaturedRank,
  "price-asc": (a, b) => a.price - b.price || byFeaturedRank(a, b),
  "price-desc": (a, b) => b.price - a.price || byFeaturedRank(a, b),
  name: (a, b) => a.name.localeCompare(b.name, "en"),
};

function findCategories(): Category[] {
  return categoryIds.map((id) => ({
    id,
    ...categoryCopy[id],
    count: productsIn(id).length,
  }));
}

function findProduct(idOrSlug: string): Product | undefined {
  return products.find(
    (product) => product.id === idOrSlug || product.slug === idOrSlug,
  );
}

function listFilterValues(key: FilterKey, category: CategoryId): string[] {
  if (key === "price") {
    return priceRanges.map((range) => range.value);
  }
  const values = productsIn(category).flatMap((product) =>
    productFilterValues(product, key),
  );
  return [...new Set(values)].sort((a, b) =>
    filterOptionLabel(key, a).localeCompare(filterOptionLabel(key, b), "en"),
  );
}

function searchProducts(filters: SearchProductsFilters): SearchProductsResult {
  const matchingProducts = products
    .filter((product) => matches(product, filters))
    .sort(sortComparators[filters.sort]);
  const start = (filters.page - 1) * filters.limit;
  const end = start + filters.limit;

  return {
    items: matchingProducts.slice(start, end).map(toProductSummary),
    total: matchingProducts.length,
    page: filters.page,
    limit: filters.limit,
    hasMore: end < matchingProducts.length,
    facets: buildFacets(filters),
    filters,
  };
}

// Disjunctive counts: OR within a group, AND between groups. A group's own selections
// are excluded from its counts so alternatives remain discoverable.
function buildFacets(filters: SearchProductsFilters): FilterGroup[] {
  return facetKeysFor(filters.category).map((key) => ({
    key,
    label: filterGroupLabels[key],
    options: listFilterValues(key, filters.category).map((value) => ({
      value,
      label: filterOptionLabel(key, value),
      count: countMatches({ ...filters, [key]: [value] }),
    })),
  }));
}

function facetKeysFor(category: CategoryId): FilterKey[] {
  return category === "all"
    ? ["brand", "price"]
    : ["type", "brand", "feature", "price"];
}

function countMatches(filters: SearchProductsFilters): number {
  return products.filter((product) => matches(product, filters)).length;
}

function matches(product: Product, filters: SearchProductsFilters): boolean {
  return (
    inCategory(product, filters.category) &&
    (!filters.inStock || product.stock > 0) &&
    matchesQuery(product, filters.q) &&
    matchesFilterGroups(product, filters)
  );
}

function matchesQuery(product: Product, q: string): boolean {
  const words = normalizeForSearch(q).split(/\s+/).filter(Boolean);
  const text = normalizeForSearch(
    `${product.name} ${product.title} ${filterOptionLabel("brand", product.brand)}`,
  );
  return words.every((word) => text.includes(word));
}

function matchesFilterGroups(
  product: Product,
  filters: SearchProductsFilters,
): boolean {
  return filterKeys.every((key) => {
    const selected = filters[key];
    if (!selected.length) {
      return true;
    }
    const values = productFilterValues(product, key);
    return selected.some((value) => values.includes(value));
  });
}

function productFilterValues(product: Product, key: FilterKey): string[] {
  if (key === "feature") {
    return product.features;
  }
  if (key === "price") {
    return [priceRangeOf(product.price)];
  }
  return [product[key]];
}

function productsIn(category: CategoryId): Product[] {
  return products.filter((product) => inCategory(product, category));
}

function inCategory(product: Product, category: CategoryId): boolean {
  return category === "all" || product.category === category;
}

function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function toProductSummary({
  description,
  specifications,
  ...summary
}: Product): ProductSummary {
  return summary;
}
