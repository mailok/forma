import type { APIRoute } from "astro";
import { db } from "@/db/client";

export const GET: APIRoute = () =>
  Response.json({ items: db.categories.findMany() });
