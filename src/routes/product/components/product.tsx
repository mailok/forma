import type { Handle } from "remix/component";
import { createQuery } from "@/integrations/tanstack-query/create-query";
import { productQueries } from "@/routes/product/queries";
import { ProductDetail } from "./product-detail";

interface Props {
  slug: string;
}

export function Product(handle: Handle<Props>) {
  const query = createQuery(handle, productQueries.detail(handle.props.slug));
  let isHydrated = false;

  handle.queueTask(() => {
    isHydrated = true;
    handle.update();
  });

  return () => {
    const { data: product, isPending, isError, error, refetch } = query;

    if (!isHydrated || isPending) {
      return <ProductDetail.Skeleton />;
    }

    if (isError && product === undefined) {
      return (
        <ProductDetail.LoadError
          message={error.message}
          onRetry={() => void refetch()}
        />
      );
    }

    if (!product) {
      return <ProductDetail.NotFound />;
    }

    return (
      <ProductDetail.Layout
        breadcrumbs={
          <ProductDetail.Breadcrumbs
            category={product.category}
            name={product.name}
          />
        }
        media={<ProductDetail.Gallery product={product} />}
      >
        <ProductDetail.Summary product={product} />
        <ProductDetail.Specifications
          features={product.features}
          specifications={product.specifications}
        />
      </ProductDetail.Layout>
    );
  };
}
