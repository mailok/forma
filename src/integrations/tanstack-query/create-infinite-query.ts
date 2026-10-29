import {
  InfiniteQueryObserver,
  type DefaultError,
  type InfiniteData,
  type InfiniteQueryObserverOptions,
  type QueryKey,
} from "@tanstack/query-core";
import * as query from "./query-client";
import { subscribeToQuery, type QueryHandle } from "./subscribe-to-query";

export function createInfiniteQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  handle: QueryHandle,
  options: InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
) {
  const { queryClient } = handle.context.get(query.Context);
  const observer = new InfiniteQueryObserver(queryClient, options);
  subscribeToQuery(handle, observer);
  return observer;
}
