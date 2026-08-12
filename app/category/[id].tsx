import { useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { filterProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { exploreCategories } from "@/data/exploreCategories";
import ProductCard from "@/components/ProductCard";
import { useFilterStore } from "@/store/useFilterStore";
import { Colors } from "@/constants/colors";

export default function CategoryPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { category: filterCategory, brand, sort, activeCount } = useFilterStore();

  const title = useMemo(() => {
    const homeCategory = categories.find((category) => category.id === id);
    const exploreCategory = exploreCategories.find((category) => category.id === id);
    return exploreCategory?.name ?? homeCategory?.name ?? "Category";
  }, [id]);

  const filtered = useMemo(() => {
    const homeProducts = filterProducts({ category: id });
    const baseList = homeProducts.length ? homeProducts : filterProducts({ exploreCategory: id });
    return filterProducts({ baseList, filterCategory, brand, sort });
  }, [id, filterCategory, brand, sort]);

  const filtersActive = activeCount() > 0;

  return (
    <View className="flex-1 bg-canvas pt-14">
      <View className="flex-row items-center px-5 mb-4">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-2xl bg-white border border-line items-center justify-center">
          <Ionicons name="chevron-back" size={22} color={Colors.dark} />
        </Pressable>
        <View className="flex-1 items-center px-2">
          <Text className="text-xl font-semibold text-dark text-center" numberOfLines={1}>{title}</Text>
          <Text className="text-muted text-xs mt-0.5">{filtered.length} fresh products</Text>
        </View>
        <Pressable onPress={() => router.push("/filter")} className="relative w-10 h-10 rounded-2xl bg-white border border-line items-center justify-center">
          <Ionicons name="options-outline" size={20} color={Colors.dark} />
          {filtersActive && <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-canvas" />}
        </Pressable>
      </View>

      {filtersActive && (
        <Pressable onPress={() => router.push("/filter")} className="mx-5 mb-3 self-start bg-primarySoft rounded-full px-3 py-1.5">
          <Text className="text-primary text-xs font-semibold">{activeCount()} filter(s) applied · tap to edit</Text>
        </Pressable>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 12 }}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
        ListEmptyComponent={
          <Text className="text-muted text-center mt-10 px-6">No products match your filters. Try adjusting or clearing them.</Text>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
  );
}
