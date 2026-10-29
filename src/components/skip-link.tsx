import type { Handle, RemixNode } from "remix/component";

interface Props {
  href: string;
  children?: RemixNode;
}

export function SkipLink(handle: Handle<Props>) {
  return () => (
    <a
      href={handle.props.href}
      data-astro-history="replace"
      class="sr-only rounded-full bg-ink px-5 py-2.5 text-sm text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      {handle.props.children}
    </a>
  );
}
