import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

export function Skeleton(handle: Handle<Props>) {
  return () => (
    <div
      aria-hidden="true"
      class={cn(
        "rounded-lg bg-stone-200/70 motion-safe:animate-pulse",
        handle.props.class,
      )}
    />
  );
}
