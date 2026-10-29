import type { Handle, RemixNode } from "remix/component";

interface Props {
  href: string;
  children?: RemixNode;
}

export function SkipLink(handle: Handle<Props>) {
  return () => (
    <a
      href={handle.props.href}
      class="sr-only rounded-lg bg-emerald-900 p-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      {handle.props.children}
    </a>
  );
}
