import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

const CARROT_ICON = "https://api.iconify.design/mdi/carrot.svg?color=%23ffffff";

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const titleSize = width < 360 ? 36 : 42;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={["#7DCEA0", "#53B175", "#3E8E5A", "#2F6F4A"]}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Soft decorative circles */}
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbRight]} />

      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 28) + 12 }]}>
        <View style={styles.hero}>
          <Image source={{ uri: CARROT_ICON }} style={styles.carrot} />
          <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize + 6 }]}>
            Welcome{"\n"}to our store
          </Text>
          <Text style={styles.subtitle}>Get your groceries in as fast as one hour</Text>
        </View>

        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonLabel}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  orbTop: {
    width: 220,
    height: 220,
    top: -60,
    right: -50,
  },
  orbRight: {
    width: 160,
    height: 160,
    bottom: "38%",
    left: -70,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 25,
  },
  hero: {
    alignItems: "center",
    marginBottom: 36,
  },
  carrot: {
    width: 48,
    height: 48,
    marginBottom: 22,
  },
  title: {
    color: Colors.white,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 12,
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    maxWidth: 300,
  },
  button: {
    height: 67,
    borderRadius: 19,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  buttonLabel: {
    color: Colors.primary,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
});
