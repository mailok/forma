import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import * as catalog from "@/routes/catalog/components/catalog";
import { ProductList } from "./product-list";
import { EmptyResults } from "./empty-results";

export function ProductResults(handle: Handle) {
  const { search, ui } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["statuschange", "resultschange"]);
  ui.updateOn(handle, ["viewchange"]);

  return () => {
    const { status, searchResults } = search;

    return (
      <div
        aria-busy={status !== "idle"}
        class={cn(
          "transition-opacity duration-200",
          status === "loading" ? "opacity-45" : "opacity-100",
        )}
      >
        {searchResults.items.length ? (
          <ProductList products={searchResults.items} view={ui.view} />
        ) : (
          <EmptyResults onReset={() => search.resetFilters()} />
        )}
      </div>
    );
  };
}
