import type { Handle, RemixNode } from "remix/component";

interface Props {
  children?: RemixNode;
}

export function PageShell(handle: Handle<Props>) {
  return () => (
    <div class="min-h-screen bg-canvas font-sans text-stone-700 antialiased selection:bg-[#dce9d4] selection:text-ink">
      {handle.props.children}
    </div>
  );
}
