import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

type Props = {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "lg";
};

export default function QuantitySelector({ qty, onIncrement, onDecrement, size = "sm" }: Props) {
  const dim = size === "lg" ? "w-9 h-9" : "w-6 h-6";
  const iconSize = size === "lg" ? 18 : 14;
  return (
    <View className="flex-row items-center gap-3">
      <Pressable onPress={onDecrement} className={`${dim} rounded-full border border-line items-center justify-center`}>
        <Ionicons name="remove" size={iconSize} color={Colors.dark} />
      </Pressable>
      <Text className="text-base font-medium w-4 text-center">{qty}</Text>
      <Pressable onPress={onIncrement} className={`${dim} rounded-full bg-primary items-center justify-center`}>
        <Ionicons name="add" size={iconSize} color="#fff" />
      </Pressable>
    </View>
  );
}
