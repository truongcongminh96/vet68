import { getPriceDisplay, type PriceProduct } from "@/lib/price";
import { cn } from "@/lib/utils";

export function ProductPrice({ product, compact = false }: { product: PriceProduct; compact?: boolean }) {
  const price = getPriceDisplay(product);
  return (
    <div>
      <p className={cn("font-heading font-bold text-primary", compact ? "text-base" : "text-xl")}>{price.label}</p>
      {!compact && price.detail ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{price.detail}</p> : null}
    </div>
  );
}
