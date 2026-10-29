import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/db/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface Props {
  price: number;
  originalPrice: number | null;
  currency: ProductSummary["currency"];
}

export function ProductPrice(handle: Handle<Props>) {
  return () => (
    <div class="flex items-baseline gap-2 tabular-nums">
      <span
        class={cn(
          "text-base font-medium",
          handle.props.originalPrice ? "text-clay" : "text-ink",
        )}
      >
        {currency.format(handle.props.price)}
      </span>
      {handle.props.originalPrice ? (
        <span class="text-[13px] text-stone-400 line-through decoration-stone-400/70">
          {currency.format(handle.props.originalPrice)}
        </span>
      ) : null}
      <span class="text-[10px] tracking-wider text-stone-400">
        {handle.props.currency}
      </span>
    </div>
  );
}
