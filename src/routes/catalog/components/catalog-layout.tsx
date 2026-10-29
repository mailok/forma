import type { Handle, RemixNode } from "remix/component";
import { Container } from "@/components/layout/container";

interface Props {
  hero: RemixNode;
  navigation: RemixNode;
  sidebar: RemixNode;
  children?: RemixNode;
}

export function CatalogLayout(handle: Handle<Props>) {
  return () => (
    <main>
      <Container>
        <div class="mt-8 sm:mt-10">{handle.props.hero}</div>
        <div id="catalog" class="my-7 scroll-mt-6">
          {handle.props.navigation}
        </div>
        <div class="grid items-start gap-6 lg:grid-cols-[236px_minmax(0,1fr)] xl:gap-8">
          {handle.props.sidebar}
          {handle.props.children}
        </div>
      </Container>
    </main>
  );
}
