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
    const homeCategory = categories.find((c) => c.id === id);
    const exploreCategory = exploreCategories.find((c) => c.id === id);
    return exploreCategory?.name ?? homeCategory?.name ?? "Category";
  }, [id]);

  const filtered = useMemo(() => {
    const byHome = filterProducts({ category: id });
    const baseList = byHome.length ? byHome : filterProducts({ exploreCategory: id });
    return filterProducts({
      baseList,
      filterCategory,
      brand,
      sort,
    });
  }, [id, filterCategory, brand, sort]);

  const filtersActive = activeCount() > 0;

  return (
    <View className="flex-1 bg-white pt-14">
      <View className="flex-row items-center px-5 mb-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </Pressable>
        <Text className="flex-1 text-center text-2xl font-semibold text-dark mr-6">{title}</Text>
        <Pressable onPress={() => router.push("/filter")} className="relative">
          <Ionicons name="options-outline" size={22} color={Colors.dark} />
          {filtersActive && (
            <View className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary" />
          )}
        </Pressable>
      </View>

      {filtersActive && (
        <Pressable onPress={() => router.push("/filter")} className="mx-5 mb-2">
          <Text className="text-primary text-sm">{activeCount()} filter(s) applied — tap to edit</Text>
        </Pressable>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 12 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        ListEmptyComponent={
          <Text className="text-muted text-center mt-10 px-6">
            No products match your filters. Try adjusting or clearing filters.
          </Text>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
  );
}
