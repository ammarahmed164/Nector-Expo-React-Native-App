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
  const dim = size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const iconSize = size === "lg" ? 18 : 14;
  return (
    <View className="flex-row items-center gap-2">
      <Pressable onPress={onDecrement} className={`${dim} rounded-xl bg-canvas border border-line items-center justify-center`}>
        <Ionicons name="remove" size={iconSize} color={Colors.muted} />
      </Pressable>
      <Text className="text-base font-semibold min-w-7 text-center text-dark">{qty}</Text>
      <Pressable onPress={onIncrement} className={`${dim} rounded-xl bg-primarySoft border border-primary/20 items-center justify-center`}>
        <Ionicons name="add" size={iconSize} color={Colors.primary} />
      </Pressable>
    </View>
  );
}
