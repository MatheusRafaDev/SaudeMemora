import axios from 'axios';


const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080'; 

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export default axiosInstance;
