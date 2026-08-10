import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export default function AssistantBanner() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/assistant")}
      className="mb-6 rounded-2xl overflow-hidden bg-primary px-5 py-4 flex-row items-center"
    >
      <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
        <Ionicons name="sparkles" size={24} color="#fff" />
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold text-lg">Nectar AI Assistant</Text>
        <Text className="text-white/85 text-sm mt-0.5">Smart search · Recipes · Instant cart</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#fff" />
    </Pressable>
  );
}
