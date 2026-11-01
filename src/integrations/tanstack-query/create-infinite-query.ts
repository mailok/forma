import {
  InfiniteQueryObserver,
  type DefaultError,
  type InfiniteData,
  type InfiniteQueryObserverOptions,
  type InfiniteQueryObserverResult,
  type QueryClient,
  type QueryKey,
} from "@tanstack/query-core";
import { createQueryResult } from "./create-query-result";

export function createInfiniteQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  queryClient: QueryClient,
  options: InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
) {
  type Result = InfiniteQueryObserverResult<TData, TError>;

  const observer = new InfiniteQueryObserver(queryClient, options);
  const listeners = new Set<QueryChangeListener<Result>>();
  let published = observer.getCurrentResult();

  function publish(next: Result) {
    const previous = published;
    published = next;
    for (const listener of listeners) {
      listener(previous, next);
    }
  }

  // Subscribing to the observer can start a fetch, so only call it after a
  // browser commit, never during SSR.
  function mount({ signal }: QuerySubscriptionOptions) {
    if (signal.aborted) {
      return;
    }
    const unsubscribe = observer.subscribe(publish);
    signal.addEventListener("abort", unsubscribe, { once: true });
    // Reconcile cache changes between creation and mount.
    const current = observer.getCurrentResult();
    if (current !== published) {
      publish(current);
    }
  }

  function subscribe(
    listener: QueryChangeListener<Result>,
    { signal }: QuerySubscriptionOptions,
  ) {
    if (signal.aborted) {
      return;
    }
    listeners.add(listener);
    signal.addEventListener("abort", () => listeners.delete(listener), {
      once: true,
    });
  }

  function setOptions(
    nextOptions: InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
  ) {
    observer.setOptions(nextOptions);
  }

  return Object.assign(createQueryResult(observer), {
    mount,
    subscribe,
    setOptions,
  });
}

export type QueryChangeListener<TResult> = (
  previous: TResult,
  next: TResult,
) => void;

interface QuerySubscriptionOptions {
  signal: AbortSignal;
}
