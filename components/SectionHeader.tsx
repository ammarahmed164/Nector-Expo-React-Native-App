import { View, Text, Pressable } from "react-native";

type Props = {
  title: string;
  onSeeAll?: () => void;
};

export default function SectionHeader({ title, onSeeAll }: Props) {
  return (
    <View className="flex-row justify-between items-end mb-4">
      <View>
        <View className="w-8 h-1 rounded-full bg-primary mb-2" />
        <Text className="text-xl font-semibold text-dark">{title}</Text>
      </View>
      {onSeeAll ? (
        <Pressable onPress={onSeeAll} className="bg-primarySoft px-3 py-1.5 rounded-full">
          <Text className="text-primary text-xs font-semibold">See all</Text>
        </Pressable>
      ) : (
        <Text className="text-primary text-sm font-medium">See all</Text>
      )}
    </View>
  );
}
