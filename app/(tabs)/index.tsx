import { View, Text, ScrollView, Pressable, Image, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { filterProducts } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import SectionHeader from "@/components/SectionHeader";
import CarrotLogo from "@/components/CarrotLogo";
import AssistantBanner from "@/components/AssistantBanner";
import ReorderSection from "@/components/ReorderSection";
import { useLocationStore } from "@/store/useLocationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Colors } from "@/constants/colors";

export default function Home() {
  const router = useRouter();
  const address = useLocationStore((state) => state.address);
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.split(" ")[0] || "there";

  const exclusive = filterProducts({ tag: "exclusive" });
  const bestselling = filterProducts({ tag: "bestselling" });

  return (
    <ScrollView className="flex-1 bg-canvas" contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View className="px-5 pt-14">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-1">
            <Text className="text-muted text-xs font-medium uppercase tracking-widest">Welcome back</Text>
            <Text className="text-dark text-2xl font-bold mt-1">Hi, {firstName} 👋</Text>
            <Pressable onPress={() => router.push("/location")} className="flex-row items-center mt-2 self-start">
              <View className="w-6 h-6 rounded-lg bg-primarySoft items-center justify-center">
                <Ionicons name="location" size={14} color={Colors.primary} />
              </View>
              <Text className="text-muted font-medium ml-2 text-sm" numberOfLines={1}>{address}</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.muted} />
            </Pressable>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-white border border-line items-center justify-center" style={styles.logoCard}>
            <CarrotLogo size={27} />
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/search")}
          className="flex-row items-center bg-white border border-line rounded-2xl px-4 h-14 mb-5"
          style={styles.search}
        >
          <View className="w-8 h-8 rounded-xl bg-primarySoft items-center justify-center">
            <Ionicons name="search" size={18} color={Colors.primary} />
          </View>
          <Text className="text-muted ml-3 text-sm flex-1">Search groceries, brands and more</Text>
          <Ionicons name="options-outline" size={18} color={Colors.muted} />
        </Pressable>

        <LinearGradient
          colors={["#E8F7ED", "#F7FCF8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, styles.heroBox]}
        >
          <View className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/10" />
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500" }}
            className="absolute right-0 top-0 w-[47%] h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["#E8F7ED", "rgba(232,247,237,0.96)", "rgba(232,247,237,0.15)"]}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View className="px-5 py-5 w-[72%]">
            <View className="self-start bg-secondarySoft rounded-full px-3 py-1 mb-2">
              <Text className="text-secondary text-[10px] font-bold tracking-wider">FRESH WEEK</Text>
            </View>
            <Text className="text-dark text-xl font-bold leading-7">Farm-fresh goodness, delivered</Text>
            <Pressable onPress={() => router.push("/(tabs)/explore")} className="flex-row items-center mt-2 self-start">
              <Text className="text-primary font-semibold text-xs">Shop up to 40% off</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.primary} style={{ marginLeft: 5 }} />
            </Pressable>
          </View>
        </LinearGradient>

        <AssistantBanner />
        <ReorderSection />

        <SectionHeader title="Exclusive offers" onSeeAll={() => router.push({ pathname: "/search", params: { tag: "exclusive" } })} />
        <FlatList
          horizontal
          data={exclusive}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          renderItem={({ item }) => <ProductCard product={item} horizontal width={164} />}
        />

        <SectionHeader title="Best sellers" onSeeAll={() => router.push({ pathname: "/search", params: { tag: "bestselling" } })} />
        <FlatList
          horizontal
          data={bestselling}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          renderItem={({ item }) => <ProductCard product={item} horizontal width={164} />}
        />

        <SectionHeader title="Shop by category" onSeeAll={() => router.push("/(tabs)/explore")} />
        <View className="flex-row flex-wrap justify-between gap-y-3 mb-6">
          {categories.slice(0, 4).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logoCard: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  search: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  hero: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 3,
  },
  heroBox: {
    position: "relative",
    marginBottom: 24,
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 155,
    borderWidth: 1,
    borderColor: "rgba(47, 158, 98, 0.12)",
  },
});
