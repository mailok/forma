import type { Handle } from "remix/component";
import * as select from "@remix-run/ui/select";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { SelectVariant } from "./types";

const variants: Record<SelectVariant, string> = {
  default:
    "h-11 rounded-xl border-line bg-paper px-3.5 text-sm hover:border-stone-300 aria-expanded:border-ink/30 aria-expanded:ring-4 aria-expanded:ring-ink/5",
  subtle:
    "h-9 rounded-full border-transparent px-3.5 text-[13px] hover:bg-ink/5 aria-expanded:bg-ink/5",
};

interface Props {
  id: string;
  label: string;
  variant: SelectVariant;
}

export function SelectTrigger(handle: Handle<Props>) {
  const context = handle.context.get(select.Context);

  return () => (
    <button
      type="button"
      id={handle.props.id}
      aria-label={handle.props.label}
      class={cn(
        "group/select flex w-full items-center gap-2 border font-medium text-ink transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:border-ink/40 focus-visible:ring-4 focus-visible:ring-forest/15 disabled:cursor-not-allowed disabled:opacity-50",
        variants[handle.props.variant],
      )}
      mix={select.trigger()}
    >
      <span class="min-w-0 flex-1 truncate text-left">
        {context.displayedLabel}
      </span>
      <Icon
        name="selector"
        class="size-3.5 shrink-0 text-stone-400 transition-colors group-hover/select:text-ink"
      />
    </button>
  );
}
