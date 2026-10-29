import type { Handle, RemixNode } from "remix/component";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/icon";
import { Container } from "@/components/layout/container";

export function CatalogHeader() {
  return () => (
    <header class="border-b border-stone-200/80 bg-[#fbfcf8]">
      <Container class="flex h-20 items-center justify-between gap-6">
        <HeaderBrand />
        <MainNavigation />
        <DemoBadge />
      </Container>
    </header>
  );
}

function HeaderBrand() {
  return () => (
    <a
      href="/"
      class="flex items-center gap-2.5 text-ink"
      aria-label="Forma, home"
    >
      <BrandMark />
      <span class="text-[30px] leading-none font-semibold tracking-[-0.065em]">
        forma<span class="text-[#a1ad8b]">.</span>
      </span>
      <span class="ml-4 hidden border-l border-stone-200 pl-5 text-[9px] leading-relaxed tracking-[0.18em] text-stone-400 uppercase md:block">
        Thoughtfully
        <br />
        chosen objects
      </span>
    </a>
  );
}

function MainNavigation() {
  return () => (
    <nav
      aria-label="Main navigation"
      class="flex items-center gap-7 text-[12px]"
    >
      <NavLink href="#catalog" active class="hidden sm:block">
        Explore
      </NavLink>
      <NavLink href="#about-demo">The idea behind it</NavLink>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  active?: boolean;
  class?: string;
  children?: RemixNode;
}

function NavLink(handle: Handle<NavLinkProps>) {
  return () => (
    <a
      href={handle.props.href}
      class={cn(
        handle.props.active
          ? "font-semibold text-emerald-900 underline decoration-emerald-800/40 underline-offset-8"
          : "text-stone-500 transition-colors hover:text-ink",
        handle.props.class,
      )}
    >
      {handle.props.children}
    </a>
  );
}

function DemoBadge() {
  return () => (
    <div class="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[10px] text-stone-500 sm:flex">
      <span class="size-1.5 rounded-full bg-[#91aa76]" />A demo, built with
      Remix
    </div>
  );
}
