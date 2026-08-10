import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/category/${category.id}`)}
      style={{ backgroundColor: category.bg }}
      className="w-[47%] rounded-2xl p-4 flex-row items-center justify-between h-24"
    >
      <Text className="font-semibold text-dark flex-1">{category.name}</Text>
      <Image source={{ uri: category.image }} className="w-12 h-12 rounded-lg" />
    </Pressable>
  );
}
