import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export default function AssistantBanner() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/assistant")}
      className="mb-6 rounded-3xl overflow-hidden bg-primaryDark px-5 py-4 flex-row items-center"
      style={styles.banner}
    >
      <View className="absolute -right-7 -top-8 w-28 h-28 rounded-full bg-white/5" />
      <View className="absolute right-12 -bottom-14 w-24 h-24 rounded-full bg-primary/30" />
      <View className="w-12 h-12 rounded-2xl bg-white/15 items-center justify-center mr-4 border border-white/10">
        <Ionicons name="sparkles" size={23} color="#fff" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-white font-semibold text-base">Nectar AI Assistant</Text>
          <View className="bg-secondary ml-2 rounded-full px-2 py-0.5">
            <Text className="text-white text-[9px] font-bold">SMART</Text>
          </View>
        </View>
        <Text className="text-white/75 text-xs mt-1">Search · plan meals · build your cart</Text>
      </View>
      <View className="w-8 h-8 rounded-xl bg-white/10 items-center justify-center">
        <Ionicons name="arrow-forward" size={17} color="#fff" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
});
