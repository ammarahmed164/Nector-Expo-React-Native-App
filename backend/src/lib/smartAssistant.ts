import { CATALOG, getCatalogProduct, smartSearch, toAppProduct, type CatalogProduct } from "../data/catalog";

export type CartAction = {
  productId: string;
  quantity: number;
  product: ReturnType<typeof toAppProduct>;
};

export type AssistantResult = {
  reply: string;
  products: ReturnType<typeof toAppProduct>[];
  cartActions: CartAction[];
  source: "smart" | "gemini";
};

const PKR = (usd: number) => `Rs. ${Math.round(usd * 280).toLocaleString("en-PK")}`;

const RECIPE_PACKS: Record<string, { label: string; productIds: string[]; tip: string }> = {
  breakfast: {
    label: "Breakfast Essentials",
    productIds: ["4", "23", "1", "24"],
    tip: "Perfect for a quick Pakistani breakfast — eggs, milk, fruit, and bakery items.",
  },
  pasta: {
    label: "Pasta Night",
    productIds: ["16", "17", "21", "18"],
    tip: "Everything you need for a simple pasta dinner at home.",
  },
  bbq: {
    label: "BBQ & Grill",
    productIds: ["6", "7", "3", "5"],
    tip: "Meat and veggies for a weekend BBQ spread.",
  },
  beverages: {
    label: "Drinks & Refreshments",
    productIds: ["11", "12", "9", "13"],
    tip: "Juices and soft drinks for the family.",
  },
  "healthy week": {
    label: "Healthy Weekly Shop",
    productIds: ["1", "2", "3", "19", "20", "23"],
    tip: "Balanced staples — fruits, vegetables, rice, pulses, and milk.",
  },
};

const STOP_WORDS = new Set([
  "show", "find", "need", "want", "some", "the", "for", "and", "with", "please",
  "can", "you", "give", "get", "buy", "add", "cart", "my", "me", "a", "an",
]);

function packToResult(pack: (typeof RECIPE_PACKS)[string], addAll = false): AssistantResult {
  const products = pack.productIds
    .map((id) => getCatalogProduct(id))
    .filter(Boolean)
    .map((p) => toAppProduct(p!));

  const cartActions: CartAction[] = addAll
    ? products.map((product) => ({ productId: product.id, quantity: 1, product }))
    : [];

  const names = products.map((p) => p.name).join(", ");
  const reply = addAll
    ? `Done! I've added your **${pack.label}** pack to the cart: ${names}. ${pack.tip}`
    : `Here's my **${pack.label}** suggestion:\n\n${names}\n\n${pack.tip}\n\nTap **Add All** on any item or say "add all to cart".`;

  return { reply: reply.replace(/\*\*/g, ""), products, cartActions, source: "smart" };
}

function findBestProduct(query: string): CatalogProduct | undefined {
  const results = smartSearch(query, 1);
  return results[0];
}

function parseAddToCart(message: string): { query: string; qty: number } | null {
  const patterns = [
    /add\s+(?:(\d+)\s+)?(.+?)\s+to\s+(?:my\s+)?cart/i,
    /buy\s+(?:(\d+)\s+)?(.+)/i,
    /get\s+me\s+(?:(\d+)\s+)?(.+)/i,
    /i\s+need\s+(?:(\d+)\s+)?(.+)/i,
  ];
  for (const re of patterns) {
    const m = message.match(re);
    if (m) return { qty: Math.max(1, Number(m[1] ?? 1)), query: m[2].trim() };
  }
  return null;
}

function detectRecipeIntent(message: string): string | null {
  const lower = message.toLowerCase();
  if (/breakfast/.test(lower)) return "breakfast";
  if (/pasta|noodle/.test(lower)) return "pasta";
  if (/bbq|grill|barbecue/.test(lower)) return "bbq";
  if (/drink|beverage|juice|refreshment/.test(lower)) return "beverages";
  if (/healthy|diet|clean eating/.test(lower)) return "healthy week";
  return null;
}

function buildSearchReply(query: string, products: CatalogProduct[]): string {
  if (products.length === 0) {
    return `I couldn't find "${query}" in our store right now. Try searching by category: fruits, vegetables, meat, dairy, beverages, rice, or pulses.`;
  }
  const lines = products.slice(0, 6).map((p, i) => `${i + 1}. **${p.name}** — ${PKR(p.price)} (${p.unit})`);
  return `I found ${products.length} match${products.length > 1 ? "es" : ""} for "${query}":\n\n${lines.join("\n")}\n\nTap a product below to view details or add to your cart.`;
}

export function runSmartAssistant(message: string, userName?: string): AssistantResult {
  const text = message.trim();
  const lower = text.toLowerCase();
  const ctx: { products: Map<string, ReturnType<typeof toAppProduct>>; cartActions: CartAction[] } = {
    products: new Map(),
    cartActions: [],
  };

  const greeting = /^(hi|hello|hey|salam|assalam|good morning|good evening)/i.test(lower);
  if (greeting) {
    const name = userName ? `, ${userName}` : "";
    return {
      reply: `Hello${name}! I'm your Nectar shopping assistant. I can:\n\n• Find products instantly\n• Build carts from recipes\n• Add items directly to your basket\n\nTry: "Show me fruits" or "Breakfast essentials"`,
      products: [],
      cartActions: [],
      source: "smart",
    };
  }

  if (/help|what can you do|how do you work/.test(lower)) {
    return {
      reply:
        "I'm here to make grocery shopping easy:\n\n1. **Search** — \"Find organic fruits\" or \"Show beverages\"\n2. **Recipes** — \"Breakfast essentials\" or \"Pasta night\"\n3. **Add to cart** — \"Add 2 eggs to cart\" or \"Buy milk\"\n4. **Categories** — fruits, vegetables, meat, dairy, beverages, rice, pulses\n\nPrices are shown in Pakistani Rupees (PKR).",
      products: [],
      cartActions: [],
      source: "smart",
    };
  }

  if (/add all|add everything|add these/.test(lower)) {
    return {
      reply: "Sure — tap **Add All** on the product cards below, or tell me exactly which items you'd like in your cart.",
      products: [],
      cartActions: [],
      source: "smart",
    };
  }

  const recipeKey = detectRecipeIntent(text);
  if (recipeKey && RECIPE_PACKS[recipeKey]) {
    const addAll = /add|cart|buy|get/.test(lower);
    return packToResult(RECIPE_PACKS[recipeKey], addAll);
  }

  const addReq = parseAddToCart(text);
  if (addReq) {
    const product = findBestProduct(addReq.query);
    if (!product) {
      const similar = smartSearch(addReq.query, 4);
      return {
        reply: `I couldn't find "${addReq.query}". ${similar.length ? "Did you mean one of these?" : "Try a different product name."}`,
        products: similar.map(toAppProduct),
        cartActions: [],
        source: "smart",
      };
    }
    const appProduct = toAppProduct(product);
    return {
      reply: `Added **${addReq.qty}× ${product.name}** (${PKR(product.price)} each) to your cart. Anything else?`,
      products: [appProduct],
      cartActions: [{ productId: product.id, quantity: addReq.qty, product: appProduct }],
      source: "smart",
    };
  }

  if (/categor|what do you sell|what's available/.test(lower)) {
    const cats = [...new Set(CATALOG.map((p) => p.category))];
    return {
      reply: `We stock these categories:\n\n${cats.map((c) => `• ${c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")}`).join("\n")}\n\nAsk me about any category!`,
      products: [],
      cartActions: [],
      source: "smart",
    };
  }

  if (/exclusive|offer|deal|bestselling|sale/.test(lower)) {
    const tagged = CATALOG.filter((p) => p.tags?.length).slice(0, 6);
    return {
      reply: buildSearchReply("special offers", tagged).replace(/\*\*/g, ""),
      products: tagged.map(toAppProduct),
      cartActions: [],
      source: "smart",
    };
  }

  const words = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  let found = smartSearch(text, 8);
  if (found.length === 0) {
    for (const word of words) {
      found = smartSearch(word, 8);
      if (found.length > 0) break;
    }
  }

  if (found.length === 0) {
    return {
      reply: "I'm not sure I understood that. Try asking:\n\n• \"Show me fruits\"\n• \"Breakfast essentials\"\n• \"Add eggs to cart\"\n• \"Find beverages\"",
      products: [],
      cartActions: [],
      source: "smart",
    };
  }

  found.forEach((p) => ctx.products.set(p.id, toAppProduct(p)));
  const mainQuery = words.join(" ") || text;
  return {
    reply: buildSearchReply(mainQuery, found).replace(/\*\*/g, ""),
    products: [...ctx.products.values()],
    cartActions: [],
    source: "smart",
  };
}

export type ChatTurn = { role: "user" | "assistant"; text: string };
