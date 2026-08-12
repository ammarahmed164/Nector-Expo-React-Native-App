import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/category/${category.id}`)}
      style={[{ backgroundColor: category.bg }, styles.card]}
      className="w-[48%] rounded-3xl p-4 flex-row items-center justify-between h-28 border border-white"
    >
      <Text className="font-semibold text-dark flex-1 pr-1" numberOfLines={2}>{category.name}</Text>
      <View className="w-14 h-14 rounded-2xl bg-white/70 items-center justify-center">
        <Image source={{ uri: category.image }} className="w-12 h-12 rounded-xl" resizeMode="contain" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#17221B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
});
