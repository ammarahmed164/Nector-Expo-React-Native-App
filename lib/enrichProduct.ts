import type { Product } from "@/data/products";
import { getProductById } from "@/data/products";

/** Merge API assistant products with local catalog so images always resolve. */
export function enrichAssistantProduct(p: Product): Product {
  const local = getProductById(p.id);
  if (!local) {
    return {
      ...p,
      image: p.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    };
  }
  return {
    ...local,
    ...p,
    image: p.image || local.image,
    name: p.name || local.name,
    unit: p.unit || local.unit,
    price: p.price ?? local.price,
  };
}

export function enrichAssistantProducts(list: Product[]): Product[] {
  return list.map(enrichAssistantProduct);
}
