import { View, Text, Switch } from "react-native";
import { useState } from "react";
import Header from "@/components/Header";
import { Colors } from "@/constants/colors";

export default function Notifications() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  return (
    <View className="flex-1 bg-canvas pt-14 px-5">
      <Header title="Notifications" subtitle="Choose what reaches you" />
      <View className="bg-white border border-line rounded-3xl px-4 mt-4">
        <View className="flex-row items-center justify-between py-5 border-b border-line">
          <View className="flex-1 pr-4">
            <Text className="text-dark font-semibold">Order updates</Text>
            <Text className="text-muted text-xs mt-1">Delivery and order status alerts</Text>
          </View>
          <Switch
            value={orderUpdates}
            onValueChange={setOrderUpdates}
            trackColor={{ false: Colors.line, true: Colors.primarySoft }}
            thumbColor={orderUpdates ? Colors.primary : Colors.lineStrong}
          />
        </View>
        <View className="flex-row items-center justify-between py-5">
          <View className="flex-1 pr-4">
            <Text className="text-dark font-semibold">Promotions</Text>
            <Text className="text-muted text-xs mt-1">Deals, discounts and new arrivals</Text>
          </View>
          <Switch
            value={promotions}
            onValueChange={setPromotions}
            trackColor={{ false: Colors.line, true: Colors.primarySoft }}
            thumbColor={promotions ? Colors.primary : Colors.lineStrong}
          />
        </View>
      </View>
    </View>
  );
}
