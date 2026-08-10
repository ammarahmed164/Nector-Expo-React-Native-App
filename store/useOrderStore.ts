import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";
import { asyncStorage } from "./storage";

export type Order = {
  id: string;
  items: { product: Product; qty: number }[];
  total: number;
  deliveryMethod: string;
  paymentLabel: string;
  promoLabel: string;
  createdAt: string;
  status: "accepted" | "processing" | "delivered";
};

type OrderState = {
  orders: Order[];
  lastOrderId: string | null;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => string;
  getOrder: (id: string) => Order | undefined;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastOrderId: null,
      addOrder: (order) => {
        const id = `ORD-${Date.now().toString().slice(-6)}`;
        const full: Order = {
          ...order,
          id,
          createdAt: new Date().toISOString(),
          status: "accepted",
        };
        set({ orders: [full, ...get().orders], lastOrderId: id });
        return id;
      },
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "nectar-orders", storage: asyncStorage }
  )
);
