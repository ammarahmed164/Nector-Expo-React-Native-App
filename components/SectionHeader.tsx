import { View, Text, Pressable } from "react-native";

type Props = {
  title: string;
  onSeeAll?: () => void;
};

export default function SectionHeader({ title, onSeeAll }: Props) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-2xl font-semibold text-dark">{title}</Text>
      {onSeeAll ? (
        <Pressable onPress={onSeeAll}>
          <Text className="text-primary text-base">See all</Text>
        </Pressable>
      ) : (
        <Text className="text-primary text-base">See all</Text>
      )}
    </View>
  );
}
