import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { Colors } from "@/constants/colors";

const FAQ = [
  {
    q: "How do I place an order?",
    a: "Browse products, add items to your cart, choose delivery method at checkout, and tap Place Order. You will receive an order confirmation instantly.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery usually arrives within 60–90 minutes in supported areas. Express delivery is faster where available. You can track status in Orders.",
  },
  {
    q: "How do I track my order?",
    a: "Open Account → Orders to see your order history, delivery method, total amount, and current status for each order.",
  },
  {
    q: "Can I change my delivery address?",
    a: "Yes. Go to Account → Delivery Address, select your zone and area, and save. Your address is used for future deliveries.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept Cash on Delivery, JazzCash, EasyPaisa, and card payments. Choose your preferred method at checkout.",
  },
  {
    q: "How do I use a promo code?",
    a: "Open Account → Promo Card to view active offers. During checkout, select a promo option before placing your order.",
  },
  {
    q: "How do I update my profile?",
    a: "Go to Account → My Details to update your name, email, phone number, and profile photo.",
  },
  {
    q: "What if an item is missing or wrong?",
    a: "Contact support within 24 hours with your order ID. We will arrange a refund or replacement after verification.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable onPress={() => setOpen(!open)} className="border border-line rounded-2xl p-4 mb-3">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-dark font-semibold text-base pr-3">{q}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={Colors.muted} />
      </View>
      {open && <Text className="text-muted mt-3 leading-6 text-sm">{a}</Text>}
    </Pressable>
  );
}

export default function Help() {
  return (
    <View className="flex-1 bg-white pt-14">
      <Header title="Help" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className="bg-primary/10 rounded-2xl p-5 mb-6">
          <Text className="text-dark text-lg font-semibold mb-2">Need assistance?</Text>
          <Text className="text-muted leading-6 mb-3">
            Our Nectar support team is available 9 AM – 10 PM (PKT), seven days a week.
          </Text>
          <Text className="text-dark">Email: support@nectar.pk</Text>
          <Text className="text-dark mt-1">Phone: +92 300 1234567</Text>
          <Text className="text-dark mt-1">WhatsApp: +92 300 1234567</Text>
        </View>

        <Text className="text-dark text-xl font-semibold mb-4">Frequently Asked Questions</Text>
        {FAQ.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </ScrollView>
    </View>
  );
}
