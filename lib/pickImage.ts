import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

export async function pickProfileImage(): Promise<string | null> {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo library access to change your profile picture.");
      return null;
    }
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.75,
    base64: true,
  });

  if (result.canceled || !result.assets[0]?.uri) return null;

  const asset = result.assets[0];
  if (asset.base64) {
    const mime = asset.mimeType ?? "image/jpeg";
    return `data:${mime};base64,${asset.base64}`;
  }

  return asset.uri;
}
