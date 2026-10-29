import { on, type Handle, type RemixNode } from "remix/component";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface Props {
  removeLabel: string;
  onRemove(): void;
  children?: RemixNode;
  class?: string;
}

export function RemovableBadge(handle: Handle<Props>) {
  return () => (
    <button
      type="button"
      aria-label={handle.props.removeLabel}
      class={cn(
        "group/badge inline-flex h-8 max-w-full items-center gap-1.5 rounded-full border border-line bg-paper pr-1 pl-3.5 text-[13px] text-ink transition-colors hover:border-ink/30 focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none",
        handle.props.class,
      )}
      mix={on("click", () => handle.props.onRemove())}
    >
      <span class="min-w-0 truncate">{handle.props.children}</span>
      <span class="flex size-6 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors group-hover/badge:bg-ink group-hover/badge:text-paper">
        <Icon name="close" class="size-3" />
      </span>
    </button>
  );
}
