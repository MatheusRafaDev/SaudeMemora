import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: "http://localhost:5204/api", // Base URL do backend em C#
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("sm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 404) {
      // Se a API retornar 404 (usuário não encontrado no DB) ou 401 (token expirado), força logout
      Cookies.remove("sm_token");
      localStorage.removeItem("sm_user");
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
