import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { useOrderStore } from "@/store/useOrderStore";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

export default function OrderHistory() {
  const orders = useOrderStore((state) => state.orders);

  return (
    <View className="flex-1 bg-canvas pt-14">
      <Header title="My orders" subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"}`} />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-5 pb-16">
            <View className="w-24 h-24 rounded-full bg-primarySoft items-center justify-center mb-5">
              <Ionicons name="receipt-outline" size={38} color={Colors.primary} />
            </View>
            <Text className="text-dark text-xl font-semibold">No orders yet</Text>
            <Text className="text-muted text-center mt-2 leading-6">Your confirmed orders and delivery progress will appear here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white border border-line rounded-3xl p-4 mb-4">
            <View className="flex-row items-start justify-between mb-4">
              <View>
                <Text className="font-semibold text-dark">{item.id}</Text>
                <Text className="text-muted text-xs mt-1">{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <View className="bg-primarySoft rounded-full px-3 py-1">
                <Text className="text-primary text-[10px] font-semibold capitalize">{item.status}</Text>
              </View>
            </View>
            <View className="h-px bg-line mb-4" />
            <View className="flex-row items-center mb-2">
              <Ionicons name="bicycle-outline" size={17} color={Colors.muted} />
              <Text className="text-muted text-sm ml-2 flex-1">{item.deliveryMethod}</Text>
              <Text className="text-dark text-sm font-semibold">{formatPrice(item.total)}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="cash-outline" size={17} color={Colors.muted} />
              <Text className="text-muted text-sm ml-2 flex-1">{item.paymentLabel}</Text>
              <Text className="text-muted text-xs">{item.items.length} item{item.items.length === 1 ? "" : "s"}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
