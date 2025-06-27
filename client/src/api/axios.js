// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL,
  withCredentials: true, 
});

export default axiosInstance;
