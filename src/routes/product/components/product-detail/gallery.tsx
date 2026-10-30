import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import { productImageTransitionName } from "@/lib/view-transitions";
import { ProductBadgeTag } from "@/components/product/product-badge-tag";
import type { Product } from "@/db/types";

interface Props {
  product: Product;
}

export function Gallery(handle: Handle<Props>) {
  return () => {
    const { product } = handle.props;

    return (
      <div
        class="relative aspect-4/5 overflow-hidden rounded-[36px] bg-stone-200/60"
        style={{ viewTransitionName: productImageTransitionName(product.slug) }}
      >
        <img
          src={product.image}
          alt={product.imageAlt}
          width="720"
          height="600"
          loading="eager"
          class={cn(
            "size-full object-cover",
            product.stock === 0 && "opacity-80 grayscale-[0.6]",
          )}
        />
        {product.badge ? (
          <ProductBadgeTag
            badge={product.badge}
            class="absolute top-5 left-5"
          />
        ) : null}
      </div>
    );
  };
}
