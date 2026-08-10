import { View, Text, Image, Pressable, DimensionValue } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useFavouriteStore } from "@/store/useFavouriteStore";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

type Props = {
  product: Product;
  width?: DimensionValue;
  horizontal?: boolean;
};

export default function ProductCard({ product, width, horizontal }: Props) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const { toggleFavourite, isFavourite } = useFavouriteStore();
  const cardWidth: DimensionValue = width ?? (horizontal ? 155 : "47%");

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      style={{ width: cardWidth }}
      className="bg-white rounded-[18px] p-3 border border-line mb-3"
    >
      <Image source={{ uri: product.image }} className="w-full h-28 rounded-xl mb-3" resizeMode="contain" />
      <Text className="font-semibold text-dark text-base" numberOfLines={1}>
        {product.name}
      </Text>
      <Text className="text-muted text-xs mb-3">{product.unit}</Text>
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-dark text-lg">{formatPrice(product.price)}</Text>
        <Pressable
          onPress={() => addToCart(product, 1)}
          className="w-11 h-11 rounded-full bg-primary items-center justify-center"
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>
      {!horizontal && (
        <Pressable onPress={() => toggleFavourite(product)} className="absolute top-5 right-5">
          <Ionicons
            name={isFavourite(product.id) ? "heart" : "heart-outline"}
            size={18}
            color={isFavourite(product.id) ? Colors.danger : Colors.muted}
          />
        </Pressable>
      )}
    </Pressable>
  );
}
