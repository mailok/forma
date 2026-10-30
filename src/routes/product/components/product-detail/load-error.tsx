import { on, type Handle } from "remix/component";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

interface Props {
  message: string;
  onRetry: () => void;
}

export function LoadError(handle: Handle<Props>) {
  return () => (
    <main id="product" class="scroll-mt-20" aria-labelledby="product-heading">
      <Container class="py-16 sm:py-24">
        <section class="flex flex-col items-center gap-6 rounded-4xl border border-line bg-paper px-6 py-16 text-center">
          <h1 id="product-heading" class="font-display text-4xl text-ink">
            Unable to load this product
          </h1>
          <p role="alert" class="text-sm text-stone-600">
            {handle.props.message}
          </p>
          <Button mix={on("click", () => handle.props.onRetry())}>
            Try again
          </Button>
        </section>
      </Container>
    </main>
  );
}
