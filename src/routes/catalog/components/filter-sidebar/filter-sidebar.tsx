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
        "self-start rounded-2xl border border-stone-200/80 bg-white p-5 lg:sticky lg:top-6 lg:block",
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
