import { defineStore } from "pinia";
import { login, type LoginPayload } from "@/services/authService";

type AuthState = {
  token: string | null;
  companyId: string | null;
  userCode: string | null;
};

const TOKEN_KEY = "access_token";
const COMPANY_KEY = "company_id";
const USER_KEY = "user_code";
const CURRENT_KESN_KEY = "current_kesn";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem(TOKEN_KEY),
    companyId: localStorage.getItem(COMPANY_KEY),
    userCode: localStorage.getItem(USER_KEY),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async loginAction(payload: LoginPayload) {
      const response = await login(payload);

      const token = response.data?.data?.token;

      const companyId =
        response.data?.data?.companyId || payload.companyId || null;

      const currentKesn = response.data?.data?.currentKesn || null;

      this.token = token;
      this.companyId = companyId;
      this.userCode = payload.userCode;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(CURRENT_KESN_KEY, currentKesn);
      if (companyId) localStorage.setItem(COMPANY_KEY, companyId);
      localStorage.setItem(USER_KEY, payload.userCode);

      return response;
    },

    logout() {
      this.token = null;
      this.companyId = null;
      this.userCode = null;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(COMPANY_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});
