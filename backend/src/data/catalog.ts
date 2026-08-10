export type CatalogProduct = {
  id: string;
  name: string;
  unit: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  tags?: string[];
};

/** Mirrors the frontend mock catalog so AI agents search real in-app products. */
export const CATALOG: CatalogProduct[] = [
  { id: "1", name: "Organic Bananas", unit: "7pcs, Priceg", price: 4.99, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", category: "fruits", tags: ["exclusive"] },
  { id: "2", name: "Red Apple", unit: "1kg, Priceg", price: 4.99, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", category: "fruits", tags: ["exclusive"] },
  { id: "3", name: "Bell Pepper Red", unit: "1kg, Price", price: 4.99, image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", category: "vegetables", tags: ["bestselling"] },
  { id: "4", name: "Egg Chicken Red", unit: "4pcs, Price", price: 4.99, image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", category: "dairy-eggs" },
  { id: "5", name: "Ginger", unit: "250gm, Price", price: 4.99, image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400", category: "vegetables", tags: ["bestselling"] },
  { id: "6", name: "Beef Bone", unit: "1kg, Price", price: 4.99, image: "https://images.unsplash.com/photo-1602470521006-aa16f5a76e94?w=400", category: "meat" },
  { id: "7", name: "Broiler Chicken", unit: "1kg, Price", price: 4.99, image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400", category: "meat" },
  { id: "8", name: "Naturel Red Apple", unit: "1kg, Price", price: 4.99, image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400", category: "fruits" },
  { id: "9", name: "Diet Coke", unit: "355ml, Price", price: 1.99, image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400", category: "beverages" },
  { id: "10", name: "Sprite Can", unit: "325ml, Price", price: 1.5, image: "https://images.unsplash.com/photo-1625772299848-391b6a87ba7a?w=400", category: "beverages" },
  { id: "11", name: "Apple & Grape Juice", unit: "2L, Price", price: 15.5, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", category: "beverages" },
  { id: "12", name: "Orenge Juice", unit: "2L, Price", price: 15.99, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", category: "beverages" },
  { id: "13", name: "Coca Cola Can", unit: "325ml, Price", price: 4.99, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400", category: "beverages" },
  { id: "14", name: "Pepsi Can", unit: "330ml, Price", price: 4.99, image: "https://images.unsplash.com/photo-1581636625402-29b7762a2fe9?w=400", category: "beverages" },
  { id: "15", name: "Egg Chicken White", unit: "180g, Price", price: 1.5, image: "https://images.unsplash.com/photo-1518569659554-75d459ea2941?w=400", category: "dairy-eggs" },
  { id: "16", name: "Egg Pasta", unit: "30gm, Price", price: 15.99, image: "https://images.unsplash.com/photo-1551892379-ecf875246709?w=400", category: "bakery-snacks" },
  { id: "17", name: "Egg Noodles", unit: "2L, Price", price: 15.99, image: "https://images.unsplash.com/photo-1569718212165-3a2853961473?w=400", category: "bakery-snacks" },
  { id: "18", name: "Mayonnaise Eggless", unit: "500ml, Price", price: 8.99, image: "https://images.unsplash.com/photo-1472476440907-3720d516e2bc?w=400", category: "bakery-snacks" },
  { id: "19", name: "Basmati Rice", unit: "5kg, Price", price: 12.99, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", category: "rice" },
  { id: "20", name: "Mixed Pulses", unit: "1kg, Price", price: 6.49, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400", category: "pulses" },
  { id: "21", name: "Sunflower Oil", unit: "1L, Price", price: 9.99, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", category: "cooking-oil" },
  { id: "22", name: "Fresh Salmon", unit: "500g, Price", price: 14.99, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400", category: "meat" },
  { id: "23", name: "Whole Milk", unit: "1L, Price", price: 3.49, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", category: "dairy-eggs" },
  { id: "24", name: "Croissant Pack", unit: "6pcs, Price", price: 5.99, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", category: "bakery-snacks" },
];

export function searchCatalog(query: string, limit = 10): CatalogProduct[] {
  return smartSearch(query, limit);
}

const SYNONYMS: Record<string, string[]> = {
  fruit: ["fruits", "apple", "banana", "organic"],
  fruits: ["fruits", "apple", "banana"],
  vegetable: ["vegetables", "pepper", "ginger"],
  vegetables: ["vegetables", "pepper", "ginger"],
  egg: ["egg", "eggs", "dairy"],
  eggs: ["egg", "dairy-eggs"],
  drink: ["beverages", "juice", "coke", "pepsi", "sprite"],
  drinks: ["beverages", "juice"],
  beverage: ["beverages"],
  beverages: ["beverages"],
  juice: ["juice", "beverages"],
  milk: ["milk", "dairy"],
  dairy: ["dairy-eggs", "milk", "egg"],
  meat: ["meat", "chicken", "beef", "salmon"],
  chicken: ["chicken", "broiler", "meat"],
  rice: ["rice", "basmati"],
  pasta: ["pasta", "noodle"],
  noodle: ["noodle", "pasta"],
  noodles: ["noodle", "pasta"],
  snack: ["bakery", "croissant", "mayonnaise"],
  oil: ["oil", "sunflower"],
  organic: ["organic", "banana"],
  apple: ["apple", "fruits"],
  banana: ["banana", "fruits"],
};

export function smartSearch(query: string, limit = 10): CatalogProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return CATALOG.slice(0, limit);

  const terms = new Set<string>([q]);
  q.split(/\s+/).forEach((word) => {
    if (word.length > 2) terms.add(word);
    if (SYNONYMS[word]) SYNONYMS[word].forEach((s) => terms.add(s));
  });

  const scored = CATALOG.map((p) => {
    let score = 0;
    const name = p.name.toLowerCase();
    const cat = p.category.toLowerCase();
    const tagStr = (p.tags ?? []).join(" ").toLowerCase();

    for (const term of terms) {
      if (name.includes(term)) score += 10;
      if (cat.includes(term)) score += 8;
      if (tagStr.includes(term)) score += 6;
      if (name.startsWith(term)) score += 4;
    }

    if (/\bfruits?\b/.test(q) && cat === "fruits") score += 20;
    if (/\bvegetable/.test(q) && cat === "vegetables") score += 20;
    if (/\bbeverage|drink|juice/.test(q) && cat === "beverages") score += 20;
    if (/\begg/.test(q) && cat === "dairy-eggs") score += 15;
    if (/\bmeat|chicken|beef/.test(q) && cat === "meat") score += 20;
    if (/\bfresh\b/.test(q) && /\bfruits?\b/.test(q) && cat !== "fruits") score = Math.max(0, score - 15);

    return { product: p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) return scored.slice(0, limit).map((x) => x.product);

  return CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.includes(q))
  ).slice(0, limit);
}

export function getCatalogProduct(id: string): CatalogProduct | undefined {
  return CATALOG.find((p) => p.id === id);
}

export function toAppProduct(p: CatalogProduct) {
  return {
    id: p.id,
    name: p.name,
    unit: p.unit,
    price: p.price,
    image: p.image,
    category: p.category,
    description: p.description,
    tags: p.tags,
  };
}
