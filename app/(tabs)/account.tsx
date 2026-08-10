import { useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminStore } from "@/store/useAdminStore";
import ProfileAvatar from "@/components/ProfileAvatar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Colors } from "@/constants/colors";

const menu = [
  { icon: "bag-handle-outline", label: "Orders", route: "/order-history" },
  { icon: "id-card-outline", label: "My Details", route: "/account-details" },
  { icon: "location-outline", label: "Delivery Address", route: "/location" },
  { icon: "card-outline", label: "Payment Methods", route: "/payment-methods" },
  { icon: "ticket-outline", label: "Promo Card", route: "/promo-card" },
  { icon: "notifications-outline", label: "Notifecations", route: "/notifications" },
  { icon: "help-circle-outline", label: "Help", route: "/help" },
  { icon: "information-circle-outline", label: "About", route: "/about" },
] as const;

export default function Account() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const adminLogout = useAdminStore((s) => s.logout);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const performLogout = async () => {
    setLoggingOut(true);
    try {
      logout();
      adminLogout();
      setShowLogoutDialog(false);
      router.replace("/(auth)/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View className="flex-1 bg-white pt-14">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        <View className="flex-row items-center px-5 pb-6">
          <ProfileAvatar uri={user?.avatarUri} size={60} iconSize={30} />
          <View className="ml-4 flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-semibold text-dark">{user?.name ?? "Guest User"}</Text>
              <Pressable onPress={() => router.push("/account-details")}>
                <Ionicons name="pencil" size={18} color={Colors.primary} />
              </Pressable>
            </View>
            <Text className="text-muted mt-1 text-base">{user?.email ?? "guest@example.com"}</Text>
          </View>
        </View>

        <View className="px-5">
          {menu.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.route as any)}
              className="flex-row items-center py-4 border-b border-line"
            >
              <Ionicons name={item.icon as any} size={22} color={Colors.dark} />
              <Text className="flex-1 text-dark text-lg ml-4">{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
            </Pressable>
          ))}
        </View>

        <View className="px-5 mt-8">
          <Pressable
            onPress={() => setShowLogoutDialog(true)}
            disabled={loggingOut}
            className="h-14 rounded-2xl border border-red-200 bg-red-50 flex-row items-center justify-center"
          >
            {loggingOut ? (
              <ActivityIndicator color="#E53935" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="#E53935" />
                <Text className="text-red-600 text-base font-semibold ml-2">Log Out</Text>
              </>
            )}
          </Pressable>
          <Text className="text-muted text-xs text-center mt-3 px-4 leading-5">
            Sign out of your account. You will need to log in again to view orders and saved details.
          </Text>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showLogoutDialog}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        destructive
        loading={loggingOut}
        onConfirm={performLogout}
        onCancel={() => !loggingOut && setShowLogoutDialog(false)}
      />
    </View>
  );
}
