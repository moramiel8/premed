// client/src/api.js

import axios from "axios";

const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


let isRefreshing = false;
let queue = [];

function processQueue(error) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (!original) return Promise.reject(err);

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: () => resolve(api(original)),
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        await api.post("/auth/refreshToken"); 
        processQueue(null);
        return api(original);
      } catch (e) {
        processQueue(e);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);
