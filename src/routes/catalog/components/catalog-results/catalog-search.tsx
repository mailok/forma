import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Icon } from "@/components/icon";
import { searchQueryMaxLength } from "@/db/catalog-options";

export function CatalogSearch(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => (
    <div class="flex h-14 items-center gap-3 rounded-full border border-line bg-paper pr-2 pl-5 transition-[border-color,box-shadow] focus-within:border-ink/30 focus-within:ring-4 focus-within:ring-ink/5 hover:border-stone-300">
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
        class="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-stone-400"
        mix={on("input", (event) =>
          context.search((event.currentTarget as HTMLInputElement).value),
        )}
      />
      <span class="hidden rounded-full bg-canvas px-3.5 py-1.5 text-xs text-stone-500 sm:block">
        By name
      </span>
    </div>
  );
}
