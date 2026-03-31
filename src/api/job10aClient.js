import axios from "axios";

export const job60Client = axios.create({
  baseURL: import.meta.env.VITE_JOB10A_API_URL,
  timeout: 10000,
});
