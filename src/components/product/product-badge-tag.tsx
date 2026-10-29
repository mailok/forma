import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/db/types";

interface BadgeStyle {
  label: string;
  class: string;
}

const badges: Record<ProductBadge, BadgeStyle> = {
  new: { label: "New arrival", class: "bg-paper/90 text-ink" },
  favorite: { label: "House favorite", class: "bg-clay/90 text-paper" },
};

interface Props {
  badge: ProductBadge;
  class?: string;
}

export function ProductBadgeTag(handle: Handle<Props>) {
  return () => {
    const badge = badges[handle.props.badge];

    return (
      <span
        class={cn(
          "rounded-full px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap uppercase backdrop-blur-md",
          badge.class,
          handle.props.class,
        )}
      >
        {badge.label}
      </span>
    );
  };
}
