import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";
import { ProductCard } from "@/routes/catalog/components/product-card/product-card";

const layouts: Record<ProductView, string> = {
  grid: "gap-5 min-[560px]:grid-cols-2 xl:grid-cols-3",
  list: "gap-4",
};

interface Props {
  products: ProductSummary[];
  view: ProductView;
}

export function ProductList(handle: Handle<Props>) {
  return () => (
    <div class={cn("grid grid-cols-1", layouts[handle.props.view])}>
      {handle.props.products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          view={handle.props.view}
          priority={index < 3}
        />
      ))}
    </div>
  );
}
