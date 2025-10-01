import axios from "axios";

// const api =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:6040"
//     : process.env.NODE_ENV === "production"
//     ? "https://ekemazon-b.vercel.app/"
//     : "http://localhost:6040";

const local = "http://localhost:6040";
const server = "https://ekemazon-b.vercel.app";
export const axiosInstance = axios.create({
  baseURL: server,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
