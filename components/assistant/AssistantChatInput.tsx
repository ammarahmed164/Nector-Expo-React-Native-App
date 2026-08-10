import { View, Text, Pressable, TextInput, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { forwardRef } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
};

const AssistantChatInput = forwardRef<TextInput, Props>(function AssistantChatInput(
  { value, onChange, onSend, loading },
  ref
) {
  const canSend = !!value.trim() && !loading;

  return (
    <View className="px-4 pt-3 pb-5 bg-white border-t border-line">
      <View
        className="flex-row items-center bg-bg rounded-[28px] pl-4 pr-1.5 py-1.5 border border-line"
        style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: -2 } }}
      >
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChange}
          placeholder="Message Nectar AI..."
          placeholderTextColor={Colors.muted}
          returnKeyType="send"
          maxLength={500}
          editable={!loading}
          onSubmitEditing={onSend}
          className="flex-1 h-[44px] text-dark text-[15px]"
          {...(Platform.OS === "web"
            ? ({
                onKeyDown: (e: any) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (canSend) onSend();
                  }
                },
              } as object)
            : {})}
        />
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          className={`w-10 h-10 rounded-full items-center justify-center ${canSend ? "bg-primary" : "bg-line"}`}
        >
          <Ionicons name={loading ? "ellipsis-horizontal" : "send"} size={18} color="#fff" />
        </Pressable>
      </View>
      <Text className="text-center text-muted text-[10px] mt-2.5 tracking-wide">
        Enter to send · Secure & private
      </Text>
    </View>
  );
});

export default AssistantChatInput;
