import type { Handle } from "remix/component";

export type QueryHandle = Pick<
  Handle<unknown, unknown>,
  "context" | "queueTask" | "signal" | "update"
>;

interface ObservableQuery {
  subscribe(listener: () => void): () => void;
}

export function subscribeToQuery(
  handle: QueryHandle,
  observer: ObservableQuery,
) {
  // Subscribing can start a fetch, so wait until browser commit, never SSR.
  handle.queueTask(() => {
    if (handle.signal.aborted) {
      return;
    }
    const unsubscribe = observer.subscribe(() => void handle.update());
    handle.signal.addEventListener("abort", unsubscribe, { once: true });
    // Reconcile cache changes between setup and subscription.
    void handle.update();
  });
}
