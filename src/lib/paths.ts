import type { CategoryId } from "@/db/types";

export const paths = {
  catalog: (category: CategoryId = "all") =>
    category === "all" ? "/" : `/?${new URLSearchParams({ category })}`,
  product: (slug: string) => `/products/${encodeURIComponent(slug)}`,
};
