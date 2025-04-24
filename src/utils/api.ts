import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8000"
  // baseURL: "http://44.195.89.245:8000"
  baseURL: "https://soso.danieldigiovanni.com"
});

api.interceptors.request.use(
  (config) => {
    if (config.url === "/auth/token" && config.method?.toLowerCase() === "post") {
      return config;
    }

    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.config.url === "/auth/token" && response.config.method?.toLowerCase() === "post") {
      if (response.data.access_token) {
        console.log(response.data.access_token);
        localStorage.setItem("jwt", response.data.access_token);
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
