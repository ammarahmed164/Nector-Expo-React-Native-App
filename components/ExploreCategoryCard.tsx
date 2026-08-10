import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ExploreCategory } from "@/data/exploreCategories";

export default function ExploreCategoryCard({ category }: { category: ExploreCategory }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/category/${category.id}`)}
      style={{ width: "47%", backgroundColor: category.bg, borderColor: category.border }}
      className="rounded-[18px] border p-4 mb-4 items-center"
    >
      <Image source={{ uri: category.image }} className="w-24 h-20 mb-4" resizeMode="contain" />
      <Text className="text-dark font-semibold text-center text-base">{category.name}</Text>
    </Pressable>
  );
}
