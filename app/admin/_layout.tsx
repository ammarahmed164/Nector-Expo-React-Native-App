import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminLayout() {
  const token = useAdminStore((s) => s.token);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const onLogin = segments[segments.length - 1] === "login";
    if (!token && !onLogin) router.replace("/admin/login");
    if (token && onLogin) router.replace("/admin");
  }, [token, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
