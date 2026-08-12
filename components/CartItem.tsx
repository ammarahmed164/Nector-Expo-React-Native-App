import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartItem as CartItemType } from "@/store/useCartStore";
import { useCartStore } from "@/store/useCartStore";
import QuantitySelector from "./QuantitySelector";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

export default function CartItem({ item }: { item: CartItemType }) {
  const { incrementQty, decrementQty, removeFromCart } = useCartStore();
  return (
    <View className="flex-row items-center p-3.5 bg-white border border-line rounded-3xl mb-3" style={styles.card}>
      <View className="w-20 h-20 rounded-2xl bg-canvas items-center justify-center mr-3">
        <Image source={{ uri: item.product.image }} className="w-16 h-16 rounded-xl" resizeMode="contain" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-dark" numberOfLines={1}>{item.product.name}</Text>
        <Text className="text-muted text-xs mt-0.5 mb-2">{item.product.unit}</Text>
        <QuantitySelector
          qty={item.qty}
          onIncrement={() => incrementQty(item.product.id)}
          onDecrement={() => decrementQty(item.product.id)}
        />
      </View>
      <View className="items-end justify-between h-20 ml-2">
        <Pressable onPress={() => removeFromCart(item.product.id)} className="w-7 h-7 rounded-xl bg-canvas items-center justify-center">
          <Ionicons name="close" size={16} color={Colors.muted} />
        </Pressable>
        <Text className="font-bold text-dark">{formatPrice(item.product.price * item.qty)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
});
