import { create } from "zustand";

type FilterState = {
  category: string | null;
  brand: string | null;
  sort: string | null;
  setCategory: (category: string | null) => void;
  setBrand: (brand: string | null) => void;
  setSort: (sort: string | null) => void;
  reset: () => void;
  activeCount: () => number;
};

export const useFilterStore = create<FilterState>((set, get) => ({
  category: null,
  brand: null,
  sort: null,
  setCategory: (category) => set({ category }),
  setBrand: (brand) => set({ brand }),
  setSort: (sort) => set({ sort }),
  reset: () => set({ category: null, brand: null, sort: null }),
  activeCount: () => {
    const { category, brand, sort } = get();
    return [category, brand, sort].filter(Boolean).length;
  },
}));

/** Filter modal categories (App SS design) */
export const filterCategories = [
  { id: "eggs", label: "Eggs" },
  { id: "noodles-pasta", label: "Noodles & Pasta" },
  { id: "chips-crisps", label: "Chips & Crisps" },
  { id: "fast-food", label: "Fast Food" },
] as const;

export const filterBrands = [
  { id: "individual-collection", label: "Individual Collection" },
  { id: "cocola", label: "Cocola" },
  { id: "ifad", label: "Ifad" },
  { id: "kazi-farmas", label: "Kazi Farmas" },
] as const;

export const sortOptions = [
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
  { id: "popular", label: "Popularity" },
] as const;

/** Legacy home category chips (search compatibility) */
export const categoryLabelToId: Record<string, string> = {
  Fruits: "fruits",
  Vegetables: "vegetables",
  Meat: "meat",
  Beverages: "beverages",
  Pulses: "pulses",
  Rice: "rice",
};

export const sortLabelToId: Record<string, string> = Object.fromEntries(
  sortOptions.map((o) => [o.label, o.id])
);

export const sortIdToLabel: Record<string, string> = Object.fromEntries(
  sortOptions.map((o) => [o.id, o.label])
);

export const categoryIdToLabel: Record<string, string> = Object.fromEntries(
  filterCategories.map((o) => [o.id, o.label])
);
