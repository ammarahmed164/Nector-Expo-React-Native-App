import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export default function TypingIndicator() {
  return (
    <View className="flex-row items-end mb-4 px-1">
      <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-2 mb-1">
        <Ionicons name="sparkles" size={14} color="#fff" />
      </View>
      <View className="bg-white rounded-[20px] rounded-bl-[6px] px-5 py-4 border border-line/80 flex-row items-center gap-1.5">
        <View className="w-2 h-2 rounded-full bg-primary/40" />
        <View className="w-2 h-2 rounded-full bg-primary/70" />
        <View className="w-2 h-2 rounded-full bg-primary" />
      </View>
    </View>
  );
}
