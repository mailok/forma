import type { Handle } from "remix/component";
import { Icon } from "@/components/icon";
import { categoryCopy } from "@/db/catalog-labels";
import type { CategoryId } from "@/db/types";

interface FeaturedObject {
  name: string;
  image: string;
  category: CategoryId;
}

const featuredObjects: FeaturedObject[] = [
  { name: "Sunday Sofa", image: "/products/vase.jpg", category: "home" },
  { name: "Flow Bottle", image: "/products/bottle.jpg", category: "outdoors" },
  { name: "Form Chair", image: "/products/chair.jpg", category: "home" },
  { name: "Trail Runner", image: "/products/trail.jpg", category: "outdoors" },
];

interface CatalogHeroProps {
  total: number;
}

export function CatalogHero(handle: Handle<CatalogHeroProps>) {
  return () => (
    <section aria-labelledby="catalog-heading">
      <HeroIntro total={handle.props.total} />
      <FeaturedStrip />
    </section>
  );
}

interface HeroIntroProps {
  total: number;
}

function HeroIntro(handle: Handle<HeroIntroProps>) {
  return () => (
    <div class="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-20">
      <div>
        <p class="mb-6 flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] text-stone-500 uppercase">
          <span class="h-px w-8 bg-stone-400" />
          The everyday collection · Vol. 01
        </p>
        <h1
          id="catalog-heading"
          class="font-display text-[52px] leading-[0.92] tracking-tight text-ink sm:text-[72px] xl:text-[88px]"
        >
          Good objects,
          <br />
          <em class="text-forest">better days.</em>
        </h1>
      </div>
      <div class="lg:pb-2">
        <p class="text-base leading-relaxed text-pretty text-stone-600">
          Technology, design and essentials for your everyday life. Find what
          feels like you.
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-x-7 gap-y-5">
          <HeroCallToAction />
          <HeroStat value={handle.props.total} label="objects" />
        </div>
      </div>
    </div>
  );
}

function HeroCallToAction() {
  return () => (
    <a
      href="#catalog"
      data-astro-history="replace"
      class="group inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-forest focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none"
    >
      Explore the collection
      <Icon
        name="arrow"
        class="size-4 transition-transform group-hover:translate-x-0.5"
      />
    </a>
  );
}

interface HeroStatProps {
  value: number;
  label: string;
}

function HeroStat(handle: Handle<HeroStatProps>) {
  return () => (
    <p class="flex items-baseline gap-1.5 text-sm text-stone-500">
      <span class="font-display text-[32px] leading-none text-ink">
        {handle.props.value}
      </span>
      {handle.props.label}
    </p>
  );
}

function FeaturedStrip() {
  return () => (
    <div class="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-5 md:grid-cols-4">
      {featuredObjects.map((object) => (
        <FeaturedFigure key={object.name} object={object} />
      ))}
    </div>
  );
}

interface FeaturedFigureProps {
  object: FeaturedObject;
}

function FeaturedFigure(handle: Handle<FeaturedFigureProps>) {
  return () => {
    const { object } = handle.props;

    return (
      <figure class="group">
        <div class="aspect-4/3 overflow-hidden rounded-3xl bg-stone-200/60">
          <img
            src={object.image}
            alt=""
            width="720"
            height="600"
            class="size-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
          />
        </div>
        <figcaption class="mt-3 flex items-baseline justify-between gap-2 px-1 text-[13px]">
          <span class="font-medium text-ink">{object.name}</span>
          <span class="text-stone-500">
            {categoryCopy[object.category].label}
          </span>
        </figcaption>
      </figure>
    );
  };
}
