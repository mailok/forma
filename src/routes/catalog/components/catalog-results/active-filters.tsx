import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
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
  const context = handle.context.get(catalog.Context);

  function hasActiveFilters() {
    const { filters } = context.state;
    return (
      catalog.activeFilterCount(context) > 0 ||
      filters.q !== "" ||
      filters.category !== "all"
    );
  }

  function categoryLabel() {
    const { category } = context.state.filters;
    return context.categories.find((c) => c.id === category)?.label ?? category;
  }

  function selectedFacets(): SelectedFacet[] {
    const { filters, searchResults } = context.state;
    return filterKeys.flatMap((key) =>
      filters[key].map((value) => ({
        key,
        value,
        label:
          searchResults.facets
            .find((facet) => facet.key === key)
            ?.options.find((option) => option.value === value)?.label ?? value,
      })),
    );
  }

  return () => {
    if (!hasActiveFilters()) return null;
    const { filters } = context.state;

    return (
      <div
        class="mb-8 flex flex-wrap items-center gap-2"
        aria-label="Active filters"
      >
        {filters.category !== "all" ? (
          <RemovableBadge
            removeLabel="Remove category filter"
            onRemove={() => context.selectCategory("all")}
          >
            {categoryLabel()}
          </RemovableBadge>
        ) : null}
        {filters.q ? (
          <RemovableBadge
            removeLabel="Clear search"
            onRemove={() => context.clearSearch()}
          >
            “{filters.q}”
          </RemovableBadge>
        ) : null}
        {selectedFacets().map((facet) => (
          <RemovableBadge
            key={`${facet.key}-${facet.value}`}
            removeLabel={`Remove ${facet.label} filter`}
            onRemove={() => context.toggleFilter(facet.key, facet.value)}
          >
            {facet.label}
          </RemovableBadge>
        ))}
        {filters.inStock ? (
          <RemovableBadge
            removeLabel="Remove in-stock filter"
            onRemove={() => context.setInStock(false)}
          >
            In stock
          </RemovableBadge>
        ) : null}
        <Button
          variant="link"
          size="sm"
          mix={on("click", () => context.reset())}
        >
          Clear all
        </Button>
      </div>
    );
  };
}
