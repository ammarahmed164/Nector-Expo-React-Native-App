import { create } from "zustand";
import { persist } from "zustand/middleware";
import { asyncStorage } from "./storage";

type AdminState = {
  token: string | null;
  email: string | null;
  setSession: (token: string, email: string) => void;
  logout: () => void;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      setSession: (token, email) => set({ token, email }),
      logout: () => set({ token: null, email: null }),
    }),
    { name: "nectar-admin", storage: asyncStorage }
  )
);
