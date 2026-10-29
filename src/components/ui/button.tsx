import type { Handle, HostProps, Props as ElementProps } from "remix/component";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "rounded-lg border-transparent bg-emerald-900 text-white hover:bg-emerald-800",
  outline:
    "rounded-lg border-stone-200 bg-white text-ink hover:border-emerald-800 hover:bg-[#f0f4ed]",
  ghost:
    "rounded-lg border-transparent bg-transparent text-stone-500 hover:bg-stone-100 hover:text-ink aria-pressed:bg-[#e6ede6] aria-pressed:text-emerald-900",
  link: "rounded border-transparent bg-transparent text-emerald-800 underline-offset-4 hover:underline",
  chip: "rounded-md border-[#dce7df] bg-[#eef4ef] text-[#426b53] hover:bg-[#dceadf]",
  pill: "rounded-full border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-ink aria-pressed:border-emerald-900 aria-pressed:bg-emerald-900 aria-pressed:text-white",
} as const;

const sizes = {
  default: "h-10 px-4 text-xs",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-6 text-sm",
  field: "h-11 px-3 text-[13px]",
  compact: "p-0 text-xs",
  chip: "px-2.5 py-1.5 text-[11px]",
  icon: "size-8 p-0",
  "icon-sm": "size-7 p-0",
} as const;

const alignments = {
  center: "justify-center",
  start: "justify-start",
  between: "justify-between",
} as const;

interface Props extends Omit<ElementProps<"button">, "class" | "mix"> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  align?: keyof typeof alignments;
  class?: string;
  mix?: HostProps<HTMLButtonElement>["mix"];
}

export function Button(handle: Handle<Props>) {
  return () => {
    const {
      variant = "primary",
      size = "default",
      align = "center",
      class: className = "",
      children,
      ...attributes
    } = handle.props;

    return (
      <button
        {...attributes}
        type={attributes.type ?? "button"}
        class={cn(
          "inline-flex shrink-0 items-center gap-2 border font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          alignments[align],
          variants[variant],
          sizes[size],
          className,
        )}
      >
        {children}
      </button>
    );
  };
}
