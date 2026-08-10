import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { useOrderStore } from "@/store/useOrderStore";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

export default function OrderHistory() {
  const router = useRouter();
  const orders = useOrderStore((s) => s.orders);

  return (
    <View className="flex-1 bg-white pt-14">
      <Header title="Orders" />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListEmptyComponent={
          <Text className="text-muted text-center mt-16">No orders yet. Place your first order from the cart.</Text>
        }
        renderItem={({ item }) => (
          <View className="border border-line rounded-2xl p-4 mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="font-semibold text-dark">{item.id}</Text>
              <Text className="text-primary capitalize">{item.status}</Text>
            </View>
            <Text className="text-muted mb-1">{item.deliveryMethod}</Text>
            <Text className="text-muted mb-2">{new Date(item.createdAt).toLocaleString()}</Text>
            <Text className="font-semibold text-dark">{formatPrice(item.total)}</Text>
            <Text className="text-muted mt-2">{item.items.length} item(s)</Text>
          </View>
        )}
      />
      <Pressable onPress={() => router.back()} className="absolute bottom-8 self-center">
        <Text style={{ color: Colors.primary }} className="font-semibold">Back</Text>
      </Pressable>
    </View>
  );
}
