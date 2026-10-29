import type { Handle } from "remix/component";
import * as select from "@remix-run/ui/select";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import type { SelectVariant } from "./types";

interface Props {
  id: string;
  label: string;
  variant: SelectVariant;
}

export function SelectTrigger(handle: Handle<Props>) {
  const context = handle.context.get(select.Context);

  return () => (
    <Button
      id={handle.props.id}
      aria-label={handle.props.label}
      variant={handle.props.variant === "subtle" ? "ghost" : "outline"}
      size={handle.props.variant === "subtle" ? "sm" : "field"}
      align="between"
      class="group/select w-full"
      mix={select.trigger()}
    >
      <span class="min-w-0 flex-1 truncate text-left">
        {context.displayedLabel}
      </span>
      <Icon
        name="chevron"
        class="size-3.5 shrink-0 text-stone-400 transition-transform group-aria-expanded/select:rotate-180"
      />
    </Button>
  );
}
