import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { listOrders } from "./adminStore";
import { CATALOG, getCatalogProduct, smartSearch, toAppProduct } from "../data/catalog";
import { runSmartAssistant, type AssistantResult, type CartAction, type ChatTurn } from "./smartAssistant";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export type { AssistantResult, CartAction, ChatTurn } from "./smartAssistant";

const tools = [
  {
    functionDeclarations: [
      {
        name: "search_products",
        description: "Search Nectar grocery catalog by product name, category (fruits, vegetables, meat, dairy-eggs, beverages, rice, pulses, bakery-snacks, cooking-oil), or tag",
        parameters: {
          type: SchemaType.OBJECT,
          properties: { query: { type: SchemaType.STRING, description: "Short search term e.g. eggs, fruits, milk" } },
          required: ["query"],
        },
      },
      {
        name: "get_product_details",
        description: "Get details for one product by its id",
        parameters: {
          type: SchemaType.OBJECT,
          properties: { productId: { type: SchemaType.STRING } },
          required: ["productId"],
        },
      },
      {
        name: "add_to_cart",
        description: "Add a product to the user's cart. Always confirm product exists first.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            productId: { type: SchemaType.STRING },
            quantity: { type: SchemaType.NUMBER },
          },
          required: ["productId", "quantity"],
        },
      },
      {
        name: "list_categories",
        description: "List all product categories available in the store",
        parameters: { type: SchemaType.OBJECT, properties: {} },
      },
    ],
  },
];

type ToolContext = {
  cartActions: AssistantResult["cartActions"];
  products: Map<string, ReturnType<typeof toAppProduct>>;
};

function executeTool(name: string, input: any, ctx: ToolContext) {
  switch (name) {
    case "search_products": {
      const found = smartSearch(String(input.query ?? ""), 8);
      found.forEach((p) => ctx.products.set(p.id, toAppProduct(p)));
      return found.map((p) => ({ id: p.id, name: p.name, price: p.price, unit: p.unit, category: p.category }));
    }
    case "get_product_details": {
      const product = getCatalogProduct(String(input.productId ?? ""));
      if (product) ctx.products.set(product.id, toAppProduct(product));
      return product ? toAppProduct(product) : { error: "Product not found" };
    }
    case "add_to_cart": {
      const product = getCatalogProduct(String(input.productId ?? ""));
      const quantity = Math.max(1, Number(input.quantity ?? 1));
      if (!product) return { error: "Product not found" };
      const appProduct = toAppProduct(product);
      ctx.products.set(product.id, appProduct);
      ctx.cartActions.push({ productId: product.id, quantity, product: appProduct });
      return { ok: true, name: product.name, quantity };
    }
    case "list_categories":
      return [...new Set(CATALOG.map((p) => p.category))];
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

function buildSystemInstruction(userName?: string) {
  const name = userName ? ` The customer's name is ${userName}.` : "";
  return `You are Nectar AI — a professional, warm grocery shopping assistant for a Pakistan-based app (Nectar).${name}

Rules:
- Prices in catalog are USD base; tell users prices are shown in PKR (Rs.) in the app.
- ALWAYS use tools to search or add products. Never invent product names or IDs.
- Keep replies concise (2-4 sentences), helpful, and action-oriented.
- When suggesting products, mention name and that user can tap to add to cart.
- For recipes (breakfast, pasta, BBQ), search relevant items and suggest a complete list.
- When adding to cart, use add_to_cart tool and confirm what was added.
- Be friendly but professional — like a knowledgeable store assistant.`;
}

async function runGeminiAssistant(
  message: string,
  history: ChatTurn[],
  userName?: string
): Promise<AssistantResult | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  const ctx: ToolContext = { cartActions: [], products: new Map() };

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: buildSystemInstruction(userName),
      tools,
    });

    const geminiHistory = history.slice(-8).map((h) => ({
      role: h.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: h.text }],
    }));

    const chat = model.startChat({ history: geminiHistory });
    let result = await chat.sendMessage(message);
    let functionCalls = result.response.functionCalls();

    let loops = 0;
    while (functionCalls && functionCalls.length > 0 && loops < 6) {
      loops++;
      const responses = functionCalls.map((call) => ({
        functionResponse: {
          name: call.name,
          response: { result: executeTool(call.name, call.args, ctx) },
        },
      }));
      result = await chat.sendMessage(responses);
      functionCalls = result.response.functionCalls();
    }

    const reply = result.response.text()?.trim();
    if (!reply) return null;

    return {
      reply,
      products: [...ctx.products.values()],
      cartActions: ctx.cartActions,
      source: "gemini",
    };
  } catch {
    return null;
  }
}

export async function runShoppingAssistant(
  message: string,
  profileId?: string,
  history: ChatTurn[] = [],
  userName?: string
): Promise<AssistantResult> {
  const geminiResult = await runGeminiAssistant(message, history, userName);

  if (geminiResult && geminiResult.reply.length > 10) {
    if (geminiResult.products.length === 0 && geminiResult.cartActions.length === 0) {
      const smart = runSmartAssistant(message, userName);
      if (smart.products.length > 0 || smart.cartActions.length > 0) {
        return {
          ...smart,
          reply: `${geminiResult.reply}\n\n${smart.reply}`,
          source: "gemini",
        };
      }
    }
    return geminiResult;
  }

  return runSmartAssistant(message, userName);
}

export type ReorderSuggestion = ReturnType<typeof toAppProduct> & {
  orderCount: number;
  reason: "frequent" | "buy_again";
};

export function detectReorderCandidates(profileId: string): ReorderSuggestion[] {
  const userOrders = listOrders().filter((o) => o.userId === profileId);
  if (userOrders.length === 0) return [];

  const counts = new Map<string, { count: number; name: string; price: number; unit?: string }>();

  for (const order of userOrders) {
    const seenInOrder = new Set<string>();
    for (const item of order.items) {
      const entry = counts.get(item.productId) ?? {
        count: 0,
        name: item.name,
        price: item.price,
        unit: item.unit,
      };
      if (!seenInOrder.has(item.productId)) {
        entry.count += 1;
        seenInOrder.add(item.productId);
      }
      counts.set(item.productId, entry);
    }
  }

  const frequent = [...counts.entries()]
    .filter(([, v]) => v.count >= 2)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([productId, v]) => {
      const catalog = getCatalogProduct(productId);
      const base = catalog
        ? toAppProduct(catalog)
        : {
            id: productId,
            name: v.name,
            unit: v.unit ?? "1 unit",
            price: v.price,
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
            category: "groceries",
          };
      return { ...base, orderCount: v.count, reason: "frequent" as const };
    });

  if (frequent.length > 0) return frequent.slice(0, 8);

  const lastOrder = userOrders[0];
  const buyAgain: ReorderSuggestion[] = [];
  const added = new Set<string>();

  for (const item of lastOrder.items) {
    if (added.has(item.productId)) continue;
    added.add(item.productId);
    const catalog = getCatalogProduct(item.productId);
    const base = catalog
      ? toAppProduct(catalog)
      : {
          id: item.productId,
          name: item.name,
          unit: item.unit ?? "1 unit",
          price: item.price,
          image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
          category: "groceries",
        };
    buyAgain.push({ ...base, orderCount: 1, reason: "buy_again" });
  }

  return buyAgain.slice(0, 6);
}
