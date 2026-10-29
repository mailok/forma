import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductBadge, ProductSummary } from "@/db/types";
import type { ProductView } from "@/routes/catalog/types";

interface BadgeStyle {
  label: string;
  class: string;
}

const badges: Record<ProductBadge, BadgeStyle> = {
  new: { label: "New arrival", class: "bg-white/90 text-ink" },
  favorite: {
    label: "House favorite",
    class: "bg-[#e4eedf]/95 text-[#4c6541]",
  },
};

interface ProductMediaProps {
  product: ProductSummary;
  view: ProductView;
  priority?: boolean;
}

export function ProductMedia(handle: Handle<ProductMediaProps>) {
  return () => {
    const { product, view, priority } = handle.props;

    return (
      <div
        class={cn(
          "relative overflow-hidden bg-[#eeefeb]",
          view === "list" ? "h-full min-h-40" : "aspect-[1.28]",
        )}
      >
        <img
          src={product.image}
          alt={product.imageAlt}
          width="720"
          height="600"
          loading={priority ? "eager" : "lazy"}
          class="size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
        />
        {product.badge ? <MediaBadge badge={product.badge} /> : null}
        {product.stock === 0 ? <SoldOutTag /> : null}
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
          "absolute top-3 left-3 rounded px-2 py-1 text-[9px] font-bold tracking-[0.07em] uppercase backdrop-blur-sm",
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
    <span class="absolute right-3 bottom-3 rounded bg-white/95 px-2 py-1 text-[10px] text-stone-500">
      Temporarily sold out
    </span>
  );
}
