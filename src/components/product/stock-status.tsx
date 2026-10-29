import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";

type StockLevel = "out" | "low" | "available";

interface StockStyle {
  text: string;
  dot: string;
}

const stockStyles: Record<StockLevel, StockStyle> = {
  out: { text: "text-stone-400", dot: "bg-stone-300" },
  low: { text: "text-clay", dot: "bg-clay" },
  available: { text: "text-forest", dot: "bg-forest/70" },
};

interface Props {
  stock: number;
}

export function StockStatus(handle: Handle<Props>) {
  return () => {
    const { stock } = handle.props;
    const styles = stockStyles[stockLevel(stock)];

    return (
      <span class={cn("flex items-center gap-2 text-xs", styles.text)}>
        <span class={cn("size-1.5 rounded-full", styles.dot)} />
        {stock === 0 ? "Out of stock" : `${stock} in stock`}
      </span>
    );
  };
}

function stockLevel(stock: number): StockLevel {
  if (stock === 0) return "out";
  return stock < 10 ? "low" : "available";
}
