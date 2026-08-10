import { View, Text, FlatList, Pressable } from "react-native";
import { useFavouriteStore } from "@/store/useFavouriteStore";
import { useCartStore } from "@/store/useCartStore";
import FavouriteRow from "@/components/FavouriteRow";
import Button from "@/components/Button";

export default function Favourite() {
  const items = useFavouriteStore((s) => s.items);
  const addManyToCart = useCartStore((s) => s.addManyToCart);

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8 pt-14">
        <Text className="text-2xl font-semibold text-dark mb-2">No favourites yet</Text>
        <Text className="text-muted text-center">Items you love will show up here</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-14 px-5">
      <Text className="text-2xl font-semibold text-dark text-center mb-4">Favourite</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FavouriteRow product={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <View className="absolute bottom-6 left-5 right-5">
        <Button title="Add All To Cart" onPress={() => addManyToCart(items)} />
      </View>
    </View>
  );
}
