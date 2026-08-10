import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import SplashContent from "@/components/SplashContent";

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      ExpoSplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  if (!loaded) {
    return <SplashContent />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: "none" }} />
        <Stack.Screen
          name="onboarding"
          options={{
            animation: "fade",
            contentStyle: { flex: 1, backgroundColor: "#000000" },
            statusBarStyle: "light",
          }}
        />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="category/[id]" />
        <Stack.Screen name="search" />
        <Stack.Screen name="filter" options={{ presentation: "modal" }} />
        <Stack.Screen name="checkout" options={{ presentation: "transparentModal", animation: "slide_from_bottom" }} />
        <Stack.Screen name="order-accepted" options={{ presentation: "modal" }} />
        <Stack.Screen name="account-details" />
        <Stack.Screen name="location" />
        <Stack.Screen name="order-history" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="help" />
        <Stack.Screen name="about" />
        <Stack.Screen name="promo-card" />
        <Stack.Screen name="payment-methods" />
        <Stack.Screen name="assistant" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
