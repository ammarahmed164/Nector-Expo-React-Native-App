import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/Button";
import { Colors } from "@/constants/colors";
import {
  filterBrands,
  filterCategories,
  useFilterStore,
} from "@/store/useFilterStore";

function FilterCheckbox({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3">
      <View
        className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-4 ${
          checked ? "bg-primary border-primary" : "border-line bg-white"
        }`}
      >
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text className={`text-lg ${checked ? "text-primary font-medium" : "text-dark"}`}>{label}</Text>
    </Pressable>
  );
}

export default function Filter() {
  const router = useRouter();
  const { category, brand, setCategory, setBrand, reset } = useFilterStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(brand);

  useEffect(() => {
    setSelectedCategory(category);
    setSelectedBrand(brand);
  }, [category, brand]);

  const apply = () => {
    setCategory(selectedCategory);
    setBrand(selectedBrand);
    router.back();
  };

  const clearAll = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    reset();
  };

  return (
    <View className="flex-1 bg-bg">
      <View className="flex-row items-center justify-center px-5 pt-6 pb-4 bg-bg">
        <Pressable onPress={() => router.back()} className="absolute left-5 top-6 p-1">
          <Ionicons name="close" size={26} color={Colors.dark} />
        </Pressable>
        <Text className="text-2xl font-semibold text-dark">Filters</Text>
        {(selectedCategory || selectedBrand) && (
          <Pressable onPress={clearAll} className="absolute right-5 top-7">
            <Text className="text-primary text-sm font-medium">Clear</Text>
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="bg-white rounded-3xl px-5 py-2 mb-4">
          <Text className="font-semibold text-dark text-xl mt-4 mb-1">Categories</Text>
          {filterCategories.map((item) => (
            <FilterCheckbox
              key={item.id}
              label={item.label}
              checked={selectedCategory === item.id}
              onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
            />
          ))}
        </View>

        <View className="bg-white rounded-3xl px-5 py-2">
          <Text className="font-semibold text-dark text-xl mt-4 mb-1">Brand</Text>
          {filterBrands.map((item) => (
            <FilterCheckbox
              key={item.id}
              label={item.label}
              checked={selectedBrand === item.id}
              onPress={() => setSelectedBrand(selectedBrand === item.id ? null : item.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="px-5 pb-8 pt-2 bg-bg">
        <Button title="Apply Filter" onPress={apply} />
      </View>
    </View>
  );
}
