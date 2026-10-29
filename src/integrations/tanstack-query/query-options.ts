import type {
  DefaultError,
  InfiniteData,
  InfiniteQueryObserverOptions,
  QueryKey,
  QueryKeyWithDataTag,
} from "@tanstack/query-core";

// The core exposes observer types, but its framework adapters own these helpers.
// Tagging keys keeps imperative cache reads typed as well as observer results.
export function infiniteQueryOptions<
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
) {
  return options as typeof options &
    QueryKeyWithDataTag<
      TQueryKey,
      InfiniteData<TQueryFnData, TPageParam>,
      TError
    >;
}
