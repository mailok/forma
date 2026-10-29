import { keepPreviousData, type InfiniteData } from "@tanstack/query-core";
import type { SearchProductsFilters, SearchProductsResult } from "@/db/types";
import { infiniteQueryOptions } from "@/integrations/tanstack-query/query-options";
import { searchProducts } from "./search-products";

const searchStaleTimeMs = 30_000;

export const catalogKeys = {
  all: ["catalog"] as const,
  searches: () => [...catalogKeys.all, "search"] as const,
  search: (filters: SearchProductsFilters) =>
    [...catalogKeys.searches(), normalizeSearchFilters(filters)] as const,
};

export const catalogQueries = {
  search: (filters: SearchProductsFilters) =>
    infiniteQueryOptions({
      queryKey: catalogKeys.search(filters),
      queryFn: ({ queryKey, pageParam, signal }) =>
        searchProducts({
          filters: { ...queryKey[2], page: pageParam },
          signal,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
      select: combineSearchPages,
      placeholderData: keepPreviousData,
      staleTime: searchStaleTimeMs,
      // A focus refetch would reload every page discovered so far.
      refetchOnWindowFocus: false,
    }),
};

function normalizeSearchFilters({
  page: _page,
  ...filters
}: SearchProductsFilters) {
  return {
    ...filters,
    brand: [...filters.brand].sort(),
    type: [...filters.type].sort(),
    feature: [...filters.feature].sort(),
    price: [...filters.price].sort(),
  };
}

function combineSearchPages(data: InfiniteData<SearchProductsResult, number>) {
  return data.pages.reduce((current, next) => ({
    ...next,
    items: [...current.items, ...next.items],
  }));
}
