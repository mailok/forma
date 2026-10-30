import type { Handle } from "remix/component";
import { filterOptionLabel } from "@/db/catalog-labels";
import type { Product } from "@/db/types";

interface Specification {
  term: string;
  detail: string;
}

interface Props {
  features: Product["features"];
  specifications: Product["specifications"];
}

export function Specifications(handle: Handle<Props>) {
  return () => {
    const specifications = listSpecifications(handle.props.specifications);

    return (
      <section
        aria-labelledby="specifications-heading"
        class="border-t border-line pt-8"
      >
        <h2
          id="specifications-heading"
          class="text-[11px] font-medium tracking-[0.18em] text-stone-500 uppercase"
        >
          Details
        </h2>
        <ul class="mt-5 flex flex-wrap gap-2" aria-label="Features">
          {handle.props.features.map((feature) => (
            <li
              key={feature}
              class="rounded-full bg-forest-soft px-3.5 py-1.5 text-xs text-forest"
            >
              {filterOptionLabel("feature", feature)}
            </li>
          ))}
        </ul>
        <dl class="mt-6 divide-y divide-line">
          {specifications.map((specification) => (
            <div
              key={specification.term}
              class="flex items-baseline justify-between gap-6 py-3.5 text-sm"
            >
              <dt class="text-stone-500">{specification.term}</dt>
              <dd class="text-right text-ink">{specification.detail}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  };
}

function listSpecifications(
  specifications: Product["specifications"],
): Specification[] {
  return Object.entries(specifications).map(([term, detail]) => ({
    term,
    detail,
  }));
}
