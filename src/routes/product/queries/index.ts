import { queryOptions } from "@/integrations/tanstack-query/query-options";
import { findProduct } from "./find-product";

const productStaleTimeMs = 30_000;

export const productKeys = {
  all: ["product"] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
};

export const productQueries = {
  detail: (slug: string) =>
    queryOptions({
      queryKey: productKeys.detail(slug),
      queryFn: ({ queryKey, signal }) =>
        findProduct({ slug: queryKey[2], signal }),
      staleTime: productStaleTimeMs,
    }),
};
