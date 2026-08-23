import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5204',
});

// Optionally add interceptors here

export default axiosInstance;
