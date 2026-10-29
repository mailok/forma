import type { Handle } from "remix/component";
import { StockStatus } from "@/components/product/stock-status";

interface Props {
  stock: number;
  sku: string;
}

export function ProductAvailability(handle: Handle<Props>) {
  return () => (
    <div class="mt-4 flex items-center justify-between border-t border-line pt-3.5">
      <StockStatus stock={handle.props.stock} />
      <span class="text-[10px] tracking-[0.12em] text-stone-400">
        {handle.props.sku}
      </span>
    </div>
  );
}
