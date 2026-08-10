import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/Button";
import { Colors } from "@/constants/colors";

export default function OrderAccepted() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <View className="bg-white rounded-3xl w-full px-6 py-10 items-center">
        <View className="w-28 h-28 rounded-full bg-primary items-center justify-center mb-6">
          <Ionicons name="checkmark" size={56} color="#fff" />
        </View>
        <Text className="text-2xl font-semibold text-dark mb-3 text-center">Your Order has been accepted</Text>
        <Text className="text-muted text-center mb-2 leading-6">
          Your items has been placed and is on it&apos;s way to being processed
        </Text>
        {!!orderId && <Text className="text-primary font-semibold mb-8">Order ID: {orderId}</Text>}
        <Button title="Track Order" onPress={() => router.replace("/order-history")} />
        <Pressable onPress={() => router.replace("/(tabs)")} className="mt-5">
          <Text className="text-dark font-semibold text-base">Back to home</Text>
        </Pressable>
      </View>
    </View>
  );
}
