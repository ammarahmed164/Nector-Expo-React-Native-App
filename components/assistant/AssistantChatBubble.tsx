import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

type Props = {
  text: string;
  time: string;
  isUser: boolean;
  isWelcome?: boolean;
};

export default function AssistantChatBubble({ text, time, isUser, isWelcome }: Props) {
  if (isWelcome) {
    return (
      <View className="items-center mb-6 px-2">
        <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mb-3">
          <Ionicons name="sparkles" size={28} color={Colors.primary} />
        </View>
        <View className="bg-white rounded-3xl px-5 py-4 border border-line max-w-[92%] shadow-sm">
          <Text className="text-dark text-[15px] leading-6 text-center">{text}</Text>
        </View>
        <Text className="text-muted text-[11px] mt-2">{time}</Text>
      </View>
    );
  }

  if (isUser) {
    return (
      <View className="items-end mb-4 px-1">
        <View
          className="bg-primary rounded-[20px] rounded-br-[6px] px-4 py-3 max-w-[82%] shadow-sm"
          style={{ shadowColor: Colors.primary, shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
        >
          <Text className="text-white text-[15px] leading-[22px]">{text}</Text>
        </View>
        <Text className="text-muted text-[10px] mt-1.5 mr-1">You · {time}</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-end mb-4 px-1">
      <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-2 mb-5">
        <Ionicons name="sparkles" size={14} color="#fff" />
      </View>
      <View className="flex-1 max-w-[85%]">
        <Text className="text-muted text-[11px] font-medium mb-1 ml-1">Nectar AI</Text>
        <View className="bg-white rounded-[20px] rounded-bl-[6px] px-4 py-3 border border-line/80 shadow-sm">
          <Text className="text-dark text-[15px] leading-[22px]">{text}</Text>
        </View>
        <Text className="text-muted text-[10px] mt-1.5 ml-1">{time}</Text>
      </View>
    </View>
  );
}
