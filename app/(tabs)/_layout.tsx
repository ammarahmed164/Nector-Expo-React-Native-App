import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { useCartStore } from "@/store/useCartStore";

export default function TabsLayout() {
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: { fontSize: 10, fontFamily: "Poppins_600SemiBold", marginTop: 1 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "storefront" : "storefront-outline"} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "compass" : "compass-outline"} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <View className={`w-11 h-8 rounded-xl items-center justify-center ${focused ? "bg-primarySoft" : "bg-transparent"}`}>
              <Ionicons name={focused ? "cart" : "cart-outline"} size={20} color={color} />
              {itemCount > 0 && (
                <View className="absolute -top-1 right-0 bg-danger rounded-full min-w-[16px] h-4 px-1 items-center justify-center border border-white">
                  <Text className="text-white text-[10px] font-semibold">{itemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: "Favourite",
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "heart" : "heart-outline"} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "person" : "person-outline"} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
  return (
    <View className={`w-11 h-8 rounded-xl items-center justify-center ${focused ? "bg-primarySoft" : "bg-transparent"}`}>
      <Ionicons name={name} size={20} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 76,
    paddingBottom: 9,
    paddingTop: 7,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 12,
  },
  tabItem: { borderRadius: 18 },
});
