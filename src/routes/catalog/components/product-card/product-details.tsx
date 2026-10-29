import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";
import { ProductMetadata } from "./product-metadata";
import { ProductPrice } from "./product-price";
import { ProductColors } from "./product-colors";
import { ProductAvailability } from "./product-availability";

interface Props {
  product: ProductSummary;
  view: ProductView;
}

export function ProductDetails(handle: Handle<Props>) {
  return () => {
    const { product, view } = handle.props;

    return (
      <div
        class={cn(
          "flex flex-col p-4",
          view === "list" && "justify-center sm:px-6",
        )}
      >
        <ProductMetadata
          brand={product.brand}
          rating={product.rating}
          reviews={product.reviews}
        />
        <h3 class="text-[17px] font-semibold tracking-[-0.025em] text-ink">
          {product.name}
        </h3>
        <p class="mt-1 truncate text-xs text-stone-500">{product.title}</p>
        <div class="mt-4 flex items-center justify-between gap-2">
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
