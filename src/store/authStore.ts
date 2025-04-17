import { create } from "zustand";
import { Users } from "../types/index";

type AuthState = {
  userCheck: Users | null;
  loading: boolean;
  setUserCheck: (user: Users | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuth = create<AuthState>((set) => ({
  userCheck: null,
  loading: true,
  setUserCheck: (user: Users | null) => set({ userCheck: user }),
  setLoading: (loading: boolean) => set({ loading }),
}));
