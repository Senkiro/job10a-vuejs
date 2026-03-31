import { authClient } from "@/api/clients/authClient";

export const login = (payload) => {
  return authClient.post("/api/authen/login", payload);
};
