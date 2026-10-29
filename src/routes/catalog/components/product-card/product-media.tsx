import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import { productImageTransitionName } from "@/lib/view-transitions";
import { ProductBadgeTag } from "@/components/product/product-badge-tag";
import type { ProductSummary } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";

const mediaShapes: Record<ProductView, string> = {
  grid: "aspect-4/5 rounded-[28px]",
  list: "aspect-square rounded-[20px]",
};

interface ProductMediaProps {
  product: ProductSummary;
  view: ProductView;
  priority?: boolean;
}

export function ProductMedia(handle: Handle<ProductMediaProps>) {
  return () => {
    const { product, view, priority } = handle.props;
    const soldOut = product.stock === 0;

    return (
      <div
        class={cn(
          "relative overflow-hidden bg-stone-200/60",
          mediaShapes[view],
        )}
        style={{ viewTransitionName: productImageTransitionName(product.slug) }}
      >
        <img
          src={product.image}
          alt={product.imageAlt}
          width="720"
          height="600"
          loading={priority ? "eager" : "lazy"}
          class={cn(
            "size-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]",
            soldOut && "opacity-80 grayscale-[0.6]",
          )}
        />
        {product.badge ? (
          <ProductBadgeTag
            badge={product.badge}
            class="absolute top-3 left-3"
          />
        ) : null}
        {soldOut && view === "grid" ? <SoldOutTag /> : null}
      </div>
    );
  };
}

function SoldOutTag() {
  return () => (
    <span class="absolute inset-x-4 bottom-4 rounded-full bg-paper/90 py-2 text-center text-xs text-stone-600 backdrop-blur-md">
      Temporarily sold out
    </span>
  );
}
