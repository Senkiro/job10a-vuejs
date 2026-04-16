import { job10aClient } from "./job10aClient";
import { useAuthStore } from "@/stores/authStore";

export function setupInterceptors() {
  job10aClient.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();

      if (authStore.token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
}
