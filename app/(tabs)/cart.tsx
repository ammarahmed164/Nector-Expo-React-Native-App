import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "@/store/useCartStore";
import CartItemRow from "@/components/CartItem";
import CheckoutSheet from "@/components/CheckoutSheet";
import Button from "@/components/Button";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

export default function Cart() {
  const router = useRouter();
  const { items, total, itemCount } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-canvas items-center justify-center px-8 pt-10">
        <View className="w-28 h-28 rounded-full bg-primarySoft items-center justify-center mb-6">
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center" style={styles.emptyIcon}>
            <Ionicons name="basket-outline" size={42} color={Colors.primary} />
          </View>
        </View>
        <Text className="text-2xl font-bold text-dark mb-2">Your basket is empty</Text>
        <Text className="text-muted text-center mb-7 leading-6">Fresh groceries are only a few taps away.</Text>
        <View className="w-full">
          <Button title="Start shopping" icon="storefront-outline" onPress={() => router.push("/(tabs)")} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas pt-14">
      <View className="px-5 flex-row items-end justify-between mb-5">
        <View>
          <Text className="text-muted text-xs font-medium uppercase tracking-widest">Your order</Text>
          <Text className="text-2xl font-bold text-dark mt-1">My basket</Text>
        </View>
        <View className="bg-primarySoft rounded-full px-3 py-1.5">
          <Text className="text-primary text-xs font-semibold">{itemCount()} items</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => <CartItemRow item={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 18 }}
        showsVerticalScrollIndicator={false}
      />

      <View className="bg-white border-t border-line px-5 pt-4 pb-5" style={styles.footer}>
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-muted text-xs">Basket subtotal</Text>
            <Text className="text-dark font-bold text-xl mt-0.5">{formatPrice(total())}</Text>
          </View>
          <View className="flex-row items-center bg-primarySoft rounded-xl px-3 py-2">
            <Ionicons name="cash-outline" size={16} color={Colors.primary} />
            <Text className="text-primary text-xs font-semibold ml-1.5">Cash on Delivery</Text>
          </View>
        </View>
        <Button title="Continue to checkout" icon="arrow-forward" onPress={() => setCheckoutOpen(true)} />
      </View>

      <CheckoutSheet visible={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 10,
  },
  emptyIcon: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
});
