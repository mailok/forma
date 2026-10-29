import type {
  DefaultError,
  InfiniteData,
  InfiniteQueryObserverOptions,
  QueryKey,
  QueryKeyWithDataTag,
  QueryObserverOptions,
} from "@tanstack/query-core";

// The core exposes observer types, but its framework adapters own these helpers.
// Tagging keys keeps imperative cache reads typed as well as observer results.
export function queryOptions<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >,
) {
  return options as typeof options &
    QueryKeyWithDataTag<TQueryKey, TQueryFnData, TError>;
}

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
