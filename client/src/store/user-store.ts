import { create } from "zustand";

export interface User {
  firstname: string;
  lastname: string;
  email: string;
}

interface UserStore {
  user: User | null;
  userId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  userId: JSON.parse(localStorage.getItem("userId") || "null"),
  setUser: (user: User) => {
    set(() => ({ user }));
  },
  clearUser: () => {
    set(() => ({ user: null, userId: null }));
  },
}));
