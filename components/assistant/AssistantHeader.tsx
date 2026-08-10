import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

type Props = {
  loading: boolean;
  cartCount: number;
  onBack: () => void;
  onClear: () => void;
  onCart: () => void;
};

export default function AssistantHeader({ loading, cartCount, onBack, onClear, onCart }: Props) {
  return (
    <View className="bg-white px-4 py-3 border-b border-line">
      <View className="flex-row items-center">
        <Pressable onPress={onBack} className="w-10 h-10 rounded-full bg-bg items-center justify-center">
          <Ionicons name="chevron-back" size={22} color={Colors.dark} />
        </Pressable>

        <View className="flex-1 flex-row items-center justify-center gap-3">
          <View className="w-11 h-11 rounded-full bg-primary items-center justify-center">
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <View>
            <Text className="font-bold text-[17px] text-dark leading-tight">Nectar AI</Text>
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <View className={`w-2 h-2 rounded-full ${loading ? "bg-secondary" : "bg-primary"}`} />
              <Text className="text-muted text-xs">
                {loading ? "Composing reply..." : "Online · Shopping Assistant"}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-1">
          <Pressable onPress={onClear} className="w-10 h-10 rounded-full items-center justify-center">
            <Ionicons name="refresh-outline" size={20} color={Colors.muted} />
          </Pressable>
          <Pressable onPress={onCart} className="w-10 h-10 rounded-full items-center justify-center">
            <Ionicons name="cart-outline" size={20} color={Colors.dark} />
            {cartCount > 0 && (
              <View className="absolute top-0.5 right-0.5 bg-danger rounded-full min-w-[16px] h-4 px-1 items-center justify-center">
                <Text className="text-white text-[9px] font-bold">{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
