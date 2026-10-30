import { Skeleton } from "@/components/ui/skeleton";
import { ProductLayout } from "./product-layout";

export function ProductDetailSkeleton() {
  return () => (
    <ProductLayout
      busy
      breadcrumbs={<Skeleton class="h-5 w-64 max-w-full" />}
      media={<Skeleton class="aspect-4/5 rounded-[36px]" />}
    >
      <h1 id="product-heading" class="sr-only">
        Loading product…
      </h1>
      <SummarySkeleton />
      <SpecificationsSkeleton />
    </ProductLayout>
  );
}

function SummarySkeleton() {
  return () => (
    <div aria-hidden="true" class="flex flex-col">
      <Skeleton class="h-4 w-48" />
      <Skeleton class="mt-5 h-14 w-4/5 sm:h-16" />
      <Skeleton class="mt-3 h-5 w-3/5" />
      <Skeleton class="mt-8 h-9 w-32" />
      <div class="mt-8 flex flex-col gap-3">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/4" />
      </div>
      <Skeleton class="mt-10 h-28 rounded-3xl" />
    </div>
  );
}

function SpecificationsSkeleton() {
  return () => (
    <div aria-hidden="true" class="border-t border-line pt-8">
      <Skeleton class="h-3 w-16" />
      <div class="mt-5 flex gap-2">
        <Skeleton class="h-7 w-24 rounded-full" />
        <Skeleton class="h-7 w-28 rounded-full" />
      </div>
      <div class="mt-6 flex flex-col gap-5">
        <Skeleton class="h-5 w-full" />
        <Skeleton class="h-5 w-full" />
        <Skeleton class="h-5 w-full" />
      </div>
    </div>
  );
}
