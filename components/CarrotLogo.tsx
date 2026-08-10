import { Image, View } from "react-native";

export default function CarrotLogo({ size = 56, color = "F8A44C" }: { size?: number; color?: string }) {
  return (
    <View className="items-center">
      <Image
        source={{ uri: `https://api.iconify.design/mdi/carrot.svg?color=%23${color}` }}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
