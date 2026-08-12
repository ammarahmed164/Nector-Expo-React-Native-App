import { useCallback, useState } from "react";
import { View, Text, FlatList, Image, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { fetchReorderSuggestions, type ReorderSuggestion } from "@/lib/agentApi";
import { getLocalReorderSuggestions } from "@/lib/localReorder";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

export default function ReorderSection() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const addToCart = useCartStore((s) => s.addToCart);
  const addManyToCart = useCartStore((s) => s.addManyToCart);
  const [items, setItems] = useState<ReorderSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const profileId = user?.id ?? "guest";

    try {
      const res = await fetchReorderSuggestions(profileId);
      if (res.suggestions.length > 0) {
        setItems(res.suggestions);
      } else {
        setItems(getLocalReorderSuggestions(profileId, orders));
      }
    } catch {
      setItems(getLocalReorderSuggestions(profileId, orders));
    } finally {
      setLoading(false);
    }
  }, [user?.id, orders]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <View className="mb-6 items-center py-6">
        <ActivityIndicator color={Colors.primary} />
        <Text className="text-muted text-sm mt-2">Loading smart reorder suggestions...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="mb-6 bg-white rounded-3xl p-5 border border-line">
        <View className="flex-row items-center mb-2">
          <Ionicons name="refresh-circle-outline" size={22} color={Colors.primary} />
          <Text className="text-dark font-semibold text-lg ml-2">Smart Reorder</Text>
        </View>
        <Text className="text-muted leading-6">
          Place your first order and we&apos;ll suggest items to buy again automatically.
        </Text>
      </View>
    );
  }

  const title = items[0]?.reason === "frequent" ? "Buy Again — Your Favorites" : "Smart Reorder — Last Order";

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-dark font-semibold text-xl">{title}</Text>
          <Text className="text-muted text-sm mt-0.5">Powered by Smart Reorder Agent</Text>
        </View>
        <Pressable
          onPress={() => addManyToCart(items)}
          className="bg-primarySoft px-3 py-2 rounded-full"
        >
          <Text className="text-primary text-sm font-semibold">Add All</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/product/${item.id}`)}
            className="w-40 bg-white border border-line rounded-3xl p-3"
          >
            <Image source={{ uri: item.image }} className="w-full h-24 rounded-xl mb-2" resizeMode="contain" />
            <Text className="text-dark font-medium text-sm" numberOfLines={2}>
              {item.name}
            </Text>
            <Text className="text-muted text-xs mt-1">{formatPrice(item.price)}</Text>
            {item.orderCount > 1 && (
              <Text className="text-primary text-xs mt-1">Ordered {item.orderCount}x</Text>
            )}
            <Pressable
              onPress={() => addToCart(item, 1)}
              className="mt-2 flex-row items-center justify-center bg-primary rounded-xl py-2.5"
            >
              <Ionicons name="cart-outline" size={14} color="#fff" />
              <Text className="text-white text-xs font-semibold ml-1">Reorder</Text>
            </Pressable>
          </Pressable>
        )}
      />
    </View>
  );
}
