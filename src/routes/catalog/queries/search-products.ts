import api, { WretchError } from "@/lib/api";
import type { SearchProductsFilters, SearchProductsResult } from "@/db/types";
import { searchProductsFiltersToParams } from "@/routes/catalog/search-products-filters";

interface SearchProductsOptions {
  filters: SearchProductsFilters;
  signal: AbortSignal;
}

export async function searchProducts({
  filters,
  signal,
}: SearchProductsOptions): Promise<SearchProductsResult> {
  try {
    return await api
      .options({ signal })
      .get(`/products?${searchProductsFiltersToParams(filters)}`)
      .json<SearchProductsResult>();
  } catch (error) {
    if (error instanceof WretchError) {
      throw new Error("Unable to update your selection. Please try again.", {
        cause: error,
      });
    }
    throw error;
  }
}
