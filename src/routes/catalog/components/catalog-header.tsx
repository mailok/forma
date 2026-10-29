import type { Handle, RemixNode } from "remix/component";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/icon";
import { Container } from "@/components/layout/container";

export function CatalogHeader() {
  return () => (
    <header class="sticky top-0 z-30 border-b border-line/80 bg-canvas/85 backdrop-blur-lg">
      <Container class="flex h-16 items-center justify-between gap-6">
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
      <BrandMark class="size-6 text-ink" />
      <span class="font-display text-[30px] leading-none tracking-[-0.02em]">
        forma<span class="text-clay">.</span>
      </span>
      <span class="ml-3 hidden border-l border-line pl-4 text-xs text-stone-500 md:block">
        Thoughtfully chosen objects
      </span>
    </a>
  );
}

function MainNavigation() {
  return () => (
    <nav aria-label="Main navigation" class="flex items-center gap-8 text-sm">
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
          ? "font-medium text-ink underline decoration-clay decoration-[1.5px] underline-offset-[10px]"
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
    <div class="hidden items-center gap-2 rounded-full border border-line bg-paper/70 px-3.5 py-1.5 text-xs text-stone-500 sm:flex">
      <span class="size-1.5 rounded-full bg-forest" />A demo built with Remix
    </div>
  );
}
