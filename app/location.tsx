import { useState } from "react";
import { View, Text, Pressable, Modal, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { locationZones } from "@/data/locations";
import { useLocationStore } from "@/store/useLocationStore";
import { Colors } from "@/constants/colors";

export default function Location() {
  const router = useRouter();
  const { zone, area, setLocation } = useLocationStore();
  const [selectedZone, setSelectedZone] = useState(zone);
  const [selectedArea, setSelectedArea] = useState(area);
  const [picker, setPicker] = useState<"zone" | "area" | null>(null);

  const areas = locationZones.find((z) => z.name === selectedZone)?.areas ?? [];

  const confirm = () => {
    if (!selectedArea) return;
    setLocation(selectedZone, selectedArea);
    router.back();
  };

  return (
    <View className="flex-1 bg-canvas pt-14 px-5">
      <Header title="Delivery address" subtitle="Set where we should deliver" />

      <View className="bg-primarySoft border border-primary/10 rounded-3xl p-4 my-5 flex-row items-center">
        <View className="w-11 h-11 rounded-2xl bg-white items-center justify-center mr-3">
          <Ionicons name="location" size={22} color={Colors.primary} />
        </View>
        <Text className="text-muted leading-5 flex-1 text-sm">Choose your zone and area for accurate availability and delivery times.</Text>
      </View>

      <Pressable onPress={() => setPicker("zone")} className="mb-4">
        <Text className="text-dark font-medium mb-2 text-sm">Your zone</Text>
        <View className="flex-row items-center justify-between bg-white border border-line rounded-2xl px-4 h-14">
          <Text className="text-dark text-base">{selectedZone}</Text>
          <Ionicons name="chevron-down" size={18} color={Colors.primary} />
        </View>
      </Pressable>

      <Pressable onPress={() => setPicker("area")} className="mb-8">
        <Text className="text-dark font-medium mb-2 text-sm">Your area</Text>
        <View className="flex-row items-center justify-between bg-white border border-line rounded-2xl px-4 h-14">
          <Text className={`text-base ${selectedArea ? "text-dark" : "text-muted"}`}>{selectedArea || "Choose your area"}</Text>
          <Ionicons name="chevron-down" size={18} color={Colors.primary} />
        </View>
      </Pressable>

      <Button title="Save delivery address" icon="checkmark-circle-outline" onPress={confirm} disabled={!selectedArea} />

      <Modal visible={picker !== null} transparent animationType="slide">
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setPicker(null)}>
          <Pressable className="bg-white rounded-t-[32px] max-h-[65%]" onPress={(e) => e.stopPropagation()}>
            <View className="w-11 h-1 rounded-full bg-lineStrong self-center mt-3" />
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-line">
              <Text className="text-dark text-lg font-semibold">Select {picker === "zone" ? "zone" : "area"}</Text>
              <Pressable onPress={() => setPicker(null)} className="w-8 h-8 rounded-xl bg-canvas items-center justify-center">
                <Ionicons name="close" size={18} color={Colors.dark} />
              </Pressable>
            </View>
            <FlatList
              data={picker === "zone" ? locationZones.map((z) => z.name) : areas}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    if (picker === "zone") {
                      setSelectedZone(item);
                      setSelectedArea("");
                    } else {
                      setSelectedArea(item);
                    }
                    setPicker(null);
                  }}
                  className="px-5 py-4 border-b border-line flex-row items-center justify-between"
                >
                  <Text className="text-dark text-base">{item}</Text>
                  {(item === selectedZone || item === selectedArea) && <Ionicons name="checkmark-circle" size={19} color={Colors.primary} />}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
