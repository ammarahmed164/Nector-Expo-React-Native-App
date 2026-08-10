import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

export default function FavouriteRow({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      className="flex-row items-center py-4 border-b border-line"
    >
      <Image source={{ uri: product.image }} className="w-16 h-16 rounded-xl mr-4" resizeMode="contain" />
      <View className="flex-1">
        <Text className="font-semibold text-dark text-base">{product.name}</Text>
        <Text className="text-muted text-sm mt-1">{product.unit}</Text>
      </View>
      <Text className="font-semibold text-dark mr-3">{formatPrice(product.price)}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
    </Pressable>
  );
}
