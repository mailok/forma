// The catalog card and the detail page share this name, so Astro's router morphs
// the product image between them. Names must be unique within each page.
export function productImageTransitionName(slug: string): string {
  return `product-image-${slug}`;
}
