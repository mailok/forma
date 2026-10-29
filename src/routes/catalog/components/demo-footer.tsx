import { BrandMark } from "@/components/icon";
import { Container } from "@/components/layout/container";

export function DemoFooter() {
  return () => (
    <footer id="about-demo" class="mt-32 border-t border-line bg-paper">
      <Container class="pt-16 pb-10">
        <div class="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <FooterBrand />
          <FooterDisclaimer />
        </div>
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
