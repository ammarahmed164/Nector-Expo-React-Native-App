import { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/useCartStore";
import CartItemRow from "@/components/CartItem";
import CheckoutSheet from "@/components/CheckoutSheet";
import { formatPrice } from "@/lib/formatPrice";

export default function Cart() {
  const router = useRouter();
  const { items, total } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8 pt-14">
        <Text className="text-2xl font-semibold text-dark mb-2">Your cart is empty</Text>
        <Text className="text-muted text-center mb-6">Add items to get started</Text>
        <Pressable onPress={() => router.push("/(tabs)")} className="bg-primary rounded-full px-8 py-4">
          <Text className="text-white font-semibold">Start Shopping</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-14 px-5">
      <Text className="text-2xl font-semibold text-dark text-center mb-6">My Cart</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => <CartItemRow item={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <Pressable onPress={() => setCheckoutOpen(true)} className="mb-4">
        <View className="bg-primary rounded-full h-[67px] flex-row items-center px-6">
          <Text className="text-white font-semibold text-lg flex-1 text-center">Go to Checkout</Text>
          <View className="bg-[#489E70] rounded-full px-4 py-2 absolute right-2">
            <Text className="text-white font-semibold">{formatPrice(total())}</Text>
          </View>
        </View>
      </Pressable>
      <CheckoutSheet visible={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </View>
  );
}
