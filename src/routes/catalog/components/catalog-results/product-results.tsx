import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import * as catalog from "@/routes/catalog/components/catalog";
import { isLoadingSelection } from "@/routes/catalog/models/catalog-search";
import { ProductList } from "./product-list";
import { EmptyResults } from "./empty-results";

export function ProductResults(handle: Handle) {
  const { search, ui } = handle.context.get(catalog.Context);
  ui.updateOn(handle, ["viewchange"]);
  search.query.subscribe(
    (previous, next) => {
      if (
        previous.data !== next.data ||
        previous.isFetchingNextPage !== next.isFetchingNextPage ||
        isLoadingSelection(previous) !== isLoadingSelection(next)
      ) {
        void handle.update();
      }
    },
    { signal: handle.signal },
  );

  return () => {
    const { isFetchingNextPage } = search.query;
    const loadingSelection = isLoadingSelection(search.query);
    const { items } = search.results;

    return (
      <div
        aria-busy={loadingSelection || isFetchingNextPage}
        class={cn(
          "transition-opacity duration-200",
          loadingSelection ? "opacity-45" : "opacity-100",
        )}
      >
        {items.length ? (
          <ProductList products={items} view={ui.view} />
        ) : (
          <EmptyResults onReset={() => search.resetFilters()} />
        )}
      </div>
    );
  };
}
