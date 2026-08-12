import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export default function Header({
  title,
  showBack = true,
  subtitle,
}: {
  title: string;
  showBack?: boolean;
  subtitle?: string;
}) {
  const router = useRouter();
  return (
    <View className="flex-row items-center min-h-16 px-5">
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-white border border-line items-center justify-center"
          style={styles.button}
        >
          <Ionicons name="chevron-back" size={21} color={Colors.dark} />
        </Pressable>
      ) : (
        <View className="w-10" />
      )}
      <View className="flex-1 items-center mr-10 px-2">
        <Text className="font-semibold text-lg text-dark" numberOfLines={1}>{title}</Text>
        {!!subtitle && <Text className="text-muted text-xs mt-0.5" numberOfLines={1}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    shadowColor: "#17221B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
