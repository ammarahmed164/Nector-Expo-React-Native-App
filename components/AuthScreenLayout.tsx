import { View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
};

export default function AuthScreenLayout({ children, showBack = true, onBack }: Props) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#FEF6FF", "#FFFFFF", "#F3FFF8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {showBack && (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          className="absolute top-14 left-5 z-10 w-10 h-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </Pressable>
      )}
      <View className="flex-1 pt-24 px-6">{children}</View>
    </View>
  );
}

export function CircularNextButton({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`w-[78px] h-[78px] rounded-full bg-primary items-center justify-center self-end ${disabled ? "opacity-40" : ""}`}
    >
      <Ionicons name="chevron-forward" size={28} color="#fff" />
    </Pressable>
  );
}
