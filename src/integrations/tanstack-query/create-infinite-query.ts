import {
  InfiniteQueryObserver,
  type DefaultError,
  type InfiniteData,
  type InfiniteQueryObserverOptions,
  type QueryKey,
} from "@tanstack/query-core";
import type { Handle } from "remix/component";
import * as query from "./query-client";

type QueryHandle = Pick<
  Handle<unknown, unknown>,
  "context" | "queueTask" | "signal" | "update"
>;

interface ObservableQuery {
  subscribe(listener: () => void): () => void;
}

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

function subscribeToQuery(handle: QueryHandle, observer: ObservableQuery) {
  // Subscribing can start a fetch, so wait until browser commit, never SSR.
  handle.queueTask(() => {
    if (handle.signal.aborted) return;
    const unsubscribe = observer.subscribe(() => void handle.update());
    handle.signal.addEventListener("abort", unsubscribe, { once: true });
    // Reconcile cache changes between setup and subscription.
    void handle.update();
  });
}
