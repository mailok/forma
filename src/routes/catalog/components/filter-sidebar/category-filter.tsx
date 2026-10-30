import type { Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Select } from "@/components/ui/select/select";
import type { SelectOption } from "@/components/ui/select/types";
import type { Category, CategoryId } from "@/db/types";
import { FilterLabel } from "./filter-label";

export function CategoryFilter(handle: Handle) {
  const { categories, search } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["categorychange"]);

  return () => (
    <>
      <FilterLabel for="category-select">Category</FilterLabel>
      <Select
        id="category-select"
        name="category"
        label="Category"
        value={search.filters.category}
        class="mb-7"
        options={categories.map(toCategoryOption)}
        onValueChange={(value) => search.selectCategory(value as CategoryId)}
      />
    </>
  );
}

function toCategoryOption(category: Category): SelectOption {
  return {
    value: category.id,
    label: category.label,
    description: category.description,
    meta: String(category.count),
  };
}
