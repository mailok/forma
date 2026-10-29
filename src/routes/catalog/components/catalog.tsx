import type { InfiniteQueryObserverResult } from "@tanstack/query-core";
import type { Handle, RemixNode } from "remix/component";
import { createInfiniteQuery } from "@/integrations/tanstack-query/create-infinite-query";
import { searchQueryMaxLength } from "@/db/catalog-options";
import { defaultSearchProductsFilters } from "@/db/default-search-products-filters";
import {
  countSearchProductsFilters,
  searchProductsFiltersToParams,
} from "@/routes/catalog/search-products-filters";
import { catalogQueries } from "@/routes/catalog/queries";
import type { ProductView } from "@/routes/catalog/types";
import type {
  Category,
  CategoryId,
  FilterKey,
  SearchProductsFilters,
  SearchProductsResult,
  SortOrder,
} from "@/db/types";

const searchDebounceMs = 280;

type CatalogStatus = "idle" | "loading" | "loading-more";

type FiltersPatch = Partial<Omit<SearchProductsFilters, "page" | "limit">>;

interface CatalogState {
  filters: SearchProductsFilters;
  searchResults: SearchProductsResult;
  status: CatalogStatus;
  error: string | null;
  mobileFilters: boolean;
  view: ProductView;
}

interface CatalogContext {
  state: CatalogState;
  categories: Category[];
  search(value: string): void;
  clearSearch(): void;
  selectCategory(value: CategoryId): void;
  toggleFilter(key: FilterKey, value: string): void;
  setInStock(value: boolean): void;
  sort(value: SortOrder): void;
  reset(): void;
  loadMore(): void;
  retry(): void;
  toggleMobileFilters(): void;
  setView(value: ProductView): void;
}

interface SearchRequest {
  debounceMs?: number;
}

export interface CatalogContextProps {
  initialSearchResults: SearchProductsResult;
  categories: Category[];
  children?: RemixNode;
}

/** A single Remix context owns the catalog. Descendants use get(catalog.Context),
 * not a chain of filter props. Context writes are paired with an explicit update. */
function CatalogProvider(handle: Handle<CatalogContextProps, CatalogContext>) {
  let debounce: ReturnType<typeof setTimeout> | undefined;
  let displayedSearchResults = handle.props.initialSearchResults;
  let syncedSearch = "";

  const searchQuery = createInfiniteQuery(handle, {
    ...catalogQueries.search(handle.props.initialSearchResults.filters),
    initialData: {
      pages: [handle.props.initialSearchResults],
      pageParams: [1],
    },
  });

  const state: CatalogState = {
    filters: { ...handle.props.initialSearchResults.filters },
    get searchResults() {
      return searchQuery.getCurrentResult().data ?? displayedSearchResults;
    },
    get status() {
      const result = searchQuery.getCurrentResult();
      if (debounce !== undefined) return "loading";
      if (result.isFetchingNextPage) return "loading-more";
      return isLoadingSelection(result) ? "loading" : "idle";
    },
    get error() {
      return debounce === undefined
        ? (searchQuery.getCurrentResult().error?.message ?? null)
        : null;
    },
    mobileFilters: false,
    view: "grid",
  };

  handle.signal.addEventListener("abort", () => clearTimeout(debounce), {
    once: true,
  });

  function applyFilters(patch: FiltersPatch, request?: SearchRequest) {
    state.filters = { ...state.filters, ...patch, page: 1 };
    requestProductSearch(request);
  }

  function requestProductSearch({ debounceMs = 0 }: SearchRequest = {}) {
    clearTimeout(debounce);
    debounce = undefined;

    searchQuery.setOptions({
      ...catalogQueries.search(state.filters),
      enabled: debounceMs === 0,
    });
    if (debounceMs) debounce = setTimeout(runProductSearch, debounceMs);
    syncUrl();
    void handle.update();
  }

  function runProductSearch() {
    debounce = undefined;
    searchQuery.setOptions(catalogQueries.search(state.filters));
    void handle.update();
  }

  function syncUrl() {
    const url = new URL(window.location.href);
    url.search = searchProductsFiltersToParams(state.filters, false).toString();
    window.history.replaceState(window.history.state, "", url);
    syncedSearch = url.search;
  }

  function reloadOnFiltersNavigation() {
    if (window.location.search !== syncedSearch) window.location.reload();
  }

  const context: CatalogContext = {
    state,
    categories: handle.props.categories,
    search(q) {
      applyFilters(
        { q: q.slice(0, searchQueryMaxLength) },
        { debounceMs: searchDebounceMs },
      );
    },
    clearSearch() {
      applyFilters({ q: "" });
    },
    selectCategory(category) {
      applyFilters({ category, brand: [], type: [], feature: [] });
    },
    toggleFilter(key, value) {
      applyFilters({ [key]: toggleValue(state.filters[key], value) });
    },
    setInStock(inStock) {
      applyFilters({ inStock });
    },
    sort(sort) {
      applyFilters({ sort });
    },
    reset() {
      state.filters = defaultSearchProductsFilters();
      requestProductSearch();
    },
    loadMore() {
      if (state.status === "idle" && searchQuery.getCurrentResult().hasNextPage)
        void searchQuery.fetchNextPage();
    },
    retry() {
      if (searchQuery.getCurrentResult().isFetchNextPageError) {
        void searchQuery.fetchNextPage();
      } else {
        void searchQuery.refetch();
      }
    },
    toggleMobileFilters() {
      state.mobileFilters = !state.mobileFilters;
      void handle.update();
    },
    setView(view) {
      state.view = view;
      void handle.update();
    },
  };
  handle.context.set(context);

  // queueTask only runs in the browser. Hash links also fire popstate, so only
  // a different query string means the filters changed.
  handle.queueTask(() => {
    syncedSearch = window.location.search;
    window.addEventListener("popstate", reloadOnFiltersNavigation, {
      signal: handle.signal,
    });
  });

  return () => {
    // Keep the displayed selection if a new query fails without cached data.
    displayedSearchResults = state.searchResults;
    return handle.props.children;
  };
}

export const Context = CatalogProvider;

export function activeFilterCount(context: CatalogContext): number {
  return countSearchProductsFilters(context.state.filters);
}

// Placeholder data reports success, so a refetch over current results stays silent.
function isLoadingSelection(
  result: InfiniteQueryObserverResult<SearchProductsResult>,
): boolean {
  return result.isFetching && (result.isPlaceholderData || !result.isSuccess);
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}
