import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { exploreCategories } from "@/data/exploreCategories";
import ExploreCategoryCard from "@/components/ExploreCategoryCard";
import AssistantBanner from "@/components/AssistantBanner";
import { Colors } from "@/constants/colors";

export default function Explore() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-canvas" contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View className="mb-5">
        <Text className="text-muted text-xs font-medium uppercase tracking-widest">Discover</Text>
        <Text className="text-2xl font-bold text-dark mt-1">Find your favourites</Text>
        <Text className="text-muted text-sm mt-1">Fresh essentials for every kind of meal.</Text>
      </View>

      <Pressable
        onPress={() => router.push("/search")}
        className="flex-row items-center bg-white border border-line rounded-2xl px-4 h-14 mb-6"
        style={styles.search}
      >
        <View className="w-8 h-8 rounded-xl bg-primarySoft items-center justify-center">
          <Ionicons name="search" size={18} color={Colors.primary} />
        </View>
        <Text className="ml-3 flex-1 text-muted text-sm">What are you looking for?</Text>
        <Ionicons name="arrow-forward" size={17} color={Colors.muted} />
      </Pressable>

      <AssistantBanner />

      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-dark font-semibold text-lg">Browse categories</Text>
        <View className="bg-white border border-line rounded-full px-3 py-1">
          <Text className="text-muted text-[10px] font-medium">{exploreCategories.length} categories</Text>
        </View>
      </View>

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

const styles = StyleSheet.create({
  search: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
});
