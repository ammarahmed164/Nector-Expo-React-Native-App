import { useEffect, useMemo, useState } from "react";
import { View, TextInput, FlatList, Pressable, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { filterProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useFilterStore } from "@/store/useFilterStore";
import { Colors } from "@/constants/colors";

export default function Search() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; tag?: string }>();
  const { category: filterCategory, brand, sort, activeCount } = useFilterStore();
  const [query, setQuery] = useState(params.q?.toString() ?? "");

  useEffect(() => {
    if (params.q) setQuery(params.q.toString());
  }, [params.q]);

  const results = useMemo(
    () =>
      filterProducts({
        query,
        filterCategory,
        brand,
        sort,
        tag: params.tag?.toString() ?? null,
      }),
    [query, filterCategory, brand, sort, params.tag]
  );

  return (
    <View className="flex-1 bg-canvas pt-14 px-5">
      <View className="flex-row items-center gap-3 mb-5">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-2xl bg-white border border-line items-center justify-center">
          <Ionicons name="chevron-back" size={22} color={Colors.dark} />
        </Pressable>
        <View className="flex-1 h-12 flex-row items-center bg-white border border-line rounded-2xl px-4">
          <Ionicons name="search" size={18} color={Colors.primary} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search Store"
            className="ml-2 flex-1 text-base"
          />
          {!!query && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={Colors.muted} />
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => router.push("/filter")} className="relative w-10 h-10 rounded-2xl bg-white border border-line items-center justify-center">
          <Ionicons name="options-outline" size={22} color={Colors.dark} />
          {activeCount() > 0 && (
            <View className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary" />
          )}
        </Pressable>
      </View>

      {activeCount() > 0 && (
        <Pressable onPress={() => router.push("/filter")} className="self-start bg-primarySoft rounded-full px-3 py-1.5 mb-3">
          <Text className="text-primary text-xs font-semibold">{activeCount()} filter(s) applied</Text>
        </Pressable>
      )}

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-dark font-semibold text-lg" numberOfLines={1}>{query ? `Results for “${query}”` : "All products"}</Text>
        <Text className="text-muted text-xs ml-2">{results.length} items</Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<Text className="text-muted text-center mt-10">No products found. Try another search.</Text>}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
  );
}
