import { useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

type Props = {
  uri: string;
  size?: number;
};

export default function AssistantProductImage({ uri, size = 88 }: Props) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  return (
    <View
      style={{ width: "100%", height: size, borderRadius: 12 }}
      className="bg-bg items-center justify-center overflow-hidden mb-2"
    >
      {loading && !failed && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}
      {failed ? (
        <Ionicons name="image-outline" size={28} color={Colors.muted} />
      ) : (
        <Image
          source={{ uri }}
          style={{ width: "100%", height: size }}
          resizeMode="cover"
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setFailed(true);
          }}
        />
      )}
    </View>
  );
}
