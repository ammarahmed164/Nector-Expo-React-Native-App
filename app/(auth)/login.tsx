import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/Button";
import CarrotLogo from "@/components/CarrotLogo";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminStore } from "@/store/useAdminStore";
import { apiPost } from "@/lib/api";
import { isValidEmail, isValidPassword } from "@/lib/authValidation";
import { syncUserToBackend } from "@/lib/syncUser";
import { attachStoredProfile } from "@/lib/profileAvatarStorage";
import { Colors } from "@/constants/colors";

type LoginResponse =
  | {
      role: "admin";
      token: string;
      admin: { email: string; name?: string };
    }
  | {
      role?: "user";
      user?: { id: string; email?: string; user_metadata?: { name?: string } };
      profile?: { id: string; name?: string; email?: string; phone?: string } | null;
      error?: string;
    };

export default function Login() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setAdminSession = useAdminStore((s) => s.setSession);
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = isValidEmail(email) && isValidPassword(password);

  const handleLogin = async () => {
    if (loading) return;
    setError("");
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost<LoginResponse>("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (data.role === "admin" && data.token) {
        setAdminSession(data.token, data.admin.email);
        router.replace("/admin");
        return;
      }

      const user = "user" in data ? data.user : undefined;
      if (!user?.id) {
        setError("Invalid credentials");
        return;
      }

      const serverProfile = "profile" in data ? data.profile : undefined;
      const profile = await attachStoredProfile({
        id: user.id,
        name: serverProfile?.name ?? user.user_metadata?.name ?? email.split("@")[0],
        email: serverProfile?.email ?? user.email ?? email.trim().toLowerCase(),
        phone: serverProfile?.phone,
      });
      setUser(profile);
      void syncUserToBackend(profile);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message?.toLowerCase().includes("invalid") ? "Invalid credentials" : err.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const submitIfReady = () => {
    if (canSubmit && !loading) handleLogin();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-20 h-20 rounded-3xl bg-white border border-line items-center justify-center self-center">
          <CarrotLogo size={42} />
        </View>
        <Text className="text-3xl font-bold text-dark mb-1 mt-7 text-center">Welcome back</Text>
        <Text className="text-muted mb-8 text-center">Sign in to continue your fresh shopping</Text>

        {loading && (
          <View className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-4 flex-row items-center">
            <ActivityIndicator color={Colors.primary} size="small" />
            <Text className="text-primary text-sm font-medium ml-3">Signing you in...</Text>
          </View>
        )}

        <Text className="text-dark font-medium mb-2 text-sm">Email address</Text>
        <TextInput
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setError("");
          }}
          placeholder="imshuvo97@gmail.com"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          editable={!loading}
          onSubmitEditing={() => passwordRef.current?.focus()}
          className="bg-white border border-line rounded-2xl px-4 h-14 mb-5 text-dark text-base"
        />

        <Text className="text-dark font-medium mb-2 text-sm">Password</Text>
        <View className="flex-row items-center bg-white border border-line rounded-2xl px-4 h-14 mb-2">
          <TextInput
            ref={passwordRef}
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setError("");
            }}
            secureTextEntry={!showPw}
            placeholder="••••••••"
            returnKeyType="go"
            editable={!loading}
            onSubmitEditing={submitIfReady}
            className="flex-1 text-dark text-base"
            {...(Platform.OS === "web"
              ? ({
                  onKeyDown: (e: any) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitIfReady();
                    }
                  },
                } as object)
              : {})}
          />
          <Pressable onPress={() => setShowPw(!showPw)} disabled={loading}>
            <Ionicons name={showPw ? "eye" : "eye-off"} size={20} color={Colors.muted} />
          </Pressable>
        </View>

        {!!error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

        <Link href="/(auth)/phone-number" asChild>
          <Pressable className="self-end mb-8 mt-2" disabled={loading}>
            <Text className="text-dark text-sm">Forgot Password?</Text>
          </Pressable>
        </Link>

        <Button title="Log in" icon="log-in-outline" loading={loading} disabled={!canSubmit || loading} onPress={handleLogin} />

        <View className="flex-row justify-center mt-6">
          <Text className="text-muted">Don&apos;t have an account? </Text>
          <Link href="/(auth)/signup">
            <Text className="text-primary font-semibold">Sign up</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
