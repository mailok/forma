import type { Handle, RemixNode } from "remix/component";
import type {
  Category,
  SearchProductsFilters,
  SearchProductsResult,
} from "@/db/types";
import * as query from "@/integrations/tanstack-query/query-client";
import { CatalogSearch } from "@/routes/catalog/models/catalog-search";
import { CatalogUi } from "@/routes/catalog/models/catalog-ui";
import { searchProductsFiltersToParams } from "@/routes/catalog/search-products-filters";

export const Context = CatalogProvider;

interface CatalogContext {
  categories: Category[];
  search: CatalogSearch;
  ui: CatalogUi;
}

interface Props {
  initialSearchResults: SearchProductsResult;
  categories: Category[];
  children?: RemixNode;
}

function CatalogProvider(handle: Handle<Props, CatalogContext>) {
  const { queryClient } = handle.context.get(query.Context);
  const search = new CatalogSearch({
    queryClient,
    initialSearchResults: handle.props.initialSearchResults,
    signal: handle.signal,
  });

  handle.context.set({
    categories: handle.props.categories,
    search,
    ui: new CatalogUi(),
  });

  search.listen(handle, ["filterschange"], () =>
    syncCatalogUrl(search.filters),
  );

  handle.queueTask(() => search.query.mount({ signal: handle.signal }));

  return () => handle.props.children;
}

function syncCatalogUrl(filters: SearchProductsFilters) {
  // Astro's router keeps its own copy of the last URL it navigated to, and this
  // replaceState does not update it. In-page catalog links must therefore use
  // data-astro-history="replace" so a later navigation does not skip the reload.
  const url = new URL(window.location.href);
  url.search = searchProductsFiltersToParams(filters, false).toString();
  window.history.replaceState(window.history.state, "", url);
}
