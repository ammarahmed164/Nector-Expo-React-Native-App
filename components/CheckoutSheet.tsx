import { Modal, View, Text, Pressable, ActivityIndicator } from "react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/Button";
import { Colors } from "@/constants/colors";
import { formatPrice } from "@/lib/formatPrice";
import { API_URL } from "@/lib/api";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const deliveryOptions = ["Select Method", "Standard Delivery", "Express Delivery", "Store Pickup"];
const promoOptions = ["Pick discount", "10% OFF", "Free Delivery", "No Promo"];

export default function CheckoutSheet({ visible, onClose }: Props) {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const addOrder = useOrderStore((s) => s.addOrder);
  const user = useAuthStore((s) => s.user);
  const [deliveryIndex, setDeliveryIndex] = useState(0);
  const [promoIndex, setPromoIndex] = useState(0);
  const [placing, setPlacing] = useState(false);

  const deliveryFee = deliveryIndex === 1 ? 2.0 : deliveryIndex === 2 ? 4.0 : 0;
  const promoDiscount = promoIndex === 1 ? total() * 0.1 : promoIndex === 2 ? 2 : 0;
  const grandTotal = Math.max(total() + deliveryFee - promoDiscount, 0);

  const cycleDelivery = () => setDeliveryIndex((i) => (i + 1) % deliveryOptions.length);
  const cyclePromo = () => setPromoIndex((i) => (i + 1) % promoOptions.length);

  const handlePlaceOrder = () => {
    if (deliveryIndex === 0) return;
    setPlacing(true);
    setTimeout(async () => {
      const orderId = addOrder({
        items,
        total: grandTotal,
        deliveryMethod: deliveryOptions[deliveryIndex],
        paymentLabel: "Card",
        promoLabel: promoOptions[promoIndex],
      });

      try {
        await fetch(`${API_URL}/app/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: orderId,
            userId: user?.id ?? "guest",
            userName: user?.name ?? "Guest User",
            userEmail: user?.email ?? "guest@nectar.pk",
            userPhone: user?.phone,
            items: items.map((i) => ({
              productId: i.product.id,
              name: i.product.name,
              qty: i.qty,
              price: i.product.price,
              unit: i.product.unit,
            })),
            total: grandTotal,
            deliveryMethod: deliveryOptions[deliveryIndex],
            paymentLabel: "Card",
            promoLabel: promoOptions[promoIndex],
          }),
        });
      } catch {
        // local order still saved
      }

      clearCart();
      setPlacing(false);
      onClose();
      router.push({ pathname: "/order-accepted", params: { orderId } });
    }, 700);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable className="bg-white rounded-t-3xl px-5 pt-5 pb-8" onPress={(e) => e.stopPropagation()}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-semibold text-dark">Checkout</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.dark} />
            </Pressable>
          </View>

          <CheckoutRow label="Delivery" value={deliveryOptions[deliveryIndex]} onPress={cycleDelivery} />
          <CheckoutRow
            label="Payment"
            value=""
            onPress={() => {}}
            trailing={<Ionicons name="card-outline" size={20} color={Colors.dark} />}
          />
          <CheckoutRow label="Promo Code" value={promoOptions[promoIndex]} onPress={cyclePromo} />
          <CheckoutRow label="Total Cost" value={formatPrice(grandTotal)} onPress={() => {}} bold />

          <Text className="text-muted text-center text-sm leading-5 my-6">
            By placing an order you agree to our{" "}
            <Text className="text-dark font-semibold">Terms And Conditions</Text>
          </Text>

          {placing ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Button title="Place Order" onPress={handlePlaceOrder} disabled={deliveryIndex === 0} />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function CheckoutRow({
  label,
  value,
  onPress,
  trailing,
  bold,
}: {
  label: string;
  value: string;
  onPress: () => void;
  trailing?: ReactNode;
  bold?: boolean;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center justify-between py-4 border-b border-line">
      <Text className="text-lg text-dark">{label}</Text>
      <View className="flex-row items-center gap-2">
        {trailing}
        {!!value && (
          <Text className={`text-lg ${bold ? "font-semibold text-dark" : "text-muted"}`}>{value}</Text>
        )}
        <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
      </View>
    </Pressable>
  );
}
