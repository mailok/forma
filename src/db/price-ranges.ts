interface PriceRange {
  value: string;
  label: string;
  includes(price: number): boolean;
}

export const priceRanges: PriceRange[] = [
  {
    value: "under-50",
    label: "Under US$ 50",
    includes: (price) => price < 50,
  },
  {
    value: "50-150",
    label: "US$ 50 to US$ 150",
    includes: (price) => price >= 50 && price <= 150,
  },
  {
    value: "150-plus",
    label: "Over US$ 150",
    includes: (price) => price > 150,
  },
];

export function priceRangeOf(price: number): string {
  return priceRanges.find((range) => range.includes(price))?.value ?? "";
}
