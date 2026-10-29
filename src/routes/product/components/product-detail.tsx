import type { Handle } from "remix/component";
import type { Product } from "@/db/types";
import { createQuery } from "@/integrations/tanstack-query/create-query";
import { productQueries } from "@/routes/product/queries";
import { ProductLayout } from "./product-layout";
import { ProductBreadcrumbs } from "./product-breadcrumbs";
import { ProductGallery } from "./product-gallery";
import { ProductSummary } from "./product-summary";
import { ProductSpecifications } from "./product-specifications";

interface Props {
  initialProduct: Product;
}

export function ProductDetail(handle: Handle<Props>) {
  const productQuery = createQuery(handle, {
    ...productQueries.detail(handle.props.initialProduct.slug),
    initialData: handle.props.initialProduct,
  });

  return () => {
    const product =
      productQuery.getCurrentResult().data ?? handle.props.initialProduct;

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
