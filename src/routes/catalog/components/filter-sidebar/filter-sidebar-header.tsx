import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

export function FilterSidebarHeader(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => (
    <div class="mb-6 flex items-center gap-2.5">
      <Icon name="sliders" class="size-4.5 text-stone-500" />
      <h2 class="flex-1 text-[15px] font-semibold text-ink">Your selection</h2>
      {catalog.activeFilterCount(context) > 0 ? (
        <Button
          variant="link"
          size="compact"
          mix={on("click", () => context.reset())}
        >
          Clear
        </Button>
      ) : (
        <span class="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
          Filters
        </span>
      )}
    </div>
  );
}
