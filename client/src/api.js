// client/src/api.js

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (!original) return Promise.reject(err);

    const url = original.url || "";

    // ❗ אל תנסה לעשות refresh אם כבר אנחנו ב-refresh (או login/logout)
    if (url.includes("/auth/refreshToken") || url.includes("/auth/login") || url.includes("/auth/logout")) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      // ... כל הקוד שלך
    }

    return Promise.reject(err);
  }
);
