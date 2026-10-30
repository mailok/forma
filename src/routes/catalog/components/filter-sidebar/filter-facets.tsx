import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import * as catalog from "@/routes/catalog/components/catalog";
import { Checkbox } from "@/components/ui/checkbox";
import type { FilterGroup, FilterOption } from "@/db/types";
import { FilterLegend } from "./filter-label";

export function FilterFacets(handle: Handle) {
  const { search } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["filterschange", "resultschange", "errorchange"]);

  return () => {
    const { filters, searchResults } = search;

    if (!search.facetsMatchCategory) {
      return (
        <p
          role="status"
          class="border-t border-line py-7 text-[13px] text-stone-400"
        >
          {search.error ? "Retry to load the filters." : "Preparing filters…"}
        </p>
      );
    }

    return (
      <>
        {searchResults.facets.map((group) => (
          <FilterSection
            key={`${searchResults.filters.category}-${group.key}`}
            group={group}
            selectedValues={filters[group.key]}
            onToggle={(value) => search.toggleFilter(group.key, value)}
          />
        ))}
      </>
    );
  };
}

interface FilterSectionProps {
  group: FilterGroup;
  selectedValues: string[];
  onToggle(value: string): void;
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
            checked={handle.props.selectedValues.includes(option.value)}
            onToggle={() => handle.props.onToggle(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}

interface FilterCheckboxProps {
  group: FilterGroup;
  option: FilterOption;
  checked: boolean;
  onToggle(): void;
}

function FilterCheckbox(handle: Handle<FilterCheckboxProps>) {
  return () => {
    const { group, option, checked } = handle.props;
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
          onCheckedChange={() => handle.props.onToggle()}
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
  if (checked) {
    return "checked";
  }
  return unavailable ? "unavailable" : "available";
}
