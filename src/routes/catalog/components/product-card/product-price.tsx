import type { Handle } from "remix/component";
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
    <div class="flex items-baseline gap-2">
      <span class="text-[17px] font-semibold tracking-tight text-ink">
        {currency.format(handle.props.price)}
      </span>
      {handle.props.originalPrice ? (
        <span class="text-xs text-stone-400 line-through">
          {currency.format(handle.props.originalPrice)}
        </span>
      ) : null}
      <span class="text-[9px] text-stone-400">{handle.props.currency}</span>
    </div>
  );
}
