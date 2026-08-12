import { useState } from "react";
import { View, Text, TextInput, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AuthScreenLayout, { CircularNextButton } from "@/components/AuthScreenLayout";
import { apiPost } from "@/lib/api";
import {
  APP_COUNTRY,
  PAKISTAN_MOBILE_HINT,
  isValidPakistanMobile,
  normalizePakistanMobile,
  formatPakistanMobileDisplay,
} from "@/constants/country";
import { Colors } from "@/constants/colors";

type SendOtpResponse = {
  code?: string;
  provider: "supabase" | "bird" | "twilio" | "dev";
  codeLength: number;
  message: string;
};

export default function PhoneNumber() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const digits = normalizePakistanMobile(phone);
  const canContinue = isValidPakistanMobile(digits);
  const showError = digits.length === 10 && !canContinue;

  const handlePhoneChange = (text: string) => {
    const normalized = normalizePakistanMobile(text);
    setPhone(formatPakistanMobileDisplay(normalized));
  };

  const handleContinue = async () => {
    if (!isValidPakistanMobile(digits)) {
      Alert.alert(
        "Invalid number",
        `Enter a valid Pakistan mobile number.\nFormat: ${PAKISTAN_MOBILE_HINT}\nExample: 300 1234567`
      );
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost<SendOtpResponse>("/auth/send-otp", {
        dial: APP_COUNTRY.dial,
        phone: digits,
      });

      router.push({
        pathname: "/(auth)/verification",
        params: {
          dial: APP_COUNTRY.dial,
          phone: digits,
          provider: res.provider,
          codeLength: String(res.codeLength),
          ...(res.code ? { devCode: res.code } : {}),
        },
      });
    } catch (err: any) {
      Alert.alert("Could not send code", err.message ?? "Make sure backend is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout>
      <View className="w-14 h-14 rounded-2xl bg-primarySoft items-center justify-center mb-5">
        <Ionicons name="phone-portrait-outline" size={26} color={Colors.primary} />
      </View>
      <Text className="text-3xl font-bold text-dark mb-2">Your mobile number</Text>
      <Text className="text-muted mb-8 text-base">
        We will send a verification code to your Pakistan mobile number.
      </Text>

      <Text className="text-dark font-medium mb-2 text-sm">Mobile number</Text>
      <View className="flex-row items-center bg-white border border-line rounded-2xl px-4 h-16 mb-2">
        <Text className="text-xl mr-2">{APP_COUNTRY.flag}</Text>
        <Text className="text-dark text-lg mr-3">{APP_COUNTRY.dial}</Text>
        <TextInput
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          placeholder="300 1234567"
          maxLength={14}
          autoFocus
          className="flex-1 text-dark text-lg py-1"
        />
      </View>

      <Text className={`text-sm mb-auto ${showError ? "text-red-500" : "text-muted"}`}>
        {showError
          ? "Invalid number. Must be 10 digits starting with 3 (e.g. 300 1234567)."
          : `Format: ${PAKISTAN_MOBILE_HINT} — without leading 0`}
      </Text>

      <View className="flex-row justify-end items-center pb-10">
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <CircularNextButton onPress={handleContinue} disabled={!canContinue || loading} />
        )}
      </View>
    </AuthScreenLayout>
  );
}
