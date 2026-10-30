import {
  InfiniteQueryObserver,
  type InfiniteQueryObserverResult,
  type QueryClient,
} from "@tanstack/query-core";
import { searchQueryMaxLength } from "@/db/catalog-options";
import { defaultSearchProductsFilters } from "@/db/default-search-products-filters";
import type {
  CategoryId,
  FilterKey,
  SearchProductsFilters,
  SearchProductsResult,
  SortOrder,
} from "@/db/types";
import { Model } from "@/lib/model";
import { catalogQueries } from "@/routes/catalog/queries";
import { countSearchProductsFilters } from "@/routes/catalog/search-products-filters";

interface CatalogSearchEvents {
  filterschange: void;
  categorychange: void;
  resultschange: void;
  statuschange: void;
  errorchange: void;
}

export class CatalogSearch extends Model<CatalogSearchEvents> {
  #query: SearchObserver;
  #filters: SearchProductsFilters;
  #queryState: QueryState;
  #pendingSearch: ReturnType<typeof setTimeout> | undefined;

  constructor(options: CatalogSearchOptions) {
    super();
    this.#query = createSearchObserver(options);
    this.#filters = { ...options.initialSearchResults.filters };
    this.#queryState = {
      searchResults: options.initialSearchResults,
      status: "idle",
      error: null,
    };
  }

  get filters(): SearchProductsFilters {
    return this.#filters;
  }

  get activeFilterCount(): number {
    return countSearchProductsFilters(this.#filters);
  }

  get searchResults(): SearchProductsResult {
    return this.#queryState.searchResults;
  }

  get facetsMatchCategory(): boolean {
    return this.searchResults.filters.category === this.#filters.category;
  }

  get status(): CatalogSearchStatus {
    return this.#queryState.status;
  }

  get error(): string | null {
    return this.#queryState.error;
  }

  connect({ signal }: CatalogSearchConnection): void {
    if (signal.aborted) {
      return;
    }
    const unsubscribe = this.#query.subscribe(() => this.#publishQueryState());
    signal.addEventListener(
      "abort",
      () => {
        this.#cancelPendingSearch();
        unsubscribe();
      },
      { once: true },
    );
    // Reconcile cache changes between construction and subscription.
    this.#publishQueryState();
  }

  setQuery(value: string): void {
    this.#applyFilters(
      { q: value.slice(0, searchQueryMaxLength) },
      { debounceMs: searchDebounceMs },
    );
  }

  clearQuery(): void {
    this.#applyFilters({ q: "" });
  }

  selectCategory(category: CategoryId): void {
    this.#applyFilters({ category, brand: [], type: [], feature: [] });
  }

  toggleFilter(key: FilterKey, value: string): void {
    this.#applyFilters({ [key]: toggleValue(this.#filters[key], value) });
  }

  setInStock(inStock: boolean): void {
    this.#applyFilters({ inStock });
  }

  setSort(sort: SortOrder): void {
    this.#applyFilters({ sort });
  }

  resetFilters(): void {
    this.#replaceFilters(defaultSearchProductsFilters());
  }

  loadMore(): void {
    if (this.status !== "idle" || !this.#query.getCurrentResult().hasNextPage) {
      return;
    }
    void this.#query.fetchNextPage();
    this.#publishQueryState();
  }

  retry(): void {
    if (this.#query.getCurrentResult().isFetchNextPageError) {
      void this.#query.fetchNextPage();
    } else {
      void this.#query.refetch();
    }
    this.#publishQueryState();
  }

  #applyFilters(patch: FiltersPatch, request?: SearchRequest): void {
    this.#replaceFilters({ ...this.#filters, ...patch, page: 1 }, request);
  }

  #replaceFilters(
    filters: SearchProductsFilters,
    request?: SearchRequest,
  ): void {
    const previous = this.#filters;
    this.#filters = filters;
    this.#requestSearch(request);
    this.dispatch("filterschange");
    if (previous.category !== filters.category) {
      this.dispatch("categorychange");
    }
  }

  #requestSearch({ debounceMs = 0 }: SearchRequest = {}): void {
    this.#cancelPendingSearch();
    this.#query.setOptions({
      ...catalogQueries.search(this.#filters),
      enabled: debounceMs === 0,
    });
    if (debounceMs) {
      this.#pendingSearch = setTimeout(() => this.#startSearch(), debounceMs);
    }
    this.#publishQueryState();
  }

  #startSearch(): void {
    this.#pendingSearch = undefined;
    this.#query.setOptions(catalogQueries.search(this.#filters));
    this.#publishQueryState();
  }

  #cancelPendingSearch(): void {
    clearTimeout(this.#pendingSearch);
    this.#pendingSearch = undefined;
  }

  // The observer notifies on every fetch flag, so only announce values the UI reads.
  #publishQueryState(): void {
    const previous = this.#queryState;
    const next = this.#readQueryState();
    this.#queryState = next;
    if (next.searchResults !== previous.searchResults) {
      this.dispatch("resultschange");
    }
    if (next.status !== previous.status) {
      this.dispatch("statuschange");
    }
    if (next.error !== previous.error) {
      this.dispatch("errorchange");
    }
  }

  #readQueryState(): QueryState {
    const result = this.#query.getCurrentResult();
    const searchPending = this.#pendingSearch !== undefined;
    return {
      // Keep the displayed selection if a new query fails without cached data.
      searchResults: result.data ?? this.#queryState.searchResults,
      status: searchPending ? "loading" : queryStatus(result),
      error: searchPending ? null : (result.error?.message ?? null),
    };
  }
}

const searchDebounceMs = 280;

type CatalogSearchStatus = "idle" | "loading" | "loading-more";
type FiltersPatch = Partial<Omit<SearchProductsFilters, "page" | "limit">>;
type SearchObserver = ReturnType<typeof createSearchObserver>;
type SearchObserverResult = InfiniteQueryObserverResult<SearchProductsResult>;

interface QueryState {
  searchResults: SearchProductsResult;
  status: CatalogSearchStatus;
  error: string | null;
}

interface CatalogSearchOptions {
  queryClient: QueryClient;
  initialSearchResults: SearchProductsResult;
}

interface CatalogSearchConnection {
  signal: AbortSignal;
}

interface SearchRequest {
  debounceMs?: number;
}

function createSearchObserver({
  queryClient,
  initialSearchResults,
}: CatalogSearchOptions) {
  return new InfiniteQueryObserver(queryClient, {
    ...catalogQueries.search(initialSearchResults.filters),
    initialData: {
      pages: [initialSearchResults],
      pageParams: [1],
    },
  });
}

function queryStatus(result: SearchObserverResult): CatalogSearchStatus {
  if (result.isFetchingNextPage) {
    return "loading-more";
  }
  return isLoadingSelection(result) ? "loading" : "idle";
}

// Placeholder data reports success, so a refetch over current results stays silent.
function isLoadingSelection(result: SearchObserverResult): boolean {
  return result.isFetching && (result.isPlaceholderData || !result.isSuccess);
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}
