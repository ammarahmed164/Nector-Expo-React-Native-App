import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AssistantProductImage from "@/components/AssistantProductImage";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";
import type { Product } from "@/data/products";

type Props = {
  products: Product[];
  onAdd: (product: Product) => void;
  onAddAll: () => void;
};

export default function AssistantProductStrip({ products, onAdd, onAddAll }: Props) {
  const router = useRouter();

  return (
    <View className="ml-10 mr-2 mb-4">
      <View className="bg-white rounded-2xl border border-line overflow-hidden shadow-sm">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-line bg-bg/50">
          <View className="flex-row items-center gap-2">
            <Ionicons name="bag-handle-outline" size={18} color={Colors.primary} />
            <Text className="text-dark text-sm font-semibold">Recommended Products</Text>
          </View>
          <Pressable onPress={onAddAll} className="bg-primary px-3 py-1.5 rounded-full">
            <Text className="text-white text-xs font-semibold">Add All</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 14, gap: 12 }}
        >
          {products.map((product) => (
            <View key={product.id} className="w-[140px]">
              <Pressable
                onPress={() => router.push(`/product/${product.id}`)}
                className="bg-bg rounded-xl overflow-hidden border border-line/60"
              >
                <View className="p-2 pb-0">
                  <AssistantProductImage uri={product.image} size={96} />
                </View>
                <View className="px-2.5 pb-2.5 pt-1">
                  <Text className="text-dark font-semibold text-[13px] leading-[18px]" numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text className="text-primary font-bold text-sm mt-1">{formatPrice(product.price)}</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => onAdd(product)}
                className="mt-2 flex-row items-center justify-center bg-primary rounded-xl py-2"
              >
                <Ionicons name="add-circle-outline" size={16} color="#fff" />
                <Text className="text-white text-xs font-semibold ml-1">Add</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
