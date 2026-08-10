import { View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

type Props = {
  uri?: string | null;
  size?: number;
  iconSize?: number;
};

export default function ProfileAvatar({ uri, size = 60, iconSize = 28 }: Props) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: "rgba(83, 177, 117, 0.25)",
        }}
        className="bg-bg"
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: "rgba(83, 177, 117, 0.2)",
      }}
      className="bg-bg items-center justify-center"
    >
      <Ionicons name="person" size={iconSize} color={Colors.primary} />
    </View>
  );
}
