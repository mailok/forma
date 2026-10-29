import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";

const paths = {
  search: "m21 21-4.5-4.5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  chevron: "m6 9 6 6 6-6",
  selector: "m7 15 5 5 5-5M7 9l5-5 5 5",
  sliders: "M4 7h9m4 0h3M4 17h3m4 0h9M13 4v6M7 14v6",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  list: "M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z",
  info: "M12 11v6m0-10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  spinner: "M21 12a9 9 0 1 1-6.2-8.6",
} as const;

export type IconName = keyof typeof paths;

interface IconProps {
  name: IconName;
  class?: string;
  filled?: boolean;
}

export function Icon(handle: Handle<IconProps>) {
  return () => (
    <svg
      viewBox="0 0 24 24"
      fill={handle.props.filled ? "currentColor" : "none"}
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={cn("size-5", handle.props.class)}
      aria-hidden="true"
    >
      <path d={paths[handle.props.name]} />
    </svg>
  );
}

interface BrandMarkProps {
  class?: string;
}

export function BrandMark(handle: Handle<BrandMarkProps>) {
  return () => (
    <svg
      viewBox="0 0 36 36"
      fill="currentColor"
      class={cn("size-8 text-ink", handle.props.class)}
      aria-hidden="true"
    >
      <path d="M4 4h12v12H4zM20 4h12v12H20zM4 20h12v12H4z" />
      <circle cx="26" cy="26" r="6" />
    </svg>
  );
}
