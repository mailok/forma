import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";

type StockLevel = "out" | "low" | "available";

interface StockStyle {
  text: string;
  dot: string;
}

const stockStyles: Record<StockLevel, StockStyle> = {
  out: { text: "text-stone-400", dot: "bg-stone-300" },
  low: { text: "text-amber-700", dot: "bg-amber-500" },
  available: { text: "text-[#6a7c63]", dot: "bg-[#8aab78]" },
};

interface Props {
  stock: number;
  sku: string;
}

export function ProductAvailability(handle: Handle<Props>) {
  return () => {
    const { stock, sku } = handle.props;
    const styles = stockStyles[stockLevel(stock)];

    return (
      <div class="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
        <span class={cn("flex items-center gap-1.5 text-[10px]", styles.text)}>
          <span class={cn("size-1.5 rounded-full", styles.dot)} />
          {stock === 0 ? "Out of stock" : `${stock} in stock`}
        </span>
        <span class="text-[9px] tracking-wide text-stone-400">{sku}</span>
      </div>
    );
  };
}

function stockLevel(stock: number): StockLevel {
  if (stock === 0) return "out";
  return stock < 10 ? "low" : "available";
}
