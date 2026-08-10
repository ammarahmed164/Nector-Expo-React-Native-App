import { create } from "zustand";
import { persist } from "zustand/middleware";
import { asyncStorage } from "./storage";
import { getProfileAvatar } from "@/lib/profileAvatarStorage";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUri?: string;
} | null;

type AuthState = {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  updateUser: (patch: Partial<NonNullable<User>>) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updateUser: (patch) => {
        const current = get().user;
        if (!current) return;
        const next = { ...current, ...patch };
        if ("avatarUri" in patch && !patch.avatarUri) delete next.avatarUri;
        set({ user: next });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "nectar-auth",
      storage: asyncStorage,
      onRehydrateStorage: () => (state) => {
        if (!state?.user?.id || state.user.avatarUri) return;
        getProfileAvatar(state.user.id).then((avatarUri) => {
          if (avatarUri) useAuthStore.getState().updateUser({ avatarUri });
        });
      },
    }
  )
);
