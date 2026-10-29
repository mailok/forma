import {
  QueryObserver,
  type DefaultError,
  type QueryKey,
  type QueryObserverOptions,
} from "@tanstack/query-core";
import * as query from "./query-client";
import { subscribeToQuery, type QueryHandle } from "./subscribe-to-query";

export function createQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  handle: QueryHandle,
  options: QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >,
) {
  const { queryClient } = handle.context.get(query.Context);
  const observer = new QueryObserver(queryClient, options);
  subscribeToQuery(handle, observer);
  return observer;
}
