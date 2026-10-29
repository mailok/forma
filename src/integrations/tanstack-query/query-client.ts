import { QueryClient } from "@tanstack/query-core";
import type { Handle, RemixNode } from "remix/component";

interface QueryContext {
  queryClient: QueryClient;
}

interface Props {
  children?: RemixNode;
}

let browserContext: QueryContext | undefined;

function QueryProvider(handle: Handle<Props, QueryContext>) {
  const context = getQueryContext();
  handle.context.set(context);

  handle.queueTask(() => {
    context.queryClient.mount();
    handle.signal.addEventListener(
      "abort",
      () => context.queryClient.unmount(),
      { once: true },
    );
  });

  return () => handle.props.children;
}

export const Context = QueryProvider;

function getQueryContext(): QueryContext {
  // Server renders must never share a cache between requests.
  if (typeof window === "undefined") return createQueryContext();
  return (browserContext ??= createQueryContext());
}

function createQueryContext(): QueryContext {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: import.meta.env.PROD,
        retry: 1,
      },
    },
  });

  return { queryClient };
}
