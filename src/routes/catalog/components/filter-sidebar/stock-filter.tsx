import type { Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Switch } from "@/components/ui/switch";

export function StockFilter(handle: Handle) {
  const { search } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["filterschange"]);

  return () => (
    <div class="border-t border-line pt-7">
      <label class="flex cursor-pointer items-center justify-between gap-3 text-sm text-stone-600">
        In stock only
        <Switch
          name="inStock"
          checked={search.filters.inStock}
          onCheckedChange={(checked) => search.setInStock(checked)}
        />
      </label>
    </div>
  );
}
