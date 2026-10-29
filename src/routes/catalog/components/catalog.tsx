import type { Handle, RemixNode } from "remix/component";
import { searchQueryMaxLength } from "@/db/catalog-options";
import { defaultSearchProductsFilters } from "@/db/default-search-products-filters";
import {
  countSearchProductsFilters,
  searchProductsFiltersToParams,
} from "@/routes/catalog/search-products-filters";
import { searchProducts } from "@/routes/catalog/queries/search-products";
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
  append?: boolean;
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
  const state: CatalogState = {
    filters: { ...handle.props.initialSearchResults.filters },
    searchResults: handle.props.initialSearchResults,
    status: "idle",
    error: null,
    mobileFilters: false,
    view: "grid",
  };
  let controller: AbortController | undefined;
  let debounce: ReturnType<typeof setTimeout> | undefined;
  let lastRequest: SearchRequest = {};
  let syncedSearch = "";

  handle.signal.addEventListener("abort", () => clearTimeout(debounce), {
    once: true,
  });

  function applyFilters(patch: FiltersPatch, request?: SearchRequest) {
    state.filters = { ...state.filters, ...patch, page: 1 };
    requestProductSearch(request);
  }

  function requestProductSearch({
    append = false,
    debounceMs = 0,
  }: SearchRequest = {}) {
    clearTimeout(debounce);
    controller?.abort();
    controller = new AbortController();
    lastRequest = { append };

    const signal = AbortSignal.any([controller.signal, handle.signal]);
    const filters = {
      ...state.filters,
      page: append ? state.searchResults.page + 1 : 1,
    };

    state.status = append ? "loading-more" : "loading";
    state.error = null;
    void handle.update();
    syncUrl();

    async function runProductSearch() {
      try {
        const results = await searchProducts({ filters, signal });
        if (signal.aborted) return;
        state.searchResults = append
          ? appendSearchResults(state.searchResults, results)
          : results;
      } catch (error) {
        if (signal.aborted) return;
        state.error =
          error instanceof Error
            ? error.message
            : "Unable to connect to the catalog.";
      }
      state.status = "idle";
      void handle.update();
    }

    // Pending state is immediate; only the search request is debounced.
    if (debounceMs)
      debounce = setTimeout(() => void runProductSearch(), debounceMs);
    else void runProductSearch();
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
      if (state.status === "idle" && state.searchResults.hasMore)
        requestProductSearch({ append: true });
    },
    retry() {
      requestProductSearch(lastRequest);
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

  return () => handle.props.children;
}

export const Context = CatalogProvider;

export function activeFilterCount(context: CatalogContext): number {
  return countSearchProductsFilters(context.state.filters);
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

function appendSearchResults(
  current: SearchProductsResult,
  next: SearchProductsResult,
): SearchProductsResult {
  return { ...next, items: [...current.items, ...next.items] };
}
