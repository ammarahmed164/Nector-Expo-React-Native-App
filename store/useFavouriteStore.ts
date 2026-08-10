import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";
import { asyncStorage } from "./storage";

type FavouriteState = {
  items: Product[];
  toggleFavourite: (product: Product) => void;
  isFavourite: (productId: string) => boolean;
};

export const useFavouriteStore = create<FavouriteState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleFavourite: (product) =>
        set((state) => {
          const exists = state.items.some((p) => p.id === product.id);
          return {
            items: exists
              ? state.items.filter((p) => p.id !== product.id)
              : [...state.items, product],
          };
        }),
      isFavourite: (productId) => get().items.some((p) => p.id === productId),
    }),
    { name: "nectar-favourites", storage: asyncStorage }
  )
);
