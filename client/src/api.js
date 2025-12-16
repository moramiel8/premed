import axios from "axios";
import useInterceptors from "../src/axios/interceptors/useInterceptors";

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  useInterceptors(api);
};
