import type { Handle } from "remix/component";
import { PageShell } from "@/components/layout/page-shell";
import { SkipLink } from "@/components/skip-link";
import * as query from "@/integrations/tanstack-query/query-client";
import { ProductHeader } from "./components/product-header";
import { ProductDetail } from "./components/product-detail";

interface Props {
  slug: string;
}

export default function ProductPage(handle: Handle<Props>) {
  return () => (
    <query.Context>
      <PageShell>
        <SkipLink href="#product">Skip to product</SkipLink>
        <ProductHeader />
        <ProductDetail slug={handle.props.slug} />
      </PageShell>
    </query.Context>
  );
}
