import type { Handle, HostProps, Props as ElementProps } from "remix/component";
import { cn } from "@/lib/utils";

const variants = {
  primary: "rounded-full border-transparent bg-ink text-paper hover:bg-forest",
  outline:
    "rounded-full border-line bg-paper text-ink hover:border-ink/30 hover:bg-white",
  ghost:
    "rounded-full border-transparent bg-transparent text-stone-500 hover:bg-ink/5 hover:text-ink aria-pressed:bg-paper aria-pressed:text-ink aria-pressed:shadow-xs aria-pressed:shadow-stone-900/10",
  link: "rounded border-transparent bg-transparent text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest",
} as const;

const sizes = {
  default: "h-10 px-5 text-[13px]",
  sm: "h-9 px-4 text-[13px]",
  lg: "h-12 px-7 text-sm",
  compact: "p-0 text-[13px]",
  icon: "size-9 p-0",
  "icon-sm": "size-8 p-0",
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
          "inline-flex shrink-0 items-center gap-2 border font-medium transition-colors focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
