import { create } from "zustand";

interface User {
  firstname: string;
  lastname: string;
  email: string;
}

interface UserStore {
  user: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: { firstname: "", lastname: "", email: "" },
  setUser: (user) => set(() => ({ user: user })),
}));
