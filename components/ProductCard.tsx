import { View, Text, Image, Pressable, DimensionValue, StyleSheet } from "react-native";
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
      style={[styles.card, { width: cardWidth }]}
      className="bg-white rounded-3xl p-3 border border-line mb-3"
    >
      <View className="bg-canvas rounded-2xl mb-3 px-2">
        <Image source={{ uri: product.image }} className="w-full h-28 rounded-xl" resizeMode="contain" />
      </View>
      <Text className="font-semibold text-dark text-[15px]" numberOfLines={1}>
        {product.name}
      </Text>
      <Text className="text-muted text-xs mt-0.5 mb-3">{product.unit}</Text>
      <View className="flex-row items-center justify-between">
        <Text className="font-bold text-dark text-base">{formatPrice(product.price)}</Text>
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            addToCart(product, 1);
          }}
          className="w-10 h-10 rounded-2xl bg-primary items-center justify-center"
          style={styles.addButton}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>
      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          toggleFavourite(product);
        }}
        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white items-center justify-center"
        style={styles.favouriteButton}
      >
          <Ionicons
            name={isFavourite(product.id) ? "heart" : "heart-outline"}
            size={18}
            color={isFavourite(product.id) ? Colors.danger : Colors.muted}
          />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 11,
    elevation: 2,
  },
  addButton: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 3,
  },
  favouriteButton: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});
