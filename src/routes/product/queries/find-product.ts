import api, { WretchError } from "@/lib/api";
import type { Product } from "@/db/types";

interface FindProductOptions {
  slug: string;
  signal: AbortSignal;
}

export async function findProduct({
  slug,
  signal,
}: FindProductOptions): Promise<Product | null> {
  try {
    //await new Promise((resolve) => setTimeout(resolve, 3000));
    return await api
      .options({ signal })
      .get(`/products/${encodeURIComponent(slug)}`)
      .json<Product>();
  } catch (error) {
    if (error instanceof WretchError) {
      if (error.status === 404) {
        return null;
      }
      throw new Error("Unable to load this product. Please try again.", {
        cause: error,
      });
    }
    throw error;
  }
}
