import { priceRanges } from "./price-ranges";
import type { CategoryId, FilterKey } from "./types";

interface CategoryCopy {
  label: string;
  description: string;
}

export const categoryCopy: Record<CategoryId, CategoryCopy> = {
  all: {
    label: "All products",
    description: "A selection of objects that make everyday life better.",
  },
  electronics: {
    label: "Technology",
    description: "Smart design. Meaningful connections.",
  },
  clothing: {
    label: "Clothing & accessories",
    description: "Everyday essentials, season after season.",
  },
  home: {
    label: "Home & design",
    description: "Objects that make you want to stay a little longer.",
  },
  outdoors: {
    label: "Outdoors",
    description: "Everything you need to go a little further.",
  },
};

export const filterGroupLabels: Record<FilterKey, string> = {
  brand: "Brand",
  type: "Product type",
  feature: "Features",
  price: "Price",
};

export const filterOptionLabels: Record<FilterKey, Record<string, string>> = {
  brand: {
    orbit: "Orbit",
    noma: "Noma",
    alba: "Alba",
    terra: "Terra",
    studio: "Studio",
  },
  type: {
    headphones: "Headphones",
    camera: "Cameras",
    keyboard: "Keyboards",
    speaker: "Speakers",
    watch: "Watches",
    tshirt: "T-shirts",
    hoodie: "Hoodies",
    sneakers: "Sneakers",
    cap: "Caps",
    lamp: "Lighting",
    chair: "Chairs",
    sofa: "Sofas",
    mug: "Mugs",
    backpack: "Backpacks",
    bottle: "Bottles",
    tent: "Camping",
    shoes: "Outdoor shoes",
  },
  feature: {
    wireless: "Wireless",
    "noise-cancelling": "Noise cancellation",
    portable: "Portable",
    sustainable: "Sustainable materials",
    cotton: "Cotton",
    waterproof: "Water resistant",
    lightweight: "Lightweight",
    handmade: "Handmade",
    adjustable: "Adjustable",
    insulated: "Insulated",
  },
  price: Object.fromEntries(
    priceRanges.map((range) => [range.value, range.label]),
  ),
};

export function filterOptionLabel(key: FilterKey, value: string): string {
  return filterOptionLabels[key][value] ?? value;
}
