import type { Handle } from "remix/component";
import { createQuery } from "@/integrations/tanstack-query/create-query";
import { productQueries } from "@/routes/product/queries";
import { ProductLayout } from "./product-layout";
import { ProductBreadcrumbs } from "./product-breadcrumbs";
import { ProductGallery } from "./product-gallery";
import { ProductSummary } from "./product-summary";
import { ProductSpecifications } from "./product-specifications";
import { ProductDetailSkeleton } from "./product-detail-skeleton";
import { ProductLoadError } from "./product-load-error";
import { ProductNotFound } from "./product-not-found";

interface Props {
  slug: string;
}

export function ProductDetail(handle: Handle<Props>) {
  const query = createQuery(handle, productQueries.detail(handle.props.slug));

  handle.queueTask(() => {
    query.refetch().finally(handle.update);
  });

  return () => {
    const { data: product, isPending, isError, error, refetch } = query;

    if (isPending) {
      return <ProductDetailSkeleton />;
    }

    if (isError && product === undefined) {
      return (
        <ProductLoadError
          message={error.message}
          onRetry={() => void refetch()}
        />
      );
    }

    if (!product) {
      return <ProductNotFound />;
    }

    return (
      <ProductLayout
        breadcrumbs={
          <ProductBreadcrumbs category={product.category} name={product.name} />
        }
        media={<ProductGallery product={product} />}
      >
        <ProductSummary product={product} />
        <ProductSpecifications
          features={product.features}
          specifications={product.specifications}
        />
      </ProductLayout>
    );
  };
}
