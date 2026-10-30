import type { Handle, RemixNode } from "remix/component";
import { Container } from "@/components/layout/container";

interface Props {
  breadcrumbs: RemixNode;
  media: RemixNode;
  children?: RemixNode;
  busy?: boolean;
}

export function Layout(handle: Handle<Props>) {
  return () => (
    <main
      id="product"
      class="scroll-mt-20"
      aria-labelledby="product-heading"
      aria-busy={handle.props.busy}
    >
      <Container class="pt-8 pb-24 sm:pt-10 lg:pb-32">
        {handle.props.breadcrumbs}
        <div class="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:gap-20">
          {handle.props.media}
          <div class="flex flex-col gap-12 lg:pt-4">
            {handle.props.children}
          </div>
        </div>
      </Container>
    </main>
  );
}
