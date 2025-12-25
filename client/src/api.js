// client/src/api.js
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// כדי למנוע לופ אינסופי
let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err?.response?.status;

    // אם אין config – פשוט נכשלים
    if (!original) return Promise.reject(err);

    // אל תעשה refresh על refresh עצמו
    if (original.url?.includes("/auth/refreshToken")) {
      return Promise.reject(err);
    }

    // אם זה לא 401 – לא קשור אלינו
    if (status !== 401) return Promise.reject(err);

    // אם כבר ניסינו פעם אחת על אותה בקשה – לא ללופ
    if (original._retry) {
      return Promise.reject(err);
    }
    original._retry = true;

    try {
      // רענון אחד לכל הבקשות במקביל
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = api.post("/auth/refreshToken");
      }

      await refreshPromise;

      isRefreshing = false;
      refreshPromise = null;

      // נסה שוב את הבקשה המקורית
      return api(original);
    } catch (refreshErr) {
      isRefreshing = false;
      refreshPromise = null;

      // זה החלק שהיה חסר אצלך בוודאות:
      return Promise.reject(refreshErr);
    }
  }
);
