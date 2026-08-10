import { create } from "zustand";
import { persist } from "zustand/middleware";
import { asyncStorage } from "./storage";

type LocationState = {
  zone: string;
  area: string;
  address: string;
  hasCompletedOnboarding: boolean;
  isPhoneVerified: boolean;
  setZone: (zone: string) => void;
  setArea: (area: string) => void;
  setAddress: (address: string) => void;
  setLocation: (zone: string, area: string) => void;
  setPhoneVerified: (verified: boolean) => void;
  completeOnboarding: () => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      zone: "Karachi",
      area: "Clifton",
      address: "Karachi, Clifton",
      hasCompletedOnboarding: false,
      isPhoneVerified: false,
      setZone: (zone) => {
        set({ zone });
        const area = get().area;
        set({ address: `${zone}, ${area}` });
      },
      setArea: (area) => {
        set({ area });
        const zone = get().zone;
        set({ address: `${zone}, ${area}` });
      },
      setAddress: (address) => set({ address }),
      setLocation: (zone, area) => set({ zone, area, address: `${zone}, ${area}` }),
      setPhoneVerified: (verified) => set({ isPhoneVerified: verified }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true, isPhoneVerified: true }),
    }),
    { name: "nectar-location", storage: asyncStorage }
  )
);
