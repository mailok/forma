import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";
import { ProductMedia } from "./product-media";
import { ProductDetails } from "./product-details";

const layouts: Record<ProductView, string> = {
  grid: "flex flex-col",
  list: "grid grid-cols-[112px_1fr] items-center gap-5 rounded-[28px] bg-paper p-3 transition-shadow duration-300 hover:shadow-xl hover:shadow-stone-900/5 sm:grid-cols-[200px_1fr] sm:gap-8",
};

interface Props {
  product: ProductSummary;
  view: ProductView;
  priority?: boolean;
}

export function ProductCard(handle: Handle<Props>) {
  return () => (
    <article
      data-product-id={handle.props.product.id}
      class={cn("group relative", layouts[handle.props.view])}
    >
      <ProductMedia
        product={handle.props.product}
        view={handle.props.view}
        priority={handle.props.priority}
      />
      <ProductDetails product={handle.props.product} view={handle.props.view} />
    </article>
  );
}
