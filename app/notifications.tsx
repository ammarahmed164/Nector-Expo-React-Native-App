import { View, Text, Switch } from "react-native";
import { useState } from "react";
import Header from "@/components/Header";

export default function Notifications() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  return (
    <View className="flex-1 bg-white pt-14 px-5">
      <Header title="Notifications" />
      <View className="flex-row items-center justify-between py-5 border-b border-line">
        <Text className="text-dark text-lg">Order Updates</Text>
        <Switch value={orderUpdates} onValueChange={setOrderUpdates} />
      </View>
      <View className="flex-row items-center justify-between py-5 border-b border-line">
        <Text className="text-dark text-lg">Promotions</Text>
        <Switch value={promotions} onValueChange={setPromotions} />
      </View>
    </View>
  );
}
