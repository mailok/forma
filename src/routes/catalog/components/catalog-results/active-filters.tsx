import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { hasActiveSearchProductsFilters } from "@/routes/catalog/search-products-filters";
import { Button } from "@/components/ui/button";
import { RemovableBadge } from "@/components/ui/removable-badge";
import { filterKeys } from "@/db/catalog-options";
import type { FilterKey } from "@/db/types";

interface SelectedFacet {
  key: FilterKey;
  value: string;
  label: string;
}

export function ActiveFilters(handle: Handle) {
  const { categories, search } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["filterschange"]);
  search.query.subscribe(
    (previous, next) => {
      if (previous.data !== next.data) {
        void handle.update();
      }
    },
    { signal: handle.signal },
  );

  function categoryLabel() {
    const { category } = search.filters;
    return categories.find((c) => c.id === category)?.label ?? category;
  }

  function selectedFacets(): SelectedFacet[] {
    const { filters, results } = search;
    return filterKeys.flatMap((key) =>
      filters[key].map((value) => ({
        key,
        value,
        label:
          results.facets
            .find((facet) => facet.key === key)
            ?.options.find((option) => option.value === value)?.label ?? value,
      })),
    );
  }

  return () => {
    if (!hasActiveSearchProductsFilters(search.filters)) {
      return null;
    }
    const { filters } = search;

    return (
      <div
        class="mb-8 flex flex-wrap items-center gap-2"
        aria-label="Active filters"
      >
        {filters.category !== "all" ? (
          <RemovableBadge
            removeLabel="Remove category filter"
            onRemove={() => search.selectCategory("all")}
          >
            {categoryLabel()}
          </RemovableBadge>
        ) : null}
        {filters.q ? (
          <RemovableBadge
            removeLabel="Clear search"
            onRemove={() => search.clearQuery()}
          >
            “{filters.q}”
          </RemovableBadge>
        ) : null}
        {selectedFacets().map((facet) => (
          <RemovableBadge
            key={`${facet.key}-${facet.value}`}
            removeLabel={`Remove ${facet.label} filter`}
            onRemove={() => search.toggleFilter(facet.key, facet.value)}
          >
            {facet.label}
          </RemovableBadge>
        ))}
        {filters.inStock ? (
          <RemovableBadge
            removeLabel="Remove in-stock filter"
            onRemove={() => search.setInStock(false)}
          >
            In stock
          </RemovableBadge>
        ) : null}
        <Button
          variant="link"
          size="sm"
          mix={on("click", () => search.resetFilters())}
        >
          Clear all
        </Button>
      </div>
    );
  };
}
