import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AuthScreenLayout, { CircularNextButton } from "@/components/AuthScreenLayout";
import { apiPost } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocationStore } from "@/store/useLocationStore";
import { APP_COUNTRY, formatPakistanMobileMasked } from "@/constants/country";
import { Colors } from "@/constants/colors";

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
      if (user) updateUser({ phone: fullPhone });
      else setUser({ id: Date.now().toString(), name: "Guest User", email: "guest@example.com", phone: fullPhone });

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
      <Text className="text-2xl font-semibold text-dark mb-2">{title}</Text>
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

      <Text className="text-muted mb-2 text-base">Code</Text>
      <Pressable onPress={() => inputRef.current?.focus()} className="border-b border-line pb-3 mb-2">
        <Text className="text-dark text-2xl tracking-[8px]">{displayCode}</Text>
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
