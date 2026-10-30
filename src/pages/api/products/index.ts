import type { APIRoute } from "astro";
import { db } from "@/db/client";
import {
  InvalidSearchProductsQuery,
  parseSearchProductsFilters,
} from "@/pages/api/_lib/parse-search-products-filters";

export const GET: APIRoute = async function searchProducts({ url }) {
  try {
    const filters = parseSearchProductsFilters(
      url.searchParams,
      db.products.filterValues,
    );
    // Deliberate demo latency to make the request's pending state visible.
    await new Promise((resolve) => setTimeout(resolve, 220));
    return Response.json(db.products.search(filters), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof InvalidSearchProductsQuery) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
};
