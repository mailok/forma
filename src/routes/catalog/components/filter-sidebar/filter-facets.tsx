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
          class="border-t border-line py-7 text-[13px] text-stone-400"
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
    <fieldset class="border-t border-line py-7">
      <FilterLegend>{handle.props.group.label}</FilterLegend>
      <div class="clear-both space-y-1">
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
          "group flex cursor-pointer items-center gap-3 py-1.5 text-sm transition-colors",
          checkboxLabelStyles[checkboxState({ checked, unavailable })],
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
        <span class="text-xs text-stone-400 tabular-nums">{option.count}</span>
      </label>
    );
  };
}

type CheckboxState = "checked" | "available" | "unavailable";

const checkboxLabelStyles: Record<CheckboxState, string> = {
  checked: "font-medium text-ink",
  available: "text-stone-600 hover:text-ink",
  unavailable: "cursor-not-allowed text-stone-400",
};

interface CheckboxStateInput {
  checked: boolean;
  unavailable: boolean;
}

function checkboxState({
  checked,
  unavailable,
}: CheckboxStateInput): CheckboxState {
  if (checked) return "checked";
  return unavailable ? "unavailable" : "available";
}
