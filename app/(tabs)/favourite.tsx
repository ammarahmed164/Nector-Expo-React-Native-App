import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFavouriteStore } from "@/store/useFavouriteStore";
import { useCartStore } from "@/store/useCartStore";
import FavouriteRow from "@/components/FavouriteRow";
import Button from "@/components/Button";
import { Colors } from "@/constants/colors";

export default function Favourite() {
  const items = useFavouriteStore((state) => state.items);
  const addManyToCart = useCartStore((state) => state.addManyToCart);

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-canvas items-center justify-center px-8 pt-10">
        <View className="w-28 h-28 rounded-full bg-dangerSoft items-center justify-center mb-6">
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center">
            <Ionicons name="heart-outline" size={40} color={Colors.danger} />
          </View>
        </View>
        <Text className="text-2xl font-bold text-dark mb-2">Save what you love</Text>
        <Text className="text-muted text-center leading-6">Tap the heart on any product and it will appear here.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas pt-14">
      <View className="px-5 mb-5">
        <Text className="text-muted text-xs font-medium uppercase tracking-widest">Saved for later</Text>
        <View className="flex-row items-end justify-between mt-1">
          <Text className="text-2xl font-bold text-dark">Favourites</Text>
          <Text className="text-primary text-xs font-semibold">{items.length} items</Text>
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FavouriteRow product={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      />
      <View className="absolute bottom-5 left-5 right-5">
        <Button title="Add all to basket" icon="basket-outline" onPress={() => addManyToCart(items)} />
      </View>
    </View>
  );
}
