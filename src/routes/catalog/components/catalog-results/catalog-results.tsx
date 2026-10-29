import { CatalogSearch } from "./catalog-search";
import { CatalogToolbar } from "./catalog-toolbar";
import { ActiveFilters } from "./active-filters";
import { ResultsError } from "./results-error";
import { ProductResults } from "./product-results";
import { ResultsPagination } from "./results-pagination";

export function CatalogResults() {
  return () => (
    <section class="min-w-0" aria-label="Product selection">
      <CatalogSearch />
      <CatalogToolbar />
      <ActiveFilters />
      <ResultsError />
      <ProductResults />
      <ResultsPagination />
    </section>
  );
}
