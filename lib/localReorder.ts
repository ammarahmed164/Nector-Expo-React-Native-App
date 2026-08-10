import { products, type Product } from "@/data/products";
import type { Order } from "@/store/useOrderStore";
import type { ReorderSuggestion } from "@/lib/agentApi";

function toProduct(item: { productId: string; name: string; price: number; unit?: string }): Product {
  const catalog = products.find((p) => p.id === item.productId);
  if (catalog) return catalog;
  return {
    id: item.productId,
    name: item.name,
    unit: item.unit ?? "1 unit",
    price: item.price,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    category: "groceries",
  };
}

/** Client-side fallback when backend has no synced orders yet. */
export function getLocalReorderSuggestions(_userId: string, orders: Order[]): ReorderSuggestion[] {
  const userOrders = orders.filter((o) => true);
  if (userOrders.length === 0) return [];

  const counts = new Map<string, { count: number; item: Order["items"][0] }>();

  for (const order of userOrders) {
    const seen = new Set<string>();
    for (const item of order.items) {
      const entry = counts.get(item.product.id) ?? { count: 0, item };
      if (!seen.has(item.product.id)) {
        entry.count += 1;
        seen.add(item.product.id);
      }
      counts.set(item.product.id, entry);
    }
  }

  const frequent = [...counts.entries()]
    .filter(([, v]) => v.count >= 2)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([id, v]) => ({
      ...v.item.product,
      orderCount: v.count,
      reason: "frequent" as const,
    }));

  if (frequent.length > 0) return frequent.slice(0, 8);

  const last = userOrders[0];
  const seen = new Set<string>();
  const buyAgain: ReorderSuggestion[] = [];

  for (const item of last.items) {
    if (seen.has(item.product.id)) continue;
    seen.add(item.product.id);
    buyAgain.push({ ...item.product, orderCount: 1, reason: "buy_again" });
  }

  return buyAgain.slice(0, 6);
}
