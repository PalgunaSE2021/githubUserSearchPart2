import { create } from "zustand";

interface UserStore {
  lastUser: string | null;
  setLastUser: (username: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  lastUser: null,
  setLastUser: (username) => set({ lastUser: username }),
}));
