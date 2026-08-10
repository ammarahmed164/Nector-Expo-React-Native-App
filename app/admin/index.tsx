import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { apiGet, apiPatch } from "@/lib/api";
import { useAdminStore } from "@/store/useAdminStore";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

type Stats = {
  totalUsers: number;
  totalOrders: number;
  ordersToday: number;
  revenue: number;
  revenueToday: number;
  pendingOrders: number;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
};

type AdminOrder = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  deliveryMethod: string;
  paymentLabel: string;
  promoLabel: string;
  status: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { token, email, logout } = useAdminStore();
  const [tab, setTab] = useState<"overview" | "orders" | "users">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (!token) return;
    try {
      const [dash, usersRes, ordersRes] = await Promise.all([
        apiGet<Stats>("/admin/dashboard", token),
        apiGet<{ users: AdminUser[] }>("/admin/users", token),
        apiGet<{ orders: AdminOrder[] }>("/admin/orders", token),
      ]);
      setStats(dash);
      setUsers(usersRes.users);
      setOrders(ordersRes.orders);
    } catch {
      logout();
      router.replace("/admin/login");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [token])
  );

  const updateStatus = async (orderId: string, status: string) => {
    if (!token) return;
    await apiPatch(`/admin/orders/${orderId}/status`, { status }, token);
    load();
  };

  if (loading && !stats) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg pt-14">
      <View className="px-5 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-dark">Admin Dashboard</Text>
          <Text className="text-muted text-sm">{email}</Text>
        </View>
        <Pressable
          onPress={() => {
            logout();
            router.replace("/admin/login");
          }}
          className="bg-white border border-line px-4 py-2 rounded-full"
        >
          <Text className="text-dark font-medium">Logout</Text>
        </Pressable>
      </View>

      <View className="flex-row px-5 mb-4 gap-2">
        {(["overview", "orders", "users"] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            className={`px-4 py-2 rounded-full ${tab === t ? "bg-primary" : "bg-white border border-line"}`}
          >
            <Text className={`capitalize font-medium ${tab === t ? "text-white" : "text-dark"}`}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        {tab === "overview" && stats && (
          <>
            <View className="flex-row flex-wrap gap-3 mb-6">
              <StatCard label="Total Users" value={String(stats.totalUsers)} icon="people-outline" />
              <StatCard label="Total Orders" value={String(stats.totalOrders)} icon="receipt-outline" />
              <StatCard label="Orders Today" value={String(stats.ordersToday)} icon="today-outline" />
              <StatCard label="Pending" value={String(stats.pendingOrders)} icon="time-outline" />
              <StatCard label="Revenue" value={formatPrice(stats.revenue)} icon="cash-outline" wide />
              <StatCard label="Today Revenue" value={formatPrice(stats.revenueToday)} icon="trending-up-outline" wide />
            </View>

            <Text className="text-dark text-lg font-semibold mb-3">Recent Orders</Text>
            {orders.slice(0, 5).map((o) => (
              <OrderCard key={o.id} order={o} onStatusChange={updateStatus} compact />
            ))}
          </>
        )}

        {tab === "orders" &&
          orders.map((o) => <OrderCard key={o.id} order={o} onStatusChange={updateStatus} />)}

        {tab === "users" &&
          users.map((u) => (
            <View key={u.id} className="bg-white rounded-2xl p-4 mb-3 border border-line">
              <Text className="text-dark font-semibold text-base">{u.name}</Text>
              <Text className="text-muted text-sm mt-1">{u.email}</Text>
              {!!u.phone && <Text className="text-muted text-sm">{u.phone}</Text>}
              <View className="flex-row mt-3 gap-4">
                <Text className="text-primary font-medium text-sm">{u.orderCount} orders</Text>
                <Text className="text-muted text-sm">Joined {new Date(u.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
          ))}

        {tab === "orders" && orders.length === 0 && (
          <Text className="text-muted text-center mt-10">No orders yet.</Text>
        )}
        {tab === "users" && users.length === 0 && (
          <Text className="text-muted text-center mt-10">No users registered yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({
  label,
  value,
  icon,
  wide,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  wide?: boolean;
}) {
  return (
    <View className={`bg-white rounded-2xl p-4 border border-line ${wide ? "w-full" : "w-[47%]"}`}>
      <Ionicons name={icon} size={22} color={Colors.primary} />
      <Text className="text-2xl font-bold text-dark mt-2">{value}</Text>
      <Text className="text-muted text-sm mt-1">{label}</Text>
    </View>
  );
}

function OrderCard({
  order,
  onStatusChange,
  compact,
}: {
  order: AdminOrder;
  onStatusChange: (id: string, status: string) => void;
  compact?: boolean;
}) {
  const statuses = ["accepted", "processing", "delivered", "cancelled"];
  const next = statuses[(statuses.indexOf(order.status) + 1) % statuses.length];

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-line">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-dark font-bold">{order.id}</Text>
          <Text className="text-muted text-sm mt-1">
            {order.userName} · {order.userEmail}
          </Text>
        </View>
        <View className="bg-primary/10 px-3 py-1 rounded-full">
          <Text className="text-primary text-xs font-semibold capitalize">{order.status}</Text>
        </View>
      </View>

      <Text className="text-muted text-sm mb-2">
        {new Date(order.createdAt).toLocaleString()} · {order.deliveryMethod}
      </Text>

      {!compact &&
        order.items.map((item, i) => (
          <Text key={i} className="text-dark text-sm">
            • {item.name} × {item.qty} — {formatPrice(item.price * item.qty)}
          </Text>
        ))}

      <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-line">
        <Text className="text-dark font-bold">{formatPrice(order.total)}</Text>
        <Pressable onPress={() => onStatusChange(order.id, next)} className="bg-bg px-3 py-2 rounded-lg">
          <Text className="text-primary text-sm font-medium capitalize">Mark {next}</Text>
        </Pressable>
      </View>
    </View>
  );
}
