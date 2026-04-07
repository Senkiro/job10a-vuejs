import { job10aClient } from "./job10aClient";

const TOKEN_KEY = "access_token";

export function setupInterceptors() {
  job10aClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
}
