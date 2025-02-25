import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL as string;

export const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
});

export { default as api } from "./api/index";
