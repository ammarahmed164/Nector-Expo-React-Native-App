import { View, Text, Image, Pressable, StyleSheet } from "react-native";
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
      className="flex-row items-center p-3.5 bg-white border border-line rounded-3xl mb-3"
      style={styles.card}
    >
      <View className="w-16 h-16 bg-canvas rounded-2xl items-center justify-center mr-4">
        <Image source={{ uri: product.image }} className="w-14 h-14 rounded-xl" resizeMode="contain" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-dark text-base">{product.name}</Text>
        <Text className="text-muted text-sm mt-1">{product.unit}</Text>
      </View>
      <Text className="font-semibold text-dark mr-3">{formatPrice(product.price)}</Text>
      <View className="w-8 h-8 rounded-xl bg-primarySoft items-center justify-center">
        <Ionicons name="chevron-forward" size={17} color={Colors.primary} />
      </View>
    </Pressable>
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
