import { on, type Handle } from "remix/component";
import type { Category } from "@/db/types";
import * as catalog from "./catalog";

export function CategoryTabs(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => (
    <nav
      aria-label="Browse by category"
      class="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0"
    >
      <div class="flex min-w-max gap-8 border-b border-line sm:gap-10">
        {context.categories.map((category) => (
          <CategoryTab
            key={category.id}
            category={category}
            selected={context.state.filters.category === category.id}
            onSelect={() => context.selectCategory(category.id)}
          />
        ))}
      </div>
    </nav>
  );
}

interface CategoryTabProps {
  category: Category;
  selected: boolean;
  onSelect(): void;
}

function CategoryTab(handle: Handle<CategoryTabProps>) {
  return () => {
    const { category, selected } = handle.props;

    return (
      <button
        type="button"
        aria-pressed={selected}
        class="group -mb-px flex items-center gap-2 border-b-[1.5px] border-transparent pb-4 text-[15px] font-medium text-stone-500 transition-colors hover:text-ink focus-visible:border-stone-400 focus-visible:text-ink focus-visible:outline-none aria-pressed:border-ink aria-pressed:text-ink"
        mix={on("click", () => handle.props.onSelect())}
      >
        {category.id === "all" ? "Everything" : category.label}
        <span class="rounded-full bg-ink/5 px-1.5 py-0.5 text-[11px] leading-none text-stone-500 tabular-nums transition-colors group-aria-pressed:bg-ink group-aria-pressed:text-paper">
          {category.count}
        </span>
      </button>
    );
  };
}
