import type { Handle, RemixNode } from "remix/component";

interface Props {
  children?: RemixNode;
}

export function PageShell(handle: Handle<Props>) {
  return () => (
    <div class="min-h-screen bg-canvas font-sans text-stone-700 antialiased selection:bg-forest-soft selection:text-ink">
      {handle.props.children}
    </div>
  );
}
