import { ScrollView, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { Colors } from "@/constants/colors";

const PROMOS = [
  {
    code: "NECTAR10",
    title: "10% OFF",
    desc: "Get 10% off on orders above Rs. 2,000. Valid once per user.",
    expiry: "31 Dec 2026",
  },
  {
    code: "FREEDEL",
    title: "Free Delivery",
    desc: "Free standard delivery on your first order. Min. order Rs. 1,500.",
    expiry: "31 Dec 2026",
  },
  {
    code: "FRESH500",
    title: "Rs. 500 OFF",
    desc: "Rs. 500 off on fresh fruits & vegetables category. Min. Rs. 3,000.",
    expiry: "15 Sep 2026",
  },
];

export default function PromoCard() {
  return (
    <View className="flex-1 bg-canvas pt-14">
      <Header title="Promo cards" subtitle="Offers picked for you" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text className="text-muted leading-6 mb-5">
          Apply these offers at checkout by selecting a promo option before placing your order.
        </Text>

        {PROMOS.map((promo) => (
          <View key={promo.code} className="bg-white border border-line rounded-3xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-primary font-bold text-lg">{promo.title}</Text>
              <View className="bg-primary/10 px-3 py-1 rounded-full">
                <Text className="text-primary font-semibold text-xs">{promo.code}</Text>
              </View>
            </View>
            <Text className="text-muted leading-6 mb-2">{promo.desc}</Text>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={14} color={Colors.muted} />
              <Text className="text-muted text-sm ml-1">Expires: {promo.expiry}</Text>
            </View>
          </View>
        ))}

        <View className="bg-primarySoft rounded-3xl p-4 mt-2">
          <Text className="text-dark font-semibold mb-1">How to redeem</Text>
          <Text className="text-muted leading-6 text-sm">
            1. Add items to cart{"\n"}
            2. Go to checkout{"\n"}
            3. Tap Promo Code and select your offer{"\n"}
            4. Place order — discount applied automatically
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
