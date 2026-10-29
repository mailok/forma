import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";

const paths = {
  search: "m21 21-4.5-4.5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  chevron: "m6 9 6 6 6-6",
  sliders: "M4 7h9m4 0h3M4 17h3m4 0h9M13 4v6M7 14v6",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  list: "M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01",
  box: "m12 3 9 5v8l-9 5-9-5V8l9-5Zm0 9 9-4m-9 4L3 8m9 4v9M7.5 5.5l9 5",
  leaf: "M20 4c-9-1-16 3-16 9a7 7 0 0 0 7 7c6 0 10-7 9-16ZM5 19 16 8",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z",
  headphones: "M4 14v-3a8 8 0 0 1 16 0v3M4 13H3v7h5v-7H4Zm16 0h1v7h-5v-7h4Z",
  shirt: "m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0Z",
  home: "m3 10 9-7 9 7v11H3V10Zm6 11v-8h6v8",
  mountain: "m3 20 7-14 4 7 3-5 6 12H3Zm4-8 3 2 2-3",
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
      class={cn("size-8 text-emerald-800", handle.props.class)}
      aria-hidden="true"
    >
      <path d="M4 4h12v12H4zM20 4h12v12H20zM4 20h12v12H4z" />
      <circle cx="26" cy="26" r="6" />
    </svg>
  );
}
