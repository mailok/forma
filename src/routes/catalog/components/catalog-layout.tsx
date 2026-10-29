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
        <div class="pt-10 sm:pt-12">{handle.props.hero}</div>
        <div id="catalog" class="mt-14 mb-10 scroll-mt-20 sm:mt-16">
          {handle.props.navigation}
        </div>
        <div class="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:gap-14">
          {handle.props.sidebar}
          {handle.props.children}
        </div>
      </Container>
    </main>
  );
}
