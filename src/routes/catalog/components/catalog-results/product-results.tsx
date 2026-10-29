import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import * as catalog from "@/routes/catalog/components/catalog";
import { ProductList } from "./product-list";
import { EmptyResults } from "./empty-results";

export function ProductResults(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => {
    const { status, searchResults, view } = context.state;

    return (
      <div
        aria-busy={status !== "idle"}
        class={cn(
          "transition-opacity duration-200",
          status === "loading" ? "opacity-45" : "opacity-100",
        )}
      >
        {searchResults.items.length ? (
          <ProductList products={searchResults.items} view={view} />
        ) : (
          <EmptyResults onReset={() => context.reset()} />
        )}
      </div>
    );
  };
}
