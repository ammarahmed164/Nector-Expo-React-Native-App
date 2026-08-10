import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";
import { asyncStorage } from "./storage";

export type CartItem = { product: Product; qty: number };

type CartState = {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  addManyToCart: (products: Product[]) => void;
  removeFromCart: (productId: string) => void;
  incrementQty: (productId: string) => void;
  decrementQty: (productId: string) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...state.items, { product, qty }] };
        }),
      addManyToCart: (products) => {
        products.forEach((p) => get().addToCart(p, 1));
      },
      removeFromCart: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
      incrementQty: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, qty: i.qty + 1 } : i
          ),
        })),
      decrementQty: (productId) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.product.id === productId ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "nectar-cart", storage: asyncStorage }
  )
);
