import { Skeleton as SkeletonPlaceholder } from "@/components/ui/skeleton";
import { Layout } from "./layout";

export function Skeleton() {
  return () => (
    <Layout
      busy
      breadcrumbs={<SkeletonPlaceholder class="h-5 w-64 max-w-full" />}
      media={<SkeletonPlaceholder class="aspect-4/5 rounded-[36px]" />}
    >
      <h1 id="product-heading" class="sr-only">
        Loading product…
      </h1>
      <SummarySkeleton />
      <SpecificationsSkeleton />
    </Layout>
  );
}

function SummarySkeleton() {
  return () => (
    <div aria-hidden="true" class="flex flex-col">
      <SkeletonPlaceholder class="h-4 w-48" />
      <SkeletonPlaceholder class="mt-5 h-14 w-4/5 sm:h-16" />
      <SkeletonPlaceholder class="mt-3 h-5 w-3/5" />
      <SkeletonPlaceholder class="mt-8 h-9 w-32" />
      <div class="mt-8 flex flex-col gap-3">
        <SkeletonPlaceholder class="h-4 w-full" />
        <SkeletonPlaceholder class="h-4 w-full" />
        <SkeletonPlaceholder class="h-4 w-3/4" />
      </div>
      <SkeletonPlaceholder class="mt-10 h-28 rounded-3xl" />
    </div>
  );
}

function SpecificationsSkeleton() {
  return () => (
    <div aria-hidden="true" class="border-t border-line pt-8">
      <SkeletonPlaceholder class="h-3 w-16" />
      <div class="mt-5 flex gap-2">
        <SkeletonPlaceholder class="h-7 w-24 rounded-full" />
        <SkeletonPlaceholder class="h-7 w-28 rounded-full" />
      </div>
      <div class="mt-6 flex flex-col gap-5">
        <SkeletonPlaceholder class="h-5 w-full" />
        <SkeletonPlaceholder class="h-5 w-full" />
        <SkeletonPlaceholder class="h-5 w-full" />
      </div>
    </div>
  );
}
