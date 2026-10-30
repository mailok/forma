import type { Handle } from "remix/component";
import { paths } from "@/lib/paths";
import { categoryCopy } from "@/db/catalog-labels";
import type { ProductCategoryId } from "@/db/types";

interface Breadcrumb {
  label: string;
  href: string;
}

interface Props {
  category: ProductCategoryId;
  name: string;
}

export function Breadcrumbs(handle: Handle<Props>) {
  return () => {
    const { category, name } = handle.props;
    const breadcrumbs: Breadcrumb[] = [
      { label: categoryCopy.all.label, href: paths.catalog() },
      { label: categoryCopy[category].label, href: paths.catalog(category) },
    ];

    return (
      <nav aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-stone-500">
          {breadcrumbs.map((breadcrumb) => (
            <li key={breadcrumb.href} class="flex items-center gap-2">
              <a
                href={breadcrumb.href}
                class="transition-colors hover:text-ink"
              >
                {breadcrumb.label}
              </a>
              <span aria-hidden="true" class="text-stone-300">
                /
              </span>
            </li>
          ))}
          <li aria-current="page" class="text-ink">
            {name}
          </li>
        </ol>
      </nav>
    );
  };
}
