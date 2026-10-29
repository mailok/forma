import type { Handle } from "remix/component";

interface Props {
  colors: string[];
}

export function ProductColors(handle: Handle<Props>) {
  return () => (
    <span
      class="flex gap-1.5"
      aria-label={`${handle.props.colors.length} available colors`}
    >
      {handle.props.colors.map((color) => (
        <span
          key={color}
          class="size-3.5 rounded-full shadow-[inset_0_0_0_1px_rgb(27_36_32/0.14)]"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}
