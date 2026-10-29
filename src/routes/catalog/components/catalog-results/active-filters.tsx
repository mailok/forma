import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
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
        class="mb-5 flex flex-wrap items-center gap-2"
        aria-label="Active filters"
      >
        {filters.category !== "all" ? (
          <FilterChip
            label={categoryLabel()}
            removeLabel="Remove category filter"
            onRemove={() => context.selectCategory("all")}
          />
        ) : null}
        {filters.q ? (
          <FilterChip
            label={`“${filters.q}”`}
            removeLabel="Clear search"
            onRemove={() => context.clearSearch()}
          />
        ) : null}
        {selectedFacets().map((facet) => (
          <FilterChip
            key={`${facet.key}-${facet.value}`}
            label={facet.label}
            removeLabel={`Remove ${facet.label} filter`}
            onRemove={() => context.toggleFilter(facet.key, facet.value)}
          />
        ))}
        {filters.inStock ? (
          <FilterChip
            label="In stock"
            removeLabel="Remove in-stock filter"
            onRemove={() => context.setInStock(false)}
          />
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

interface FilterChipProps {
  label: string;
  removeLabel: string;
  onRemove(): void;
}

function FilterChip(handle: Handle<FilterChipProps>) {
  return () => (
    <Button
      variant="chip"
      size="chip"
      aria-label={handle.props.removeLabel}
      mix={on("click", () => handle.props.onRemove())}
    >
      {handle.props.label}
      <Icon name="close" class="size-3" />
    </Button>
  );
}
