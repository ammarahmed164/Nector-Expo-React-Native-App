import { useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminStore } from "@/store/useAdminStore";
import ProfileAvatar from "@/components/ProfileAvatar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Colors } from "@/constants/colors";

const menu = [
  { icon: "bag-handle-outline", label: "Orders", detail: "Track and reorder", route: "/order-history" },
  { icon: "id-card-outline", label: "My details", detail: "Profile and contact info", route: "/account-details" },
  { icon: "location-outline", label: "Delivery address", detail: "Your preferred area", route: "/location" },
  { icon: "cash-outline", label: "Payment methods", detail: "Cash and digital payments", route: "/payment-methods" },
  { icon: "ticket-outline", label: "Promo cards", detail: "Offers and savings", route: "/promo-card" },
  { icon: "notifications-outline", label: "Notifications", detail: "Choose your alerts", route: "/notifications" },
  { icon: "help-circle-outline", label: "Help centre", detail: "FAQs and support", route: "/help" },
  { icon: "information-circle-outline", label: "About Nectar", detail: "Our story and version", route: "/about" },
] as const;

export default function Account() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const adminLogout = useAdminStore((state) => state.logout);
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
    <View className="flex-1 bg-canvas pt-14">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-5 mb-5">
          <Text className="text-muted text-xs font-medium uppercase tracking-widest">Your space</Text>
          <Text className="text-2xl font-bold text-dark mt-1">Account</Text>
        </View>

        <View className="mx-5 bg-primaryDark rounded-3xl p-5 mb-6 overflow-hidden" style={styles.profileCard}>
          <View className="absolute -right-8 -top-10 w-36 h-36 rounded-full bg-white/5" />
          <View className="absolute right-16 -bottom-16 w-28 h-28 rounded-full bg-primary/30" />
          <View className="flex-row items-center">
            <View className="p-1 rounded-full bg-white/20">
              <ProfileAvatar uri={user?.avatarUri} size={64} iconSize={30} />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-xl font-semibold" numberOfLines={1}>{user?.name ?? "Guest User"}</Text>
              <Text className="text-white/70 mt-1 text-sm" numberOfLines={1}>{user?.email ?? "guest@example.com"}</Text>
              <Pressable onPress={() => router.push("/account-details")} className="flex-row items-center mt-2 self-start">
                <Text className="text-white text-xs font-semibold">Edit profile</Text>
                <Ionicons name="arrow-forward" size={13} color={Colors.white} style={{ marginLeft: 5 }} />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="px-5">
          <Text className="text-dark font-semibold text-base mb-3">Settings & activity</Text>
          <View className="bg-white border border-line rounded-3xl px-2 overflow-hidden" style={styles.menuCard}>
            {menu.map((item, index) => (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.route as any)}
                className={`flex-row items-center px-3 py-3.5 ${index < menu.length - 1 ? "border-b border-line" : ""}`}
              >
                <View className="w-10 h-10 rounded-2xl bg-primarySoft items-center justify-center">
                  <Ionicons name={item.icon} size={19} color={Colors.primary} />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-dark font-semibold text-sm">{item.label}</Text>
                  <Text className="text-muted text-[11px] mt-0.5">{item.detail}</Text>
                </View>
                <View className="w-7 h-7 rounded-xl bg-canvas items-center justify-center">
                  <Ionicons name="chevron-forward" size={15} color={Colors.muted} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="px-5 mt-6">
          <Pressable
            onPress={() => setShowLogoutDialog(true)}
            disabled={loggingOut}
            className="h-14 rounded-2xl border border-danger/20 bg-dangerSoft flex-row items-center justify-center"
          >
            {loggingOut ? (
              <ActivityIndicator color={Colors.danger} />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
                <Text className="text-danger text-base font-semibold ml-2">Log out</Text>
              </>
            )}
          </Pressable>
          <Text className="text-muted text-[11px] text-center mt-3 px-5 leading-4">
            You can sign back in anytime to access orders and saved details.
          </Text>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showLogoutDialog}
        title="Log out"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        destructive
        loading={loggingOut}
        onConfirm={performLogout}
        onCancel={() => !loggingOut && setShowLogoutDialog(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.18,
    shadowRadius: 17,
    elevation: 6,
  },
  menuCard: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
});
