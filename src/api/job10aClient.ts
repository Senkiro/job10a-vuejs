import axios from "axios";

export const job10aClient = axios.create({
  baseURL: import.meta.env.VITE_JOB10A_API_URL,
  timeout: 10000,
  withCredentials: true,
});
