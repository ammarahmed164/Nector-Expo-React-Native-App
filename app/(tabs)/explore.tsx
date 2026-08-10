import { View, Text, ScrollView, Pressable, TextInput, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { exploreCategories } from "@/data/exploreCategories";
import ExploreCategoryCard from "@/components/ExploreCategoryCard";
import AssistantBanner from "@/components/AssistantBanner";
import { Colors } from "@/constants/colors";

export default function Explore() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 24 }}>
      <Text className="text-2xl font-semibold text-dark text-center mb-6">Find Products</Text>

      <Pressable
        onPress={() => router.push("/search")}
        className="flex-row items-center bg-bg rounded-2xl px-4 py-4 mb-6"
      >
        <Ionicons name="search" size={20} color={Colors.muted} />
        <TextInput editable={false} pointerEvents="none" placeholder="Search Store" className="ml-3 flex-1 text-base" />
      </Pressable>

      <AssistantBanner />

      <FlatList
        data={exploreCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <ExploreCategoryCard category={item} />}
      />
    </ScrollView>
  );
}
