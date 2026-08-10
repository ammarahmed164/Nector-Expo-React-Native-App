import { View, Text, Image, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/colors";

const CARROT_URI = "https://api.iconify.design/mdi/carrot.svg?color=%23ffffff";

/** Splash lockup — tagline centered under "nectar" */
export default function SplashContent() {
  return (
    <View style={styles.root}>
      <StatusBar style="light" backgroundColor={Colors.primary} />

      <View style={styles.lockup}>
        <View style={styles.brandRow}>
          <Image source={{ uri: CARROT_URI }} style={styles.carrot} />
          <View style={styles.brandStack}>
            <Text style={styles.brand}>nectar</Text>
            <Text style={styles.tagline}>online groceries</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  lockup: {
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  carrot: {
    width: 50,
    height: 50,
    marginRight: 4,
    marginTop: 6,
  },
  brandStack: {
    alignItems: "center",
  },
  brand: {
    color: Colors.white,
    fontSize: 52,
    fontFamily: "Poppins_700Bold",
    letterSpacing: -1,
    includeFontPadding: false,
    textAlign: "center",
  },
  tagline: {
    marginTop: 6,
    color: Colors.white,
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    letterSpacing: 6.2,
    textTransform: "lowercase",
    includeFontPadding: false,
    textAlign: "center",
    alignSelf: "center",
  },
});
