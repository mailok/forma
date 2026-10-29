import type { Handle, RemixNode } from "remix/component";
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
  children?: RemixNode;
}

export function Container(handle: Handle<Props>) {
  return () => (
    <div
      class={cn("mx-auto max-w-360 px-5 sm:px-8 lg:px-12", handle.props.class)}
    >
      {handle.props.children}
    </div>
  );
}
