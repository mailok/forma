import { Icon } from "@/components/icon";
import { Container } from "@/components/layout/container";
import { paths } from "@/lib/paths";

export function ProductNotFound() {
  return () => (
    <main
      id="product"
      class="scroll-mt-20"
      aria-labelledby="not-found-heading"
    >
      <Container class="py-16 sm:py-24 lg:py-32">
        <section class="flex flex-col items-center rounded-4xl border border-line bg-paper px-6 py-16 text-center sm:py-24">
          <NotFoundMessage />
          <div class="mt-9">
            <BackToCatalogLink />
          </div>
        </section>
      </Container>
    </main>
  );
}

function NotFoundMessage() {
  return () => (
    <>
      <span class="flex size-16 items-center justify-center rounded-full bg-forest-soft text-forest">
        <Icon name="search" class="size-7" />
      </span>
      <p class="mt-7 text-[11px] font-medium tracking-[0.22em] text-clay uppercase">
        404 · Product not found
      </p>
      <h1
        id="not-found-heading"
        class="mt-5 font-display text-[52px] leading-[0.95] tracking-tight text-ink sm:text-[72px]"
      >
        This one isn't here.
      </h1>
      <p class="mt-5 max-w-md text-[15px] leading-relaxed text-pretty text-stone-500">
        We couldn't find this product. The link may be incorrect, or the object
        may no longer be part of our collection. There's still plenty to
        discover.
      </p>
    </>
  );
}

function BackToCatalogLink() {
  return () => (
    <a
      href={paths.catalog()}
      class="group inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-forest focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none"
    >
      <Icon
        name="arrow"
        class="size-4 rotate-180 transition-transform group-hover:-translate-x-0.5"
      />
      Back to the catalog
    </a>
  );
}
