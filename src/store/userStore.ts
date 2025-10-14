import { create } from "zustand";

interface UserStore {
  lastUser: string;
  recentUsers: string[];
  setLastUser: (username: string) => void;
  addRecentUser: (username: string) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  lastUser: "",
  recentUsers: [],
  setLastUser: (username) => set({ lastUser: username }),
  addRecentUser: (username) => {
    const existing = get().recentUsers;
    const updated = [username, ...existing.filter(u => u !== username)];
    set({ recentUsers: updated.slice(0, 5) }); // keep last 5
  },
}));
