import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/db/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type PriceSize = "default" | "large";

interface PriceSizeStyle {
  price: string;
  originalPrice: string;
}

const priceSizes: Record<PriceSize, PriceSizeStyle> = {
  default: { price: "text-base", originalPrice: "text-[13px]" },
  large: { price: "text-3xl", originalPrice: "text-base" },
};

interface Props {
  price: number;
  originalPrice: number | null;
  currency: ProductSummary["currency"];
  size?: PriceSize;
}

export function ProductPrice(handle: Handle<Props>) {
  return () => {
    const sizes = priceSizes[handle.props.size ?? "default"];

    return (
      <div class="flex items-baseline gap-2 tabular-nums">
        <span
          class={cn(
            "font-medium",
            sizes.price,
            handle.props.originalPrice ? "text-clay" : "text-ink",
          )}
        >
          {currency.format(handle.props.price)}
        </span>
        {handle.props.originalPrice ? (
          <span
            class={cn(
              "text-stone-400 line-through decoration-stone-400/70",
              sizes.originalPrice,
            )}
          >
            {currency.format(handle.props.originalPrice)}
          </span>
        ) : null}
        <span class="text-[10px] tracking-wider text-stone-400">
          {handle.props.currency}
        </span>
      </div>
    );
  };
}
