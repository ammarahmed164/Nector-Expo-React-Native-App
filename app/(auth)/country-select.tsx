import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";

/** Pakistan-only app — redirects straight to phone number entry */
export default function CountrySelect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(auth)/phone-number");
  }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}
