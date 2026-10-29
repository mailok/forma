import type { APIRoute } from "astro";
import { db } from "@/db/client";

export const GET: APIRoute = ({ params }) => {
  const product = db.products.findUnique(params.id ?? "");
  return product
    ? Response.json(product)
    : Response.json({ error: "Product not found." }, { status: 404 });
};
