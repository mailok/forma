import type { Handle, RemixNode } from "remix/component";
import { cn } from "@/lib/utils";

const labelClass =
  "text-[11px] font-medium tracking-[0.18em] text-stone-500 uppercase";

interface FilterLabelProps {
  for: string;
  children?: RemixNode;
}

export function FilterLabel(handle: Handle<FilterLabelProps>) {
  return () => (
    <label for={handle.props.for} class={cn("mb-3 block", labelClass)}>
      {handle.props.children}
    </label>
  );
}

interface FilterLegendProps {
  children?: RemixNode;
}

export function FilterLegend(handle: Handle<FilterLegendProps>) {
  return () => (
    <legend class={cn("float-left mb-4 w-full", labelClass)}>
      {handle.props.children}
    </legend>
  );
}
