import type { Handle } from "remix/component";
import { Icon } from "@/components/icon";

interface Props {
  brand: string;
  rating: number;
  reviews: number;
}

export function ProductMetadata(handle: Handle<Props>) {
  return () => (
    <div class="flex items-center justify-between gap-2">
      <span class="text-[11px] font-medium tracking-[0.18em] text-stone-500 uppercase">
        {handle.props.brand}
      </span>
      <span class="flex items-center gap-1 text-xs text-stone-600 tabular-nums">
        <Icon name="star" filled class="size-3 text-clay" />
        {handle.props.rating.toFixed(1)}
        <span class="text-stone-400">({handle.props.reviews})</span>
      </span>
    </div>
  );
}
