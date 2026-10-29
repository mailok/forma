import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Icon } from "@/components/icon";
import { searchQueryMaxLength } from "@/db/catalog-options";

export function CatalogSearch(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => (
    <div class="flex h-12 items-center gap-3 rounded-xl border border-stone-200/80 bg-white px-4 transition-shadow focus-within:border-emerald-700/50 focus-within:ring-3 focus-within:ring-emerald-800/5">
      <Icon name="search" class="size-4.5 shrink-0 text-stone-400" />
      <label for="product-search" class="sr-only">
        Search products by name
      </label>
      <input
        id="product-search"
        type="search"
        name="q"
        value={context.state.filters.q}
        maxLength={searchQueryMaxLength}
        placeholder="Find your next everyday favorite…"
        autoComplete="off"
        class="h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-stone-400"
        mix={on("input", (event) =>
          context.search((event.currentTarget as HTMLInputElement).value),
        )}
      />
      <span class="hidden rounded border border-stone-200 px-1.5 py-0.5 text-[9px] tracking-wide text-stone-400 sm:block">
        BY NAME
      </span>
    </div>
  );
}
