import { Modal, View, Text, Pressable, ActivityIndicator } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable className="flex-1 bg-black/45 items-center justify-center px-6" onPress={onCancel}>
        <Pressable className="w-full max-w-sm bg-white rounded-3xl p-6" onPress={(e) => e.stopPropagation()}>
          <Text className="text-xl font-semibold text-dark text-center">{title}</Text>
          <Text className="text-muted text-center mt-3 leading-6">{message}</Text>

          <View className="flex-row gap-3 mt-6">
            <Pressable
              onPress={onCancel}
              disabled={loading}
              className="flex-1 h-12 rounded-2xl border border-line items-center justify-center"
            >
              <Text className="text-dark font-medium">{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={loading}
              className={`flex-1 h-12 rounded-2xl items-center justify-center ${
                destructive ? "bg-red-500" : "bg-primary"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">{confirmLabel}</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
