import { useState } from "react";
import { View, Text, TextInput, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
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
      <Text className="text-2xl font-semibold text-dark mb-2">Enter your mobile number</Text>
      <Text className="text-muted mb-8 text-base">
        We will send a verification code to your Pakistan mobile number.
      </Text>

      <Text className="text-muted mb-2 text-base">Mobile Number</Text>
      <View className="flex-row items-center border-b border-line pb-3 mb-2">
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
