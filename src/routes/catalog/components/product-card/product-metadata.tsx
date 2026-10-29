import type { Handle } from "remix/component";
import { Icon } from "@/components/icon";

interface Props {
  brand: string;
  rating: number;
  reviews: number;
}

export function ProductMetadata(handle: Handle<Props>) {
  return () => (
    <div class="mb-2 flex items-center justify-between gap-2">
      <span class="text-[9px] font-bold tracking-[0.17em] text-stone-400 uppercase">
        {handle.props.brand}
      </span>
      <span class="flex items-center gap-1 text-[11px] text-stone-500 tabular-nums">
        <Icon name="star" filled class="size-3 text-[#b79355]" />
        {handle.props.rating.toFixed(1)}
        <span class="text-stone-400">({handle.props.reviews})</span>
      </span>
    </div>
  );
}
