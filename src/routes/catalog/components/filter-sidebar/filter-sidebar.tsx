import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import * as catalog from "@/routes/catalog/components/catalog";
import { FilterSidebarHeader } from "./filter-sidebar-header";
import { CategoryFilter } from "./category-filter";
import { FilterFacets } from "./filter-facets";
import { StockFilter } from "./stock-filter";
import { SidebarNote } from "./sidebar-note";

export function FilterSidebar(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => (
    <aside
      id="filters"
      aria-label="Product filters"
      class={cn(
        "self-start rounded-3xl border border-line bg-paper p-6 lg:sticky lg:top-24 lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0",
        context.state.mobileFilters ? "block" : "hidden",
      )}
    >
      <FilterSidebarHeader />
      <CategoryFilter />
      <FilterFacets />
      <StockFilter />
      <SidebarNote />
    </aside>
  );
}
