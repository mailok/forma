import { BrandMark, Icon } from "@/components/icon";
import { Container } from "@/components/layout/container";

export function DemoFooter() {
  return () => (
    <footer id="about-demo" class="mt-16 border-t border-stone-200/80">
      <Container class="pt-7 pb-8">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
    <div class="flex items-center gap-2 text-ink">
      <BrandMark class="size-5 text-[#7a8e6c]" />
      <span class="text-base font-semibold tracking-tight">forma.</span>
      <span class="ml-3 text-[11px] text-stone-400">
        A thoughtful selection, not an endless catalog.
      </span>
    </div>
  );
}

function FooterDisclaimer() {
  return () => (
    <p class="text-[10px] text-stone-400">
      Fictional catalog · Prices in USD · Illustrative photos
    </p>
  );
}

function BehindTheDemo() {
  return () => (
    <details class="group mt-7 rounded-xl border border-stone-200/70 bg-white">
      <summary class="flex cursor-pointer list-none items-center gap-2.5 px-4 py-3.5 text-[11px] text-stone-500 marker:hidden">
        <Icon name="info" class="size-4 text-[#819275]" />
        <span class="flex-1">
          Behind the demo: composition, context and Astro
        </span>
        <span class="hidden text-[9px] tracking-wide text-stone-400 sm:inline">
          FOR THE CURIOUS
        </span>
        <Icon
          name="chevron"
          class="size-3.5 transition-transform group-open:rotate-180"
        />
      </summary>
      <div class="grid gap-6 border-t border-stone-100 p-5 text-xs leading-relaxed text-stone-500 md:grid-cols-2">
        <DemoExplanation />
        <ContextCodeSample />
      </div>
    </details>
  );
}

function DemoExplanation() {
  return () => (
    <div>
      <h2 class="mb-2 font-semibold text-ink">
        One page. One context. Many components.
      </h2>
      <p>
        Everything you see is a tree of Remix components, hydrated with{" "}
        <code class="text-emerald-800">client:load</code>. Search, filters and
        results share one context; state does not need to pass through every
        component.
      </p>
      <p class="mt-2">
        Astro serves categories and products from a JSON database. Each filter
        sends an HTTP request with Wretch, with a short simulated delay and
        cancellation of previous requests.
      </p>
    </div>
  );
}

function ContextCodeSample() {
  return () => (
    <pre class="overflow-x-auto rounded-lg bg-ink p-4 text-[11px] leading-loose text-[#d2dfce]">
      <code>
        {
          "// catalog.Context\nhandle.context.set({ state, search, toggleFilter, … });\n\n// Any descendant component\nconst context = handle.context.get(catalog.Context);"
        }
      </code>
    </pre>
  );
}
