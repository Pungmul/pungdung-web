import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LoginMethod } from "../types";

type LoginStore = (
  | {
      isLoggedIn: true;
      lastLoginTime: Date;
      loginMethod: LoginMethod;
    }
  | {
      isLoggedIn: false;
      lastLoginTime: null;
      loginMethod: null;
    }
) & {
  setLogin: (method: LoginMethod) => void;
  setLogout: () => void;
};

export const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      lastLoginTime: null,
      loginMethod: null,

      setLogin: (method) => {
        const now = new Date();

        set({
          isLoggedIn: true,
          lastLoginTime: now,
          loginMethod: method,
        });
      },

      setLogout: () =>
        set({
          isLoggedIn: false,
          lastLoginTime: null,
          loginMethod: null,
        }),
    }),
    {
      name: "login-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        lastLoginTime: state.lastLoginTime,
        loginMethod: state.loginMethod,
      }),
    }
  )
);
