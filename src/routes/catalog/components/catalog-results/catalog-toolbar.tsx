import { on, type Handle, type RemixNode } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select/select";
import type { SelectOption } from "@/components/ui/select/types";
import type { SortOrder } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";

const sortOptions: SelectOption[] = [
  { value: "featured", label: "Our selection" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

interface ViewOption {
  value: ProductView;
  label: string;
  icon: IconName;
}

const viewOptions: ViewOption[] = [
  { value: "grid", label: "Grid view", icon: "grid" },
  { value: "list", label: "List view", icon: "list" },
];

export function CatalogToolbar() {
  return () => (
    <div class="flex flex-wrap items-center justify-between gap-4 py-7">
      <ToolbarGroup>
        <ResultCount />
        <FiltersToggle />
      </ToolbarGroup>
      <ToolbarGroup>
        <SortSelect />
        <ViewToggle />
      </ToolbarGroup>
    </div>
  );
}

interface ToolbarGroupProps {
  children?: RemixNode;
}

function ToolbarGroup(handle: Handle<ToolbarGroupProps>) {
  return () => (
    <div class="flex items-center gap-3">{handle.props.children}</div>
  );
}

function ResultCount(handle: Handle) {
  const { search } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["statuschange", "resultschange"]);

  return () => {
    const { status, searchResults } = search;

    return (
      <p
        role="status"
        aria-live="polite"
        class="flex h-8 items-baseline gap-2 text-sm text-stone-500"
      >
        {status === "loading" ? (
          <span class="flex items-center gap-2 self-center text-forest">
            <Icon name="spinner" class="size-4 animate-spin" />
            Updating your selection…
          </span>
        ) : (
          <>
            <span class="text-[22px] leading-none font-semibold tracking-[-0.02em] text-ink tabular-nums">
              {searchResults.total}
            </span>
            {searchResults.total === 1
              ? "product to discover"
              : "products to discover"}
          </>
        )}
      </p>
    );
  };
}

function FiltersToggle(handle: Handle) {
  const { search, ui } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["filterschange"]);
  ui.updateOn(handle, ["mobilefilterschange"]);

  return () => {
    const count = search.activeFilterCount;

    return (
      <Button
        aria-controls="filters"
        aria-expanded={ui.mobileFiltersOpen}
        variant="outline"
        size="sm"
        class="lg:hidden"
        mix={on("click", () => ui.toggleMobileFilters())}
      >
        <Icon name="sliders" class="size-4" />
        Filters
        {count ? (
          <span class="flex size-5 items-center justify-center rounded-full bg-ink text-[11px] text-paper tabular-nums">
            {count}
          </span>
        ) : null}
      </Button>
    );
  };
}

function SortSelect(handle: Handle) {
  const { search } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["filterschange"]);

  return () => (
    <>
      <label
        for="product-sort"
        class="hidden text-[13px] text-stone-400 sm:block"
      >
        Sort by
      </label>
      <Select
        id="product-sort"
        label="Sort products"
        value={search.filters.sort}
        variant="subtle"
        class="w-48"
        options={sortOptions}
        onValueChange={(value) => search.setSort(value as SortOrder)}
      />
    </>
  );
}

function ViewToggle(handle: Handle) {
  const { ui } = handle.context.get(catalog.Context);
  ui.updateOn(handle, ["viewchange"]);

  return () => (
    <div class="flex gap-0.5 rounded-full bg-ink/5 p-0.5">
      {viewOptions.map((option) => (
        <Button
          key={option.value}
          aria-label={option.label}
          aria-pressed={ui.view === option.value}
          variant="ghost"
          size="icon-sm"
          mix={on("click", () => ui.setView(option.value))}
        >
          <Icon name={option.icon} class="size-4" />
        </Button>
      ))}
    </div>
  );
}
