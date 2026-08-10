import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { Colors } from "@/constants/colors";

const METHODS = [
  {
    icon: "cash-outline" as const,
    title: "Cash on Delivery",
    desc: "Pay with cash when your order arrives. Available for all delivery areas.",
  },
  {
    icon: "phone-portrait-outline" as const,
    title: "JazzCash",
    desc: "Pay securely via JazzCash mobile wallet. You will receive payment instructions after checkout.",
  },
  {
    icon: "wallet-outline" as const,
    title: "EasyPaisa",
    desc: "Use your EasyPaisa account for quick mobile payments across Pakistan.",
  },
  {
    icon: "card-outline" as const,
    title: "Debit / Credit Card",
    desc: "Visa and Mastercard accepted. Payments are processed through a secure gateway.",
  },
];

export default function PaymentMethods() {
  return (
    <View className="flex-1 bg-white pt-14">
      <Header title="Payment Methods" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text className="text-muted leading-6 mb-5">
          Choose your preferred payment method at checkout. All transactions are encrypted and secure.
        </Text>

        {METHODS.map((method) => (
          <View key={method.title} className="flex-row border border-line rounded-2xl p-4 mb-3">
            <View className="w-12 h-12 rounded-full bg-bg items-center justify-center mr-4">
              <Ionicons name={method.icon} size={22} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-dark font-semibold text-base mb-1">{method.title}</Text>
              <Text className="text-muted leading-5 text-sm">{method.desc}</Text>
            </View>
          </View>
        ))}

        <View className="bg-primary/10 rounded-2xl p-4 mt-4">
          <Text className="text-dark font-semibold mb-1">Payment security</Text>
          <Text className="text-muted leading-6 text-sm">
            Nectar never stores your full card number. For wallet payments, you complete authorization on the JazzCash
            or EasyPaisa app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
