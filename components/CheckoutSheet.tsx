import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
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

const deliveryOptions = [
  { label: "Standard", fullLabel: "Standard Delivery", detail: "60–90 min", fee: 2, icon: "bicycle-outline" as const },
  { label: "Express", fullLabel: "Express Delivery", detail: "30–45 min", fee: 4, icon: "flash-outline" as const },
  { label: "Pickup", fullLabel: "Store Pickup", detail: "From store", fee: 0, icon: "storefront-outline" as const },
];

const promoOptions = [
  { label: "No promo", type: "none" as const },
  { label: "10% OFF", type: "percent" as const },
  { label: "Free delivery", type: "delivery" as const },
];

export default function CheckoutSheet({ visible, onClose }: Props) {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const addOrder = useOrderStore((s) => s.addOrder);
  const user = useAuthStore((s) => s.user);
  const [deliveryIndex, setDeliveryIndex] = useState(0);
  const [promoIndex, setPromoIndex] = useState(0);
  const [placing, setPlacing] = useState(false);

  const subtotal = total();
  const selectedDelivery = deliveryOptions[deliveryIndex];
  const selectedPromo = promoOptions[promoIndex];
  const deliveryFee = selectedDelivery.fee;
  const promoDiscount =
    selectedPromo.type === "percent" ? subtotal * 0.1 : selectedPromo.type === "delivery" ? deliveryFee : 0;
  const grandTotal = Math.max(subtotal + deliveryFee - promoDiscount, 0);

  const cyclePromo = () => setPromoIndex((index) => (index + 1) % promoOptions.length);

  const handlePlaceOrder = () => {
    if (placing || items.length === 0) return;
    setPlacing(true);
    setTimeout(async () => {
      const deliveryMethod = selectedDelivery.fullLabel;
      const paymentLabel = "Cash on Delivery";
      const orderId = addOrder({
        items,
        total: grandTotal,
        deliveryMethod,
        paymentLabel,
        promoLabel: selectedPromo.label,
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
            items: items.map((item) => ({
              productId: item.product.id,
              name: item.product.name,
              qty: item.qty,
              price: item.product.price,
              unit: item.product.unit,
            })),
            total: grandTotal,
            deliveryMethod,
            paymentLabel,
            promoLabel: selectedPromo.label,
          }),
        });
      } catch {
        // The order remains available locally if syncing is temporarily unavailable.
      }

      clearCart();
      setPlacing(false);
      onClose();
      router.push({ pathname: "/order-accepted", params: { orderId } });
    }, 700);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <Pressable className="flex-1 bg-black/45 justify-end" onPress={onClose}>
        <Pressable
          className="bg-canvas rounded-t-[32px] max-h-[92%] overflow-hidden"
          onPress={(event) => event.stopPropagation()}
          style={styles.sheet}
        >
          <View className="w-11 h-1 rounded-full bg-lineStrong self-center mt-3 mb-2" />

          <View className="flex-row justify-between items-center px-5 py-3">
            <View>
              <Text className="text-2xl font-bold text-dark">Checkout</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
                <Text className="text-muted text-xs ml-1">Secure order confirmation</Text>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              className="w-10 h-10 rounded-2xl bg-white border border-line items-center justify-center"
            >
              <Ionicons name="close" size={22} color={Colors.dark} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28 }}
          >
            <Text className="text-dark font-semibold text-base mb-3">Delivery option</Text>
            <View className="flex-row gap-2 mb-5">
              {deliveryOptions.map((option, index) => {
                const selected = deliveryIndex === index;
                return (
                  <Pressable
                    key={option.label}
                    onPress={() => setDeliveryIndex(index)}
                    className={`flex-1 rounded-2xl border px-2 py-3 items-center ${
                      selected ? "bg-primarySoft border-primary" : "bg-white border-line"
                    }`}
                  >
                    <View className={`w-9 h-9 rounded-xl items-center justify-center mb-2 ${selected ? "bg-primary" : "bg-canvas"}`}>
                      <Ionicons name={option.icon} size={18} color={selected ? Colors.white : Colors.muted} />
                    </View>
                    <Text className={`text-xs font-semibold ${selected ? "text-primaryDark" : "text-dark"}`}>
                      {option.label}
                    </Text>
                    <Text className="text-muted text-[10px] mt-0.5">{option.detail}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text className="text-dark font-semibold text-base mb-3">Payment</Text>
            <View className="bg-white border border-primary/40 rounded-3xl p-4 mb-4" style={styles.paymentCard}>
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-primarySoft items-center justify-center mr-3">
                  <Ionicons name="cash-outline" size={25} color={Colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-dark font-semibold text-base">Cash on Delivery</Text>
                  <Text className="text-muted text-xs mt-1">Pay in cash when your order arrives</Text>
                </View>
                <View className="bg-primarySoft rounded-full px-2.5 py-1 flex-row items-center">
                  <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                  <Text className="text-primary text-[10px] font-semibold ml-1">Selected</Text>
                </View>
              </View>
            </View>

            <Pressable onPress={cyclePromo} className="bg-white border border-line rounded-2xl px-4 py-3.5 mb-4 flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-secondarySoft items-center justify-center mr-3">
                <Ionicons name="ticket-outline" size={20} color={Colors.secondary} />
              </View>
              <View className="flex-1">
                <Text className="text-muted text-xs">Promo code</Text>
                <Text className="text-dark font-semibold text-sm mt-0.5">{selectedPromo.label}</Text>
              </View>
              <Text className="text-primary text-xs font-semibold mr-1">Change</Text>
              <Ionicons name="chevron-forward" size={17} color={Colors.muted} />
            </Pressable>

            <View className="bg-white border border-line rounded-3xl p-4 mb-4">
              <Text className="text-dark font-semibold text-base mb-3">Order summary</Text>
              <SummaryRow label={`Subtotal · ${items.length} item${items.length === 1 ? "" : "s"}`} value={formatPrice(subtotal)} />
              <SummaryRow label="Delivery fee" value={deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)} />
              {promoDiscount > 0 && <SummaryRow label="Promo saving" value={`− ${formatPrice(promoDiscount)}`} accent />}
              <View className="h-px bg-line my-3" />
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-dark font-bold text-base">Total</Text>
                  <Text className="text-muted text-[10px] mt-0.5">Taxes included</Text>
                </View>
                <Text className="text-dark font-bold text-xl">{formatPrice(grandTotal)}</Text>
              </View>
            </View>

            <View className="flex-row items-start px-1 mb-5">
              <Ionicons name="lock-closed-outline" size={15} color={Colors.muted} style={{ marginTop: 2 }} />
              <Text className="text-muted text-[11px] leading-4 ml-2 flex-1">
                By placing this order, you agree to Nectar&apos;s Terms & Conditions and delivery policy.
              </Text>
            </View>

            <Button
              title={placing ? "Placing your order..." : `Place order  •  ${formatPrice(grandTotal)}`}
              icon={placing ? undefined : "bag-check-outline"}
              onPress={handlePlaceOrder}
              loading={placing}
              disabled={items.length === 0}
            />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SummaryRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-muted text-sm">{label}</Text>
      <Text className={`text-sm font-medium ${accent ? "text-primary" : "text-dark"}`}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 24,
  },
  paymentCard: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
});
