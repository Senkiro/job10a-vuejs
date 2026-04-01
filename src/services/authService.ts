import { authClient } from "@/api/authClient";

export type LoginPayload = {
  userCode: string;
  password: string;
  companyId: string;
};

export const login = (payload: LoginPayload) => {
  return authClient.post("/api/authen/login", payload);
};
