import type { CategoryId, FilterKey, SortOrder } from "./types";

export const searchQueryMaxLength = 120;

export const filterKeys: FilterKey[] = ["brand", "type", "feature", "price"];

export const categoryIds: CategoryId[] = [
  "all",
  "electronics",
  "clothing",
  "home",
  "outdoors",
];

export const sortOrders: SortOrder[] = [
  "featured",
  "price-asc",
  "price-desc",
  "name",
];
