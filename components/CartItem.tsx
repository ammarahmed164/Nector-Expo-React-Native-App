import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartItem as CartItemType } from "@/store/useCartStore";
import { useCartStore } from "@/store/useCartStore";
import QuantitySelector from "./QuantitySelector";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

export default function CartItem({ item }: { item: CartItemType }) {
  const { incrementQty, decrementQty, removeFromCart } = useCartStore();
  return (
    <View className="flex-row items-center py-3 border-b border-line">
      <Image source={{ uri: item.product.image }} className="w-16 h-16 rounded-xl mr-3" />
      <View className="flex-1">
        <Text className="font-medium text-dark">{item.product.name}</Text>
        <Text className="text-muted text-xs mb-2">{item.product.unit}</Text>
        <QuantitySelector
          qty={item.qty}
          onIncrement={() => incrementQty(item.product.id)}
          onDecrement={() => decrementQty(item.product.id)}
        />
      </View>
      <View className="items-end justify-between h-16">
        <Pressable onPress={() => removeFromCart(item.product.id)}>
          <Ionicons name="close" size={18} color={Colors.muted} />
        </Pressable>
        <Text className="font-semibold text-dark">{formatPrice(item.product.price * item.qty)}</Text>
      </View>
    </View>
  );
}
