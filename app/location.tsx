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
    <View className="flex-1 bg-white pt-14 px-5">
      <Header title="Select Your Location" />

      <Text className="text-muted text-center leading-6 my-6">
        Update your delivery zone and area for accurate store availability.
      </Text>

      <Pressable onPress={() => setPicker("zone")} className="mb-6">
        <Text className="text-muted mb-1">Your Zone</Text>
        <View className="flex-row items-center justify-between border-b border-line pb-3">
          <Text className="text-dark text-lg">{selectedZone}</Text>
          <Ionicons name="chevron-down" size={18} color={Colors.muted} />
        </View>
      </Pressable>

      <Pressable onPress={() => setPicker("area")} className="mb-8">
        <Text className="text-muted mb-1">Your Area</Text>
        <View className="flex-row items-center justify-between border-b border-line pb-3">
          <Text className="text-dark text-lg">{selectedArea || "Types of your area"}</Text>
          <Ionicons name="chevron-down" size={18} color={Colors.muted} />
        </View>
      </Pressable>

      <Button title="Submit" onPress={confirm} disabled={!selectedArea} />

      <Modal visible={picker !== null} transparent animationType="slide">
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setPicker(null)}>
          <Pressable className="bg-white rounded-t-3xl max-h-[60%]" onPress={(e) => e.stopPropagation()}>
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
                  className="px-5 py-4 border-b border-line"
                >
                  <Text className="text-dark text-base">{item}</Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
