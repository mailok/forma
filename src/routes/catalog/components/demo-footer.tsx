import { BrandMark, Icon } from "@/components/icon";
import { Container } from "@/components/layout/container";

export function DemoFooter() {
  return () => (
    <footer id="about-demo" class="mt-32 border-t border-line bg-paper">
      <Container class="pt-16 pb-10">
        <div class="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <FooterBrand />
          <FooterDisclaimer />
        </div>
        <BehindTheDemo />
      </Container>
    </footer>
  );
}

function FooterBrand() {
  return () => (
    <div class="text-ink">
      <p class="flex items-end gap-4">
        <BrandMark class="mb-3 size-10 text-ink sm:mb-5 sm:size-14" />
        <span class="font-display text-[96px] leading-[0.8] tracking-[-0.03em] sm:text-[160px]">
          forma<span class="text-clay">.</span>
        </span>
      </p>
      <p class="mt-6 text-lg leading-snug text-stone-500">
        A thoughtful selection, not an endless catalog.
      </p>
    </div>
  );
}

function FooterDisclaimer() {
  return () => (
    <p class="text-xs tracking-wide text-stone-400">
      Fictional catalog · Prices in USD · Illustrative photos
    </p>
  );
}

function BehindTheDemo() {
  return () => (
    <details class="group mt-14 rounded-3xl border border-line bg-canvas/60">
      <summary class="flex cursor-pointer list-none items-center gap-3 px-6 py-5 text-sm text-stone-600 marker:hidden">
        <Icon name="info" class="size-4.5 text-forest" />
        <span class="flex-1">
          Behind the demo: composition, context and Astro
        </span>
        <span class="hidden text-[11px] tracking-[0.18em] text-stone-400 uppercase sm:inline">
          For the curious
        </span>
        <Icon
          name="chevron"
          class="size-4 text-stone-400 transition-transform group-open:rotate-180"
        />
      </summary>
      <div class="grid gap-8 border-t border-line p-6 text-[13px] leading-relaxed text-stone-500 md:grid-cols-2">
        <DemoExplanation />
        <ContextCodeSample />
      </div>
    </details>
  );
}

function DemoExplanation() {
  return () => (
    <div>
      <h2 class="mb-3 text-base font-semibold tracking-[-0.01em] text-ink">
        One page. One context. Many components.
      </h2>
      <p>
        Everything you see is a tree of Remix components, hydrated with{" "}
        <code class="rounded bg-forest-soft px-1.5 py-0.5 text-xs text-forest">
          client:load
        </code>
        . Search, filters and results share one context; state does not need to
        pass through every component.
      </p>
      <p class="mt-3">
        Astro serves categories and products from a JSON database. Each filter
        sends an HTTP request with Wretch, with a short simulated delay and
        cancellation of previous requests.
      </p>
    </div>
  );
}

function ContextCodeSample() {
  return () => (
    <pre class="overflow-x-auto rounded-2xl bg-ink p-5 text-xs leading-loose text-paper/80">
      <code>
        {
          "// catalog.Context\nhandle.context.set({ state, search, toggleFilter, … });\n\n// Any descendant component\nconst context = handle.context.get(catalog.Context);"
        }
      </code>
    </pre>
  );
}
