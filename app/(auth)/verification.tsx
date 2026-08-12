import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AuthScreenLayout, { CircularNextButton } from "@/components/AuthScreenLayout";
import { apiPost } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocationStore } from "@/store/useLocationStore";
import { APP_COUNTRY, formatPakistanMobileMasked } from "@/constants/country";
import { Colors } from "@/constants/colors";
import { syncUserToBackend } from "@/lib/syncUser";

type OtpProvider = "supabase" | "bird" | "twilio" | "dev";

export default function Verification() {
  const router = useRouter();
  const {
    dial = APP_COUNTRY.dial,
    phone = "",
    devCode = "",
    provider = "dev",
    codeLength = "4",
  } = useLocalSearchParams<{
    dial?: string;
    phone?: string;
    devCode?: string;
    provider?: OtpProvider;
    codeLength?: string;
  }>();

  const otpProvider = (provider as OtpProvider) ?? "dev";
  const length = Number(codeLength) || (otpProvider === "supabase" || otpProvider === "bird" ? 6 : 4);

  const setUser = useAuthStore((s) => s.setUser);
  const updateUser = useAuthStore((s) => s.updateUser);
  const user = useAuthStore((s) => s.user);
  const setPhoneVerified = useLocationStore((s) => s.setPhoneVerified);

  const [code, setCode] = useState("");
  const [devOnlyCode, setDevOnlyCode] = useState(otpProvider === "dev" ? devCode?.toString() ?? "" : "");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!phone) router.replace("/(auth)/phone-number");
  }, [phone]);

  const maskedPhone = phone ? `${dial} ${formatPakistanMobileMasked(phone)}` : "";
  const title = length === 6 ? "Enter your 6-digit code" : "Enter your 4-digit code";

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await apiPost<{ code?: string; provider: OtpProvider; codeLength: number; message: string }>(
        "/auth/resend-otp",
        { dial, phone }
      );
      setDevOnlyCode(res.provider === "dev" ? res.code ?? "" : "");
      setCode("");
      inputRef.current?.focus();
      Alert.alert(
        res.provider === "dev" ? "Code ready" : "Code sent",
        res.provider === "dev"
          ? "Use the verification code shown on screen."
          : `Verification code sent to ${maskedPhone}`
      );
    } catch (err: any) {
      Alert.alert("Resend failed", err.message ?? "Try again.");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== length) {
      Alert.alert("Invalid code", `Enter the ${length}-digit code sent to your phone.`);
      return;
    }

    setLoading(true);
    try {
      await apiPost("/auth/verify-otp", { dial, phone, code, provider: otpProvider });

      const fullPhone = `${dial}${phone}`;
      if (user) {
        const updatedUser = { ...user, phone: fullPhone };
        updateUser({ phone: fullPhone });
        void syncUserToBackend(updatedUser);
      } else {
        const guestUser = { id: Date.now().toString(), name: "Guest User", email: "guest@example.com", phone: fullPhone };
        setUser(guestUser);
        void syncUserToBackend(guestUser);
      }

      setPhoneVerified(true);
      router.replace("/(auth)/select-location");
    } catch (err: any) {
      Alert.alert("Verification failed", err.message ?? "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayCode = code.padEnd(length, "-").split("").join(" ");

  return (
    <AuthScreenLayout>
      <View className="w-14 h-14 rounded-2xl bg-primarySoft items-center justify-center mb-5">
        <Ionicons name="shield-checkmark-outline" size={27} color={Colors.primary} />
      </View>
      <Text className="text-3xl font-bold text-dark mb-2">{title}</Text>
      <Text className="text-muted mb-6 text-base">
        {otpProvider === "dev"
          ? "Development mode — enter the 4-digit code shown below."
          : `Check SMS on ${maskedPhone} and enter the code.`}
      </Text>

      {otpProvider === "dev" && !!devOnlyCode && (
        <View className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6">
          <Text className="text-amber-800 text-sm mb-1">Development mode</Text>
          <Text className="text-dark text-2xl font-bold tracking-[6px]">{devOnlyCode}</Text>
          <Text className="text-muted text-xs mt-2">
            Code for {maskedPhone}. Real SMS will be enabled later with Twilio.
          </Text>
        </View>
      )}

      <Text className="text-dark font-medium mb-2 text-sm">Verification code</Text>
      <Pressable onPress={() => inputRef.current?.focus()} className="bg-white border border-line rounded-2xl px-5 h-16 justify-center mb-2">
        <Text className="text-dark text-2xl tracking-[8px] font-semibold">{displayCode}</Text>
      </Pressable>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(v) => setCode(v.replace(/\D/g, "").slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        className="absolute opacity-0 h-0 w-0"
      />

      <View className="flex-row justify-between items-end mt-auto pb-10">
        <Pressable onPress={handleResend} disabled={resending}>
          {resending ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Text className="text-primary text-base font-medium">Resend Code</Text>
          )}
        </Pressable>

        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <CircularNextButton onPress={handleVerify} disabled={code.length !== length || loading} />
        )}
      </View>
    </AuthScreenLayout>
  );
}
