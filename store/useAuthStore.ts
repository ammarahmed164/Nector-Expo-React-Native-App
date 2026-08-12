import { create } from "zustand";
import { persist } from "zustand/middleware";
import { asyncStorage } from "./storage";
import { attachStoredProfile, saveStoredProfile } from "@/lib/profileAvatarStorage";

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
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        if (user) void saveStoredProfile(user);
      },
      updateUser: (patch) => {
        const current = get().user;
        if (!current) return;
        const next = { ...current, ...patch };
        if ("avatarUri" in patch && !patch.avatarUri) delete next.avatarUri;
        set({ user: next });
        void saveStoredProfile(next);
      },
      // Logout clears only authentication state. The per-user profile snapshot
      // remains available and is restored after the same user signs in again.
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "nectar-auth",
      storage: asyncStorage,
      onRehydrateStorage: () => (state) => {
        if (!state?.user?.id) return;
        attachStoredProfile(state.user).then((profile) => {
          const current = useAuthStore.getState().user;
          if (current?.id === profile.id) useAuthStore.getState().setUser(profile);
        });
      },
    }
  )
);
