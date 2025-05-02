import axios from 'axios';


const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:7070'; // Default para localhost se não estiver definida

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export default axiosInstance;
