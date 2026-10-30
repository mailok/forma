import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Button } from "@/components/ui/button";

export function FilterSidebarHeader(handle: Handle) {
  const { search } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["filterschange"]);

  return () => (
    <div class="mb-7 flex items-baseline justify-between gap-2.5">
      <h2 class="text-[17px] font-semibold tracking-[-0.01em] text-ink">
        Refine
      </h2>
      {search.activeFilterCount > 0 ? (
        <Button
          variant="link"
          size="compact"
          mix={on("click", () => search.resetFilters())}
        >
          Clear all
        </Button>
      ) : null}
    </div>
  );
}
