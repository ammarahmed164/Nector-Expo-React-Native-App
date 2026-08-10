import { useCallback, useRef, useState } from "react";
import { View, Text, FlatList, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { sendAssistantMessage, type CartAction } from "@/lib/agentApi";
import { enrichAssistantProducts } from "@/lib/enrichProduct";
import { Colors } from "@/constants/colors";
import TypingIndicator from "@/components/TypingIndicator";
import AssistantHeader from "@/components/assistant/AssistantHeader";
import AssistantChatBubble from "@/components/assistant/AssistantChatBubble";
import AssistantProductStrip from "@/components/assistant/AssistantProductStrip";
import AssistantChatInput from "@/components/assistant/AssistantChatInput";
import type { Product } from "@/data/products";
import type { TextInput } from "react-native";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: Product[];
  cartActions?: CartAction[];
  time: string;
};

const QUICK_PROMPTS = [
  { label: "Fresh fruits", text: "Show me fresh fruits", icon: "nutrition-outline" as const },
  { label: "Breakfast", text: "Breakfast essentials", icon: "sunny-outline" as const },
  { label: "Beverages", text: "Find beverages and juices", icon: "water-outline" as const },
  { label: "Add eggs", text: "Add eggs to cart", icon: "cart-outline" as const },
];

const WELCOME = (name?: string) =>
  `Hello${name ? `, ${name}` : ""}! I'm your Nectar shopping assistant. Ask me to find products, plan meals, or add items to your cart — all in PKR.`;

function nowTime() {
  return new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
}

export default function AssistantScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addToCart);
  const addManyToCart = useCartStore((s) => s.addManyToCart);
  const cartCount = useCartStore((s) => s.itemCount());
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: WELCOME(user?.name?.split(" ")[0]), time: nowTime() },
  ]);

  const scrollToEnd = () => setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 120);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const applyCartActions = (actions: CartAction[]) => {
    actions.forEach((a) => addToCart(enrichAssistantProducts([a.product])[0], a.quantity));
    if (actions.length === 1) showToast(`Added ${actions[0].product.name} to cart`);
    else if (actions.length > 1) showToast(`Added ${actions.length} items to cart`);
  };

  const clearChat = () => {
    setMessages([{ id: "welcome-reset", role: "assistant", text: WELCOME(user?.name?.split(" ")[0]), time: nowTime() }]);
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text: trimmed, time: nowTime() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      scrollToEnd();

      const history = [...messages, userMsg]
        .filter((m) => m.id !== "welcome" && m.id !== "welcome-reset")
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text }));

      try {
        const res = await sendAssistantMessage(trimmed, user?.id ?? "guest", history.slice(0, -1), user?.name?.split(" ")[0]);
        const products = res.products?.length ? enrichAssistantProducts(res.products) : undefined;
        const cartActions = res.cartActions?.length
          ? res.cartActions.map((a) => ({ ...a, product: enrichAssistantProducts([a.product])[0] }))
          : undefined;

        if (cartActions?.length) applyCartActions(cartActions);

        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", text: res.reply, products, cartActions, time: nowTime() },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            role: "assistant",
            text: "Connection issue — please ensure the backend is running, then try again.",
            time: nowTime(),
          },
        ]);
      } finally {
        setLoading(false);
        scrollToEnd();
        inputRef.current?.focus();
      }
    },
    [loading, user?.id, user?.name, messages, addToCart]
  );

  const isWelcomeOnly = messages.length === 1;

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isWelcome = item.id === "welcome" || item.id === "welcome-reset";
    const isUser = item.role === "user";

    return (
      <View>
        <AssistantChatBubble text={item.text} time={item.time} isUser={isUser} isWelcome={isWelcome} />

        {!!item.cartActions?.length && (
          <View className="ml-10 mr-4 mb-3 -mt-1 flex-row items-center bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-2.5">
            <View className="w-7 h-7 rounded-full bg-primary/15 items-center justify-center">
              <Ionicons name="checkmark" size={16} color={Colors.primary} />
            </View>
            <Text className="text-primary text-sm font-medium ml-2.5 flex-1">
              {item.cartActions.length === 1
                ? `${item.cartActions[0].product.name} added to cart`
                : `${item.cartActions.length} items added to your cart`}
            </Text>
          </View>
        )}

        {!!item.products?.length && (
          <AssistantProductStrip
            products={item.products}
            onAdd={(p) => {
              addToCart(p, 1);
              showToast(`Added ${p.name}`);
            }}
            onAddAll={() => {
              addManyToCart(item.products!);
              showToast(`Added ${item.products!.length} items to cart`);
            }}
          />
        )}

        {isWelcomeOnly && index === 0 && (
          <View className="px-3 pb-2">
            <Text className="text-muted text-xs font-medium uppercase tracking-wider text-center mb-3">
              Quick suggestions
            </Text>
            <View className="flex-row flex-wrap justify-center gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <Pressable
                  key={prompt.text}
                  onPress={() => sendMessage(prompt.text)}
                  disabled={loading}
                  className="bg-white px-4 py-2.5 rounded-full border border-line flex-row items-center gap-2"
                  style={{ shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
                >
                  <Ionicons name={prompt.icon} size={15} color={Colors.primary} />
                  <Text className="text-dark text-sm font-medium">{prompt.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F4F6F5]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <View className="pt-14 flex-1">
        <AssistantHeader
          loading={loading}
          cartCount={cartCount}
          onBack={() => router.back()}
          onClear={clearChat}
          onCart={() => router.push("/(tabs)/cart")}
        />

        {/* Chat area */}
        <View className="flex-1 mx-0">
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 16, paddingBottom: 20 }}
            renderItem={renderMessage}
            ListFooterComponent={loading ? <TypingIndicator /> : null}
            onContentSizeChange={scrollToEnd}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>

        {!!toast && (
          <View
            className="absolute bottom-[108px] self-center bg-dark/95 px-5 py-3 rounded-full z-20"
            style={{ shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
          >
            <Text className="text-white text-sm font-medium">{toast}</Text>
          </View>
        )}

        <AssistantChatInput
          ref={inputRef}
          value={input}
          onChange={setInput}
          onSend={() => sendMessage(input)}
          loading={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
