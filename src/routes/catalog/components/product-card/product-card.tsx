import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";
import { ProductMedia } from "./product-media";
import { ProductDetails } from "./product-details";

interface Props {
  product: ProductSummary;
  view: ProductView;
  priority?: boolean;
}

export function ProductCard(handle: Handle<Props>) {
  return () => (
    <article
      data-product-id={handle.props.product.id}
      class={cn(
        "group overflow-hidden rounded-xl border border-stone-200/80 bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-stone-200/50",
        handle.props.view === "list" &&
          "grid grid-cols-[110px_1fr] sm:grid-cols-[180px_1fr]",
      )}
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
