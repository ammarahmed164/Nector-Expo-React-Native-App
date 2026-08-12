import { useMemo, useState } from "react";
import { View, Text, Pressable, Modal, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AuthScreenLayout from "@/components/AuthScreenLayout";
import Button from "@/components/Button";
import { locationZones } from "@/data/locations";
import { useLocationStore } from "@/store/useLocationStore";
import { Colors } from "@/constants/colors";

export default function SelectLocation() {
  const router = useRouter();
  const { zone, area, setLocation, completeOnboarding } = useLocationStore();
  const [selectedZone, setSelectedZone] = useState(zone || "Karachi");
  const [selectedArea, setSelectedArea] = useState(area || "");
  const [picker, setPicker] = useState<"zone" | "area" | null>(null);

  const zoneData = useMemo(
    () => locationZones.find((z) => z.name === selectedZone) ?? locationZones[0],
    [selectedZone]
  );

  const areas = zoneData.areas;

  const submit = () => {
    if (!selectedArea) return;
    setLocation(selectedZone, selectedArea);
    completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <AuthScreenLayout>
      <View className="items-center mt-2 mb-6">
        <Image
          source={{ uri: "https://api.iconify.design/mdi/map-marker-radius.svg?color=%2353B175" }}
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>

      <Text className="text-3xl font-bold text-dark text-center mb-3">Select your location</Text>
      <Text className="text-muted text-center leading-6 mb-8 px-2">
        Choose your area to see accurate availability and delivery times.
      </Text>

      <Pressable onPress={() => setPicker("zone")} className="mb-6">
        <Text className="text-dark font-medium mb-2 text-sm">Your zone</Text>
        <View className="flex-row items-center justify-between bg-white border border-line rounded-2xl px-4 h-14">
          <Text className="text-dark text-base">{selectedZone}</Text>
          <Ionicons name="chevron-down" size={18} color={Colors.primary} />
        </View>
      </Pressable>

      <Pressable onPress={() => setPicker("area")} className="mb-10">
        <Text className="text-dark font-medium mb-2 text-sm">Your area</Text>
        <View className="flex-row items-center justify-between bg-white border border-line rounded-2xl px-4 h-14">
          <Text className={`text-base ${selectedArea ? "text-dark" : "text-muted"}`}>
            {selectedArea || "Choose your area"}
          </Text>
          <Ionicons name="chevron-down" size={18} color={Colors.primary} />
        </View>
      </Pressable>

      <Button title="Start shopping" icon="arrow-forward" onPress={submit} disabled={!selectedArea} />

      <Modal visible={picker !== null} transparent animationType="slide">
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setPicker(null)}>
          <Pressable className="bg-white rounded-t-3xl max-h-[60%]" onPress={(e) => e.stopPropagation()}>
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-line">
              <Text className="text-lg font-semibold text-dark">
                {picker === "zone" ? "Select Zone" : "Select Area"}
              </Text>
              <Pressable onPress={() => setPicker(null)}>
                <Ionicons name="close" size={22} color={Colors.dark} />
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
                  className="px-5 py-4 border-b border-line"
                >
                  <Text className="text-dark text-base">{item}</Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </AuthScreenLayout>
  );
}
