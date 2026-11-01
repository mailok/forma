import type {
  InfiniteQueryObserverResult,
  QueryClient,
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
import { createInfiniteQuery } from "@/integrations/tanstack-query/create-infinite-query";
import { Model } from "@/lib/model";
import { catalogQueries } from "@/routes/catalog/queries";
import { countSearchProductsFilters } from "@/routes/catalog/search-products-filters";

interface CatalogSearchEvents {
  filterschange: void;
  categorychange: void;
}

export class CatalogSearch extends Model<CatalogSearchEvents> {
  readonly query: SearchQuery;
  #filters: SearchProductsFilters;
  #lastResults: SearchProductsResult;
  #pendingSearch: ReturnType<typeof setTimeout> | undefined;

  constructor(options: CatalogSearchOptions) {
    super();
    this.query = createSearchQuery(options);
    this.#filters = { ...options.initialSearchResults.filters };
    this.#lastResults = options.initialSearchResults;
    this.query.subscribe(
      (_previous, next) => {
        if (next.data) {
          this.#lastResults = next.data;
        }
      },
      { signal: options.signal },
    );
    options.signal.addEventListener(
      "abort",
      () => this.#cancelPendingSearch(),
      { once: true },
    );
  }

  get filters(): SearchProductsFilters {
    return this.#filters;
  }

  get activeFilterCount(): number {
    return countSearchProductsFilters(this.#filters);
  }

  // Keep the displayed selection if a new search fails without cached data.
  get results(): SearchProductsResult {
    return this.query.data ?? this.#lastResults;
  }

  get facetsMatchCategory(): boolean {
    return this.results.filters.category === this.#filters.category;
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
    const { hasNextPage, isFetchingNextPage, fetchNextPage } = this.query;
    if (!hasNextPage || isFetchingNextPage || isLoadingSelection(this.query)) {
      return;
    }
    void fetchNextPage();
  }

  retry(): void {
    if (this.query.isFetchNextPageError) {
      void this.query.fetchNextPage();
    } else {
      void this.query.refetch();
    }
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

  // A debounced search keeps its query disabled until the input settles, so
  // `isEnabled` tells readers that a search is pending.
  #requestSearch({ debounceMs = 0 }: SearchRequest = {}): void {
    this.#cancelPendingSearch();
    this.query.setOptions({
      ...catalogQueries.search(this.#filters),
      enabled: debounceMs === 0,
    });
    if (debounceMs) {
      this.#pendingSearch = setTimeout(() => this.#startSearch(), debounceMs);
    }
  }

  #startSearch(): void {
    this.#pendingSearch = undefined;
    this.query.setOptions(catalogQueries.search(this.#filters));
  }

  #cancelPendingSearch(): void {
    clearTimeout(this.#pendingSearch);
    this.#pendingSearch = undefined;
  }
}

export type SearchQueryState =
  InfiniteQueryObserverResult<SearchProductsResult>;

// Placeholder data reports success, so a refetch over current results stays silent.
export function isLoadingSelection(query: SearchQueryState): boolean {
  return (
    !query.isEnabled ||
    (query.isFetching && (query.isPlaceholderData || !query.isSuccess))
  );
}

const searchDebounceMs = 280;

type FiltersPatch = Partial<Omit<SearchProductsFilters, "page" | "limit">>;
type SearchQuery = ReturnType<typeof createSearchQuery>;

interface CatalogSearchOptions {
  queryClient: QueryClient;
  initialSearchResults: SearchProductsResult;
  signal: AbortSignal;
}

interface SearchRequest {
  debounceMs?: number;
}

function createSearchQuery({
  queryClient,
  initialSearchResults,
}: CatalogSearchOptions) {
  return createInfiniteQuery(queryClient, {
    ...catalogQueries.search(initialSearchResults.filters),
    initialData: {
      pages: [initialSearchResults],
      pageParams: [1],
    },
  });
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}
