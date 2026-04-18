// import axios from "axios";

// const axiosConfig = axios.create({
//   baseURL: "http://localhost:3000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosConfig;

import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor — refresh token on 401
let isRefreshing = false; // ✅ flag to prevent multiple refresh calls

axiosConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing &&
      !originalRequest.url.includes("/auth/refresh-token") &&
      !originalRequest.url.includes("/users/getuser/me") // ✅ don't retry load user
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosConfig.post("/auth/refresh-token");
        isRefreshing = false;
        return axiosConfig(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError); // ✅ just reject, no redirect
      }
    }

    return Promise.reject(error); // ✅ remove console.error too
  },
);

export default axiosConfig;
