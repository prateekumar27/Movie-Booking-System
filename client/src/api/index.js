import axios from "axios";
import axiosConfig from "../utils/axiosConfig";

export const getRecommendedMovies = async () => {
  const res = await axiosConfig.get("/movies/recommended");
  return res.data;
};

export const getAllMovies = async () => {
  const res = await axiosConfig.get("/movies");
  return res.data;
};

export const getMovieById = async (id) => {
  const res = await axiosConfig.get(`/movies/getmovie/${id}`);
  return res.data;
};

export const getShowsByMovieAndLocation = async (movieId, location, date) => {
  const res = await axiosConfig.get("/shows/search", {
    params: { movieId, location, date },
  });
  return res.data;
};

export const getShowById = async (id) => {
  const res = await axiosConfig.get(`/shows/getbyid/${id}`);
  return res.data;
};

// Authentication APIs

export const sendOTP = async (email) => {
  const res = await axiosConfig.post("/auth/send-otp", { email });
  return res.data;
};

export const verifyOTP = async ({ email, otp, hash }) => {
  const res = await axiosConfig.post("/auth/verify-otp", { email, otp, hash });
  return res.data;
};

export const activate = async ({ id, name, phone, token }) => {
  const res = await axiosConfig.put(
    `/users/activateuser/${id}`,
    { name, phone },
    {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ send token
      },
    },
  );
  return res.data;
};

export const logout = async () => {
  const res = await axiosConfig.post("/auth/logout");
  return res.data;
};

export const getuser = async () => {
  const res = await axiosConfig.get("/users/getuser/me");
  return res.data;
};

//Payment APIs
export const CreateOrderRazorpay = async (reqData) => {
  const res = await axiosConfig.post("/payment/create-order", reqData);
  return res.data;
};

export const verifyOrderRazorpay = async (reqData) => {
  const res = await axiosConfig.post("/payment/verify-order", reqData);
  return res.data;
};

export const bookShow = async (reqData) => {
  const res = await axiosConfig.post("/bookings", reqData);
  return res.data;
};

export const getUserBookings = async () => {
  const res = await axiosConfig.get("/bookings");
  return res;
};

//Interceptors

axiosConfig.interceptors.request.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosConfig.get("/auth/refresh-token", {
          withCredentials: true,
        });
        const accessToken = res.data.accessToken;
        axiosConfig.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        return axiosConfig(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error); // ✅ always reject unhandled errors
  },
);
