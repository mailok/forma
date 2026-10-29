import type { Handle } from "remix/component";
import type { Category, SearchProductsResult } from "@/db/types";
import { PageShell } from "@/components/layout/page-shell";
import { SkipLink } from "@/components/skip-link";
import * as query from "@/integrations/tanstack-query/query-client";
import * as catalog from "./components/catalog";
import { CatalogLayout } from "./components/catalog-layout";
import { CatalogHeader } from "./components/catalog-header";
import { CatalogHero } from "./components/catalog-hero";
import { CategoryTabs } from "./components/category-tabs";
import { FilterSidebar } from "./components/filter-sidebar/filter-sidebar";
import { CatalogResults } from "./components/catalog-results/catalog-results";
import { DemoFooter } from "./components/demo-footer";

interface Props {
  initialSearchResults: SearchProductsResult;
  categories: Category[];
}

export default function CatalogPage(handle: Handle<Props>) {
  return () => (
    <query.Context>
      <catalog.Context
        initialSearchResults={handle.props.initialSearchResults}
        categories={handle.props.categories}
      >
        <PageShell>
          <SkipLink href="#catalog">Skip to catalog</SkipLink>
          <CatalogHeader />
          <CatalogLayout
            hero={
              <CatalogHero total={countProducts(handle.props.categories)} />
            }
            navigation={<CategoryTabs />}
            sidebar={<FilterSidebar />}
          >
            <CatalogResults />
          </CatalogLayout>
          <DemoFooter />
        </PageShell>
      </catalog.Context>
    </query.Context>
  );
}

function countProducts(categories: Category[]): number {
  return categories.find((category) => category.id === "all")?.count ?? 0;
}
