import { ScrollView, Text, View } from "react-native";
import Header from "@/components/Header";

export default function About() {
  return (
    <View className="flex-1 bg-canvas pt-14">
      <Header title="About Nectar" subtitle="Freshness, made simple" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className="items-center bg-white border border-line rounded-3xl py-7 mb-6">
          <View className="w-20 h-20 rounded-3xl bg-primary items-center justify-center mb-3">
            <Text className="text-white text-3xl font-bold">n</Text>
          </View>
          <Text className="text-2xl font-bold text-dark">Nectar</Text>
          <Text className="text-muted tracking-widest text-xs mt-1">ONLINE GROCERIES</Text>
        </View>

        <Text className="text-dark text-lg font-semibold mb-2">Our Mission</Text>
        <Text className="text-muted leading-6 mb-6">
          Nectar delivers fresh groceries to your doorstep across Pakistan. We partner with trusted suppliers to bring
          you quality fruits, vegetables, dairy, meat, and daily essentials — quickly and reliably.
        </Text>

        <Text className="text-dark text-lg font-semibold mb-2">Why Nectar?</Text>
        <Text className="text-muted leading-6 mb-2">• Fresh produce sourced daily</Text>
        <Text className="text-muted leading-6 mb-2">• Fast delivery in as little as one hour</Text>
        <Text className="text-muted leading-6 mb-2">• Secure payments: COD, JazzCash, EasyPaisa & cards</Text>
        <Text className="text-muted leading-6 mb-6">• Easy reordering and favourites</Text>

        <Text className="text-dark text-lg font-semibold mb-2">Company</Text>
        <Text className="text-muted leading-6 mb-1">Version: 1.0.0</Text>
        <Text className="text-muted leading-6 mb-1">Country: Pakistan (+92)</Text>
        <Text className="text-muted leading-6 mb-1">Email: hello@nectar.pk</Text>
        <Text className="text-muted leading-6">© 2026 Nectar Grocery. All rights reserved.</Text>
      </ScrollView>
    </View>
  );
}
