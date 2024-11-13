import { create } from "zustand";
import { persist } from "zustand/middleware";

const handler = (set) => ({
isAuthenticated: false,
user: null,
token: null,

handleLogin: (data) =>
   set({
      isAuthenticated: true,
      user: data.user,
      token: data.token,
   }),

handleLogout: () =>
   set({
      isAuthenticated: false,
      user: null,
      token: null,
   }),
});

export const useAuthStore = create(
persist(handler, {
   name: "auth-storage", 
   getStorage: () => localStorage,
})
);
