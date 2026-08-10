import { apiGet, apiPost } from "@/lib/api";
import type { Product } from "@/data/products";

export type CartAction = {
  productId: string;
  quantity: number;
  product: Product;
};

export type ChatTurn = {
  role: "user" | "assistant";
  text: string;
};

export type AssistantResponse = {
  reply: string;
  products: Product[];
  cartActions: CartAction[];
  source?: "smart" | "gemini";
};

export type ReorderSuggestion = Product & {
  orderCount: number;
  reason: "frequent" | "buy_again";
};

export async function sendAssistantMessage(
  message: string,
  profileId: string,
  history: ChatTurn[] = [],
  userName?: string
) {
  return apiPost<AssistantResponse>("/agent/chat", { message, profileId, history, userName });
}

export async function fetchReorderSuggestions(profileId: string) {
  return apiGet<{ suggestions: ReorderSuggestion[] }>(`/agent/reorder-suggestions/${profileId}`);
}
