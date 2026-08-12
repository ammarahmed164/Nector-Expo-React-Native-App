import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/Button";
import { Colors } from "@/constants/colors";

export default function OrderAccepted() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  return (
    <View className="flex-1 bg-primarySoft items-center justify-center px-6">
      <View className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-primary/10" />
      <View className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-white/50" />
      <View className="bg-white border border-line rounded-[32px] w-full px-6 py-9 items-center" style={styles.card}>
        <View className="w-28 h-28 rounded-full bg-primarySoft items-center justify-center mb-6">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center" style={styles.icon}>
            <Ionicons name="checkmark" size={44} color="#fff" />
          </View>
        </View>
        <Text className="text-2xl font-bold text-dark mb-3 text-center">Order confirmed!</Text>
        <Text className="text-muted text-center mb-4 leading-6">
          We&apos;ve received your order and will start preparing it right away.
        </Text>
        {!!orderId && (
          <View className="bg-canvas border border-line rounded-2xl px-4 py-3 mb-7 w-full items-center">
            <Text className="text-muted text-[10px] uppercase tracking-widest">Order reference</Text>
            <Text className="text-primary font-bold mt-1">{orderId}</Text>
          </View>
        )}
        <View className="w-full">
          <Button title="View order" icon="receipt-outline" onPress={() => router.replace("/order-history")} />
        </View>
        <Pressable onPress={() => router.replace("/(tabs)")} className="mt-5 px-5 py-2">
          <Text className="text-dark font-semibold text-sm">Continue shopping</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  icon: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
});
