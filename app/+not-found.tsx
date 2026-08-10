import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/Button";

export default function NotFound() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      <Image
        source={{ uri: "https://api.iconify.design/mdi/emoticon-sad-outline.svg?color=%2353B175" }}
        className="w-28 h-28 mb-6"
      />
      <Text className="text-2xl font-semibold text-dark mb-2 text-center">Oops! Error</Text>
      <Text className="text-muted text-center mb-8 leading-6">
        Something went wrong. Please try again or go back to the home page.
      </Text>
      <Button title="Go to Home" onPress={() => router.replace("/(tabs)")} />
    </View>
  );
}
