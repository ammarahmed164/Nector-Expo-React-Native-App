import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Share,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getProductById } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useFavouriteStore } from "@/store/useFavouriteStore";
import QuantitySelector from "@/components/QuantitySelector";
import Button from "@/components/Button";
import { formatPrice } from "@/lib/formatPrice";
import { Colors } from "@/constants/colors";

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const productId = Array.isArray(id) ? id[0] : id ?? "";
  const product = getProductById(productId);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);
  const itemCount = useCartStore((s) => s.itemCount());
  const { toggleFavourite, isFavourite } = useFavouriteStore();
  const [expanded, setExpanded] = useState<"detail" | "nutrition" | "review" | null>("detail");

  const handleAddToBasket = () => {
    if (!product || adding) return;
    setAdding(true);
    addToCart(product, qty);
    setAdded(true);

    setTimeout(() => {
      setAdding(false);
    }, 400);

    setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  const handleShare = async () => {
    if (!product) return;
    const message = `Check out ${product.name} (${product.unit}) for ${formatPrice(product.price)} on Nectar — online groceries delivered fast!`;

    try {
      if (Platform.OS === "web") {
        if (typeof navigator !== "undefined" && navigator.share) {
          await navigator.share({ title: product.name, text: message });
          return;
        }
        Alert.alert("Share product", message);
        return;
      }

      await Share.share({
        title: product.name,
        message,
      });
    } catch (err: any) {
      if (err?.message?.includes("User did not share") || err?.message?.includes("cancel")) return;
      Alert.alert("Could not share", "Please try again.");
    }
  };

  const goToCart = () => router.push("/(tabs)/cart");

  if (!product) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-xl font-semibold text-dark mb-4">Product not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const bottomPad = Math.max(insets.bottom, 16);

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 + bottomPad }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-14 px-5 flex-row justify-between items-center mb-2">
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={24} color={Colors.dark} />
          </Pressable>
          <Text className="text-lg font-semibold text-dark">Product Detail</Text>
          <Pressable onPress={handleShare} hitSlop={12} accessibilityLabel="Share product">
            <Ionicons name="share-social-outline" size={22} color={Colors.dark} />
          </Pressable>
        </View>

        <View className="mx-5 bg-white rounded-3xl p-6 items-center mb-4">
          <Image source={{ uri: product.image }} className="w-full h-56" resizeMode="contain" />
          <View className="flex-row gap-2 mt-4">
            <View className="w-2 h-2 rounded-full bg-primary" />
            <View className="w-2 h-2 rounded-full bg-line" />
          </View>
        </View>

        <View className="bg-white rounded-t-3xl px-5 pt-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 pr-4">
              <Text className="text-2xl font-semibold text-dark">{product.name}</Text>
              <Text className="text-muted mt-1 text-base">{product.unit}</Text>
            </View>
            <Pressable onPress={() => toggleFavourite(product)} hitSlop={8}>
              <Ionicons
                name={isFavourite(product.id) ? "heart" : "heart-outline"}
                size={24}
                color={isFavourite(product.id) ? Colors.danger : Colors.dark}
              />
            </Pressable>
          </View>

          <View className="flex-row justify-between items-center mb-6">
            <QuantitySelector
              size="lg"
              qty={qty}
              onIncrement={() => setQty((q) => q + 1)}
              onDecrement={() => setQty((q) => Math.max(1, q - 1))}
            />
            <Text className="text-2xl font-semibold text-dark">{formatPrice(product.price)}</Text>
          </View>

          {(["detail", "nutrition", "review"] as const).map((section) => (
            <View key={section} className="border-b border-line py-4">
              <Pressable
                onPress={() => setExpanded(expanded === section ? null : section)}
                className="flex-row justify-between items-center"
              >
                <Text className="font-semibold text-dark text-lg">
                  {section === "detail" ? "Product Detail" : section === "nutrition" ? "Nutritions" : "Review"}
                </Text>
                <View className="flex-row items-center gap-2">
                  {section === "nutrition" && (
                    <View className="bg-bg rounded-full px-3 py-1">
                      <Text className="text-muted text-sm">{product.nutrition ?? "100gr"}</Text>
                    </View>
                  )}
                  {section === "review" && (
                    <View className="flex-row">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={14}
                          color={i < Math.round(product.rating ?? 4) ? Colors.secondary : Colors.line}
                        />
                      ))}
                    </View>
                  )}
                  <Ionicons
                    name={expanded === section ? "chevron-down" : "chevron-forward"}
                    size={18}
                    color={Colors.dark}
                  />
                </View>
              </Pressable>
              {expanded === section && section === "detail" && (
                <Text className="text-muted mt-3 leading-6">
                  {product.description ?? "No description available."}
                </Text>
              )}
              {expanded === section && section === "nutrition" && (
                <Text className="text-muted mt-3 leading-6">
                  Per {product.nutrition ?? "100g"} serving. Fresh quality groceries sourced for everyday healthy
                  meals. Nutritional values may vary slightly by batch.
                </Text>
              )}
              {expanded === section && section === "review" && (
                <Text className="text-muted mt-3 leading-6">
                  Rated {product.rating ?? 4.5}/5 by Nectar customers. Freshness and value praised in recent orders.
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky footer — above scroll layer for reliable taps */}
      <View
        style={[styles.footer, { paddingBottom: bottomPad }]}
        pointerEvents="box-none"
      >
        {added && (
          <Pressable onPress={goToCart} style={styles.addedBanner}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.addedText}>
              {qty} item{qty > 1 ? "s" : ""} added · Cart ({itemCount})
            </Text>
            <Text style={styles.viewCartLink}>View</Text>
          </Pressable>
        )}

        <View style={styles.footerInner} pointerEvents="auto">
          <Button
            title={added ? "Added to Basket ✓" : "Add To Basket"}
            onPress={handleAddToBasket}
            loading={adding}
            disabled={adding}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    elevation: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  footerInner: {
    width: "100%",
  },
  addedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF8F1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    gap: 8,
  },
  addedText: {
    flex: 1,
    color: Colors.dark,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  viewCartLink: {
    color: Colors.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
});
