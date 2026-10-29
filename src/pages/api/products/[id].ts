import type { APIRoute } from "astro";
import { db } from "@/db/client";

// Ready for the future detail screen; no product-detail UI is implemented yet.
export const GET: APIRoute = ({ params }) => {
  const product = db.products.findUnique(params.id ?? "");
  return product
    ? Response.json({ item: product })
    : Response.json({ error: "Product not found." }, { status: 404 });
};
