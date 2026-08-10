import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export default function Header({ title, showBack = true }: { title: string; showBack?: boolean }) {
  const router = useRouter();
  return (
    <View className="flex-row items-center h-14 px-4">
      {showBack ? (
        <Pressable onPress={() => router.back()} className="w-9 h-9 rounded-full border border-line items-center justify-center">
          <Ionicons name="chevron-back" size={20} color={Colors.dark} />
        </Pressable>
      ) : (
        <View className="w-9" />
      )}
      <Text className="flex-1 text-center font-semibold text-lg text-dark mr-9">{title}</Text>
    </View>
  );
}
