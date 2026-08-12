import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ExploreCategory } from "@/data/exploreCategories";

export default function ExploreCategoryCard({ category }: { category: ExploreCategory }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/category/${category.id}`)}
      style={[{ width: "48%", backgroundColor: category.bg, borderColor: category.border }, styles.card]}
      className="rounded-3xl border p-4 mb-4 items-center"
    >
      <View className="w-full h-24 rounded-2xl bg-white/50 items-center justify-center mb-3">
        <Image source={{ uri: category.image }} className="w-24 h-20" resizeMode="contain" />
      </View>
      <Text className="text-dark font-semibold text-center text-[15px]" numberOfLines={2}>{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#17221B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
});
