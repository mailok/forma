import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductBadge, ProductSummary } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";

interface BadgeStyle {
  label: string;
  class: string;
}

const badges: Record<ProductBadge, BadgeStyle> = {
  new: { label: "New arrival", class: "bg-paper/90 text-ink" },
  favorite: { label: "House favorite", class: "bg-clay/90 text-paper" },
};

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
        {product.badge ? <MediaBadge badge={product.badge} /> : null}
        {soldOut && view === "grid" ? <SoldOutTag /> : null}
      </div>
    );
  };
}

interface MediaBadgeProps {
  badge: ProductBadge;
}

function MediaBadge(handle: Handle<MediaBadgeProps>) {
  return () => {
    const badge = badges[handle.props.badge];

    return (
      <span
        class={cn(
          "absolute top-3 left-3 rounded-full px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap uppercase backdrop-blur-md",
          badge.class,
        )}
      >
        {badge.label}
      </span>
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
