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
import { apiPost } from "@/lib/api";
import { isValidEmail, isValidPassword } from "@/lib/authValidation";
import { syncUserToBackend } from "@/lib/syncUser";
import { Colors } from "@/constants/colors";

type SignupResponse = {
  user?: { id: string; email?: string };
  profile?: { name?: string };
  error?: string;
};

export default function Signup() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    username.trim().length >= 2 && isValidEmail(email) && isValidPassword(password);

  const handleSignup = async () => {
    if (loading) return;
    setError("");
    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost<SignupResponse>("/auth/signup", {
        name: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (!data.user?.id) {
        setError("Could not create account. Try a different email.");
        return;
      }

      const profile = {
        id: data.user.id,
        name: data.profile?.name ?? username.trim(),
        email: data.user.email ?? email.trim().toLowerCase(),
      };
      setUser(profile);
      syncUserToBackend(profile);
      router.push("/(auth)/phone-number");
    } catch (err: any) {
      const msg = err.message ?? "Signup failed";
      setError(msg.includes("already") ? "This email is already registered." : msg);
    } finally {
      setLoading(false);
    }
  };

  const submitIfReady = () => {
    if (canSubmit && !loading) handleSignup();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} className="mb-4 w-10" disabled={loading}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </Pressable>

        <CarrotLogo size={48} />
        <Text className="text-2xl font-bold text-dark mb-1 mt-6 text-center">Sign Up</Text>
        <Text className="text-muted mb-8 text-center">Enter your credentials to continue</Text>

        {loading && (
          <View className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-4 flex-row items-center">
            <ActivityIndicator color={Colors.primary} size="small" />
            <Text className="text-primary text-sm font-medium ml-3">Creating your account...</Text>
          </View>
        )}

        <Text className="text-muted mb-1">Username</Text>
        <TextInput
          value={username}
          onChangeText={(v) => {
            setUsername(v);
            setError("");
          }}
          placeholder="Your name"
          returnKeyType="next"
          editable={!loading}
          onSubmitEditing={() => emailRef.current?.focus()}
          className="border-b border-line pb-2 mb-6 text-dark text-base"
        />

        <Text className="text-muted mb-1">Email</Text>
        <TextInput
          ref={emailRef}
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setError("");
          }}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          editable={!loading}
          onSubmitEditing={() => passwordRef.current?.focus()}
          className="border-b border-line pb-2 mb-6 text-dark text-base"
        />

        <Text className="text-muted mb-1">Password</Text>
        <View className="flex-row items-center border-b border-line mb-2">
          <TextInput
            ref={passwordRef}
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setError("");
            }}
            secureTextEntry={!showPw}
            placeholder="At least 6 characters"
            returnKeyType="go"
            editable={!loading}
            onSubmitEditing={submitIfReady}
            className="flex-1 pb-2 text-dark text-base"
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

        {!!error && <Text className="text-red-500 text-sm mt-2 mb-4">{error}</Text>}

        <View className="mt-6">
          <Button title="Sign Up" loading={loading} disabled={!canSubmit || loading} onPress={handleSignup} />
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-muted">Already have an account? </Text>
          <Link href="/(auth)/login">
            <Text className="text-primary font-medium">Login</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
