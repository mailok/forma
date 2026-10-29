import { on, type Handle } from "remix/component";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import type { Category, CategoryId } from "@/db/types";
import * as catalog from "./catalog";

const categoryIcons: Record<CategoryId, IconName> = {
  all: "grid",
  electronics: "headphones",
  clothing: "shirt",
  home: "home",
  outdoors: "mountain",
};

export function CategoryTabs(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => (
    <div
      class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:gap-3"
      aria-label="Browse by category"
    >
      {context.categories.map((category) => (
        <CategoryTab
          key={category.id}
          category={category}
          selected={context.state.filters.category === category.id}
          onSelect={() => context.selectCategory(category.id)}
        />
      ))}
    </div>
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
      <Button
        aria-pressed={selected}
        variant="pill"
        mix={on("click", () => handle.props.onSelect())}
      >
        <Icon name={categoryIcons[category.id]} class="size-3.5" />
        {category.id === "all" ? "View all" : category.label}
        <span
          class={cn(
            "ml-1 text-[9px]",
            selected ? "text-emerald-200/70" : "text-stone-400",
          )}
        >
          {category.count}
        </span>
      </Button>
    );
  };
}
