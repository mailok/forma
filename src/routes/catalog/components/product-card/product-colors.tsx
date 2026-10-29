import type { Handle } from "remix/component";

interface Props {
  colors: string[];
}

export function ProductColors(handle: Handle<Props>) {
  return () => (
    <span
      class="flex -space-x-0.5"
      aria-label={`${handle.props.colors.length} available colors`}
    >
      {handle.props.colors.map((color) => (
        <span
          key={color}
          class="size-3 rounded-full border-2 border-white ring-1 ring-stone-200/80"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}
