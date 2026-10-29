import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";

interface CatalogHeroProps {
  total: number;
}

export function CatalogHero(handle: Handle<CatalogHeroProps>) {
  return () => (
    <section
      class="relative overflow-hidden rounded-2xl bg-[#e9eee3]"
      aria-labelledby="catalog-heading"
    >
      <HeroCopy />
      <HeroCollage total={handle.props.total} />
    </section>
  );
}

function HeroCopy() {
  return () => (
    <div class="relative z-10 max-w-xl px-7 py-9 sm:px-10 sm:py-10">
      <p class="mb-4 flex items-center gap-2.5 text-[9px] font-semibold tracking-[0.2em] text-[#74846a] uppercase">
        <span class="h-px w-6 bg-[#91a17f]" />
        The everyday collection · Vol. 01
      </p>
      <h1
        id="catalog-heading"
        class="text-[38px] leading-[1.08] font-medium tracking-[-0.055em] text-ink sm:text-[52px]"
      >
        Good objects.
        <br />
        <span class="text-[#6e8763]">Better days.</span>
      </h1>
      <p class="mt-5 max-w-75 text-[13px] leading-relaxed text-[#74816d]">
        Technology, design and essentials for your everyday life. Find what
        feels like you.
      </p>
    </div>
  );
}

interface HeroCollageProps {
  total: number;
}

function HeroCollage(handle: Handle<HeroCollageProps>) {
  return () => (
    <div
      class="pointer-events-none absolute top-0 right-0 hidden h-full w-[48%] items-center justify-center overflow-hidden md:flex"
      aria-hidden="true"
    >
      <CollageRing class="-right-10 size-95" />
      <CollageRing class="right-9 size-67.5" />
      <div class="relative ml-8 flex items-center gap-4 lg:gap-6">
        <CollagePhoto
          src="/products/chair.jpg"
          class="mt-9 h-44 w-32 -rotate-12 lg:h-52 lg:w-40"
        />
        <CollagePhoto
          src="/products/headphones.jpg"
          class="-mt-9 h-48 w-36 rotate-[9deg] lg:h-56 lg:w-44"
        />
      </div>
      <span class="absolute right-6 bottom-5 text-[9px] tracking-[0.12em] text-[#7f8f73] uppercase">
        {handle.props.total} objects. Endless possibilities.
      </span>
    </div>
  );
}

interface CollageRingProps {
  class: string;
}

function CollageRing(handle: Handle<CollageRingProps>) {
  return () => (
    <div
      class={cn(
        "absolute rounded-full border border-[#d5dfcc]",
        handle.props.class,
      )}
    />
  );
}

interface CollagePhotoProps {
  src: string;
  class: string;
}

function CollagePhoto(handle: Handle<CollagePhotoProps>) {
  return () => (
    <div
      class={cn(
        "overflow-hidden rounded-xl border-[5px] border-white bg-white shadow-xl shadow-[#617751]/15",
        handle.props.class,
      )}
    >
      <img
        src={handle.props.src}
        alt=""
        width="720"
        height="600"
        class="size-full object-cover"
      />
    </div>
  );
}
