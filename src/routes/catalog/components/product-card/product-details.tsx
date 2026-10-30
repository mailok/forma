import type { Handle, RemixNode } from "remix/component";
import { cn } from "@/lib/utils";
import { paths } from "@/lib/paths";
import { Icon } from "@/components/icon";
import { ProductMetadata } from "@/components/product/product-metadata";
import { ProductPrice } from "@/components/product/product-price";
import { ProductColors } from "@/components/product/product-colors";
import type { ProductSummary } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";
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
          <ProductLink slug={product.slug}>{product.name}</ProductLink>
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

interface ProductLinkProps {
  slug: string;
  children?: RemixNode;
}

// The link's overlay covers the whole card, which must be its positioned ancestor.
function ProductLink(handle: Handle<ProductLinkProps>) {
  return () => (
    <a
      href={paths.product(handle.props.slug)}
      class="inline-flex items-center gap-2 group-data-pending:cursor-progress after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-forest/40 focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-canvas"
    >
      {handle.props.children}
      <Icon
        name="spinner"
        class="hidden size-4 shrink-0 text-forest group-data-pending:block motion-safe:animate-spin"
      />
    </a>
  );
}
