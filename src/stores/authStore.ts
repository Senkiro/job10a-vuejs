import { defineStore } from "pinia";
import { login, type LoginPayload } from "@/services/authService";

type AuthState = {
  token: string | null;
  companyId: string | null;
  userCode: string | null;
  currentKesn: string | null;
  currentSyorikikan: string | null;
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null,
    companyId: null,
    userCode: null,
    currentKesn: null,
    currentSyorikikan: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async loginAction(payload: LoginPayload) {
      const response = await login(payload);

      this.token = response.data?.data?.token ?? null;
      this.companyId =
        response.data?.data?.companyId ?? payload.companyId ?? null;
      this.userCode = payload.userCode ?? null;
      this.currentKesn = response.data?.data?.currentKesn ?? null;
      this.currentSyorikikan = response.data?.data?.currentSyorikikan ?? null;

      return response;
    },

    setProcessingPeriod(kesn: string | null, syorikikan: string | null) {
      this.currentKesn = kesn;
      this.currentSyorikikan = syorikikan;
    },

    logout() {
      this.token = null;
      this.companyId = null;
      this.userCode = null;
      this.currentKesn = null;
      this.currentSyorikikan = null;
    },
  },

  persist: {
    storage: localStorage,
    pick: [
      "token",
      "companyId",
      "userCode",
      "currentKesn",
      "currentSyorikikan",
    ],
  },
});
