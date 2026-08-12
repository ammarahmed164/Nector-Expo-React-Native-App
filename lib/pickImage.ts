import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
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
    quality: 0.7,
  });

  if (result.canceled || !result.assets[0]?.uri) return null;

  try {
    const context = ImageManipulator.manipulate(result.assets[0].uri);
    context.resize({ width: 512, height: 512 });
    const rendered = await context.renderAsync();
    const optimized = await rendered.saveAsync({
      base64: true,
      compress: 0.72,
      format: SaveFormat.JPEG,
    });

    if (optimized.base64) {
      return `data:image/jpeg;base64,${optimized.base64}`;
    }
  } catch {
    Alert.alert("Photo could not be saved", "Please choose another image and try again.");
  }

  return null;
}
