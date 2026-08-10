import { View, Text, ScrollView, Pressable, Image, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { filterProducts } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import SectionHeader from "@/components/SectionHeader";
import CarrotLogo from "@/components/CarrotLogo";
import AssistantBanner from "@/components/AssistantBanner";
import ReorderSection from "@/components/ReorderSection";
import { useLocationStore } from "@/store/useLocationStore";
import { Colors } from "@/constants/colors";

export default function Home() {
  const router = useRouter();
  const address = useLocationStore((s) => s.address);

  const exclusive = filterProducts({ tag: "exclusive" });
  const bestselling = filterProducts({ tag: "bestselling" });

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="px-5 pt-14">
        <CarrotLogo size={32} />

        <Pressable onPress={() => router.push("/location")} className="flex-row items-center justify-center mt-3 mb-4">
          <Ionicons name="location-outline" size={18} color={Colors.dark} />
          <Text className="text-dark font-medium ml-1 text-base">{address}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.dark} />
        </Pressable>

        <Pressable
          onPress={() => router.push("/search")}
          className="flex-row items-center bg-bg rounded-2xl px-4 py-4 mb-6"
        >
          <Ionicons name="search" size={20} color={Colors.muted} />
          <Text className="text-muted ml-3 text-base">Search Store</Text>
        </Pressable>

        <AssistantBanner />
        <ReorderSection />

        <View className="relative mb-8 rounded-2xl overflow-hidden">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800" }}
            className="w-full h-36"
            resizeMode="cover"
          />
          <View className="absolute inset-0 justify-center px-5">
            <Text className="text-dark text-2xl font-bold">Fresh Vegetables</Text>
            <Text className="text-primary text-base font-semibold mt-1">Get Up To 40% OFF</Text>
          </View>
        </View>

        <SectionHeader title="Exclusive Offer" onSeeAll={() => router.push({ pathname: "/search", params: { tag: "exclusive" } })} />
        <FlatList
          horizontal
          data={exclusive}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          renderItem={({ item }) => <ProductCard product={item} horizontal width={155} />}
        />

        <SectionHeader title="Best Selling" onSeeAll={() => router.push({ pathname: "/search", params: { tag: "bestselling" } })} />
        <FlatList
          horizontal
          data={bestselling}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          renderItem={({ item }) => <ProductCard product={item} horizontal width={155} />}
        />

        <SectionHeader title="Groceries" onSeeAll={() => router.push("/(tabs)/explore")} />
        <View className="flex-row flex-wrap justify-between gap-y-3 mb-4">
          {categories.slice(0, 2).map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </View>
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {filterProducts({ category: "meat" })
            .slice(0, 2)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </View>
      </View>
    </ScrollView>
  );
}
