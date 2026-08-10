import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiPost } from "@/lib/api";
import { useAdminStore } from "@/store/useAdminStore";
import { Colors } from "@/constants/colors";

export default function AdminLogin() {
  const router = useRouter();
  const setSession = useAdminStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Enter admin email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await apiPost<{ token: string; admin: { email: string } }>("/admin/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      setSession(data.token, data.admin.email);
      router.replace("/admin");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-dark px-6 justify-center">
      <View className="items-center mb-10">
        <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-4">
          <Ionicons name="shield-checkmark" size={32} color="#fff" />
        </View>
        <Text className="text-white text-3xl font-bold">Nectar Admin</Text>
        <Text className="text-white/50 text-sm mt-6 text-center leading-5">
          Authorized admin access only. Sign in with your admin credentials to open the dashboard.
        </Text>
      </View>

      <Text className="text-white/70 mb-1">Admin Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="admin@nectar.pk"
        placeholderTextColor="#888"
        className="border border-white/20 rounded-xl px-4 py-3 text-white mb-4"
      />

      <Text className="text-white/70 mb-1">Password</Text>
      <View className="flex-row items-center border border-white/20 rounded-xl px-4 mb-2">
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPw}
          placeholder="••••••••"
          placeholderTextColor="#888"
          className="flex-1 py-3 text-white"
        />
        <Pressable onPress={() => setShowPw(!showPw)}>
          <Ionicons name={showPw ? "eye" : "eye-off"} size={20} color="#aaa" />
        </Pressable>
      </View>

      {!!error && <Text className="text-red-400 text-sm mb-4">{error}</Text>}

      {loading ? (
        <ActivityIndicator color={Colors.primary} className="mt-4" />
      ) : (
        <Pressable onPress={login} className="bg-primary rounded-xl py-4 items-center mt-4">
          <Text className="text-white font-semibold text-lg">Sign In</Text>
        </Pressable>
      )}

    </View>
  );
}
