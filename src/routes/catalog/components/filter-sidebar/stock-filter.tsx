import type { Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Switch } from "@/components/ui/switch";

export function StockFilter(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => (
    <div class="border-t border-stone-100 pt-5">
      <label class="flex cursor-pointer items-center justify-between gap-2 text-[13px] text-stone-600">
        In stock only
        <Switch
          name="inStock"
          checked={context.state.filters.inStock}
          onCheckedChange={(checked) => context.setInStock(checked)}
        />
      </label>
    </div>
  );
}
