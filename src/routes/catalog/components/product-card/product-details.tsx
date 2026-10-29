import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";
import { ProductMetadata } from "./product-metadata";
import { ProductPrice } from "./product-price";
import { ProductColors } from "./product-colors";
import { ProductAvailability } from "./product-availability";

const detailsLayouts: Record<ProductView, string> = {
  grid: "px-1 pt-5",
  list: "min-w-0 py-2 pr-3 sm:pr-6",
};

interface Props {
  product: ProductSummary;
  view: ProductView;
}

export function ProductDetails(handle: Handle<Props>) {
  return () => {
    const { product, view } = handle.props;

    return (
      <div class={cn("flex flex-col", detailsLayouts[view])}>
        <ProductMetadata
          brand={product.brand}
          rating={product.rating}
          reviews={product.reviews}
        />
        <h3 class="mt-2 text-lg leading-tight font-semibold tracking-[-0.015em] text-ink">
          {product.name}
        </h3>
        <p class="mt-1.5 truncate text-[13px] text-stone-500">
          {product.title}
        </p>
        <div class="mt-5 flex items-center justify-between gap-3">
          <ProductPrice
            price={product.price}
            originalPrice={product.originalPrice}
            currency={product.currency}
          />
          <ProductColors colors={product.colors} />
        </div>
        <ProductAvailability stock={product.stock} sku={product.sku} />
      </div>
    );
  };
}
