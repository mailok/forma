import type { Handle, RemixNode } from "remix/component";
import { ProductMetadata } from "@/components/product/product-metadata";
import { ProductPrice } from "@/components/product/product-price";
import { ProductColors } from "@/components/product/product-colors";
import { StockStatus } from "@/components/product/stock-status";
import type { Product } from "@/db/types";

interface ProductSummaryProps {
  product: Product;
}

export function ProductSummary(handle: Handle<ProductSummaryProps>) {
  return () => {
    const { product } = handle.props;

    return (
      <section class="flex flex-col">
        <ProductMetadata
          brand={product.brand}
          rating={product.rating}
          reviews={product.reviews}
        />
        <h1
          id="product-heading"
          class="mt-5 font-display text-[52px] leading-[0.92] tracking-tight text-ink sm:text-[64px]"
        >
          {product.name}
        </h1>
        <p class="mt-3 text-base text-stone-600">{product.title}</p>
        <div class="mt-8">
          <ProductPrice
            price={product.price}
            originalPrice={product.originalPrice}
            currency={product.currency}
            size="large"
          />
        </div>
        <p class="mt-8 max-w-prose text-[15px] leading-relaxed text-pretty text-stone-600">
          {product.description}
        </p>
        <dl class="mt-10 divide-y divide-line rounded-3xl border border-line bg-paper px-5">
          <SummaryFact term="Colors">
            <ProductColors colors={product.colors} />
          </SummaryFact>
          <SummaryFact term="Availability">
            <StockStatus stock={product.stock} />
          </SummaryFact>
        </dl>
      </section>
    );
  };
}

interface SummaryFactProps {
  term: string;
  children?: RemixNode;
}

function SummaryFact(handle: Handle<SummaryFactProps>) {
  return () => (
    <div class="flex items-center justify-between gap-6 py-4">
      <dt class="text-[13px] text-stone-500">{handle.props.term}</dt>
      <dd>{handle.props.children}</dd>
    </div>
  );
}
