import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import * as catalog from "@/routes/catalog/components/catalog";
import { Checkbox } from "@/components/ui/checkbox";
import type { FilterGroup, FilterOption } from "@/db/types";
import { FilterLegend } from "./filter-label";

export function FilterFacets(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => {
    const { filters, searchResults, error } = context.state;

    if (searchResults.filters.category !== filters.category) {
      return (
        <p
          role="status"
          class="border-t border-stone-100 py-6 text-xs text-stone-400"
        >
          {error ? "Retry to load the filters." : "Preparing filters…"}
        </p>
      );
    }

    return (
      <>
        {searchResults.facets.map((group) => (
          <FilterSection
            key={`${searchResults.filters.category}-${group.key}`}
            group={group}
          />
        ))}
      </>
    );
  };
}

interface FilterSectionProps {
  group: FilterGroup;
}

function FilterSection(handle: Handle<FilterSectionProps>) {
  return () => (
    <fieldset class="border-t border-stone-100 py-5">
      <FilterLegend>{handle.props.group.label}</FilterLegend>
      <div class="clear-both space-y-0.5">
        {handle.props.group.options.map((option) => (
          <FilterCheckbox
            key={option.value}
            group={handle.props.group}
            option={option}
          />
        ))}
      </div>
    </fieldset>
  );
}

interface FilterCheckboxProps {
  group: FilterGroup;
  option: FilterOption;
}

function FilterCheckbox(handle: Handle<FilterCheckboxProps>) {
  const context = handle.context.get(catalog.Context);

  return () => {
    const { group, option } = handle.props;
    const checked = context.state.filters[group.key].includes(option.value);
    const unavailable = option.count === 0 && !checked;

    return (
      <label
        class={cn(
          "group flex cursor-pointer items-center gap-3 rounded-md py-1.5 text-[13px] transition-colors",
          unavailable
            ? "text-stone-400"
            : "text-stone-600 hover:text-emerald-800",
        )}
      >
        <Checkbox
          name={group.key}
          value={option.value}
          checked={checked}
          disabled={unavailable}
          onCheckedChange={() => context.toggleFilter(group.key, option.value)}
        />
        <span class="flex-1">{option.label}</span>
        <span
          class={cn(
            "text-xs tabular-nums",
            checked ? "text-emerald-700" : "text-stone-400",
          )}
        >
          {option.count}
        </span>
      </label>
    );
  };
}
