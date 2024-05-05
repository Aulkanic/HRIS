import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://hris-api.savant-sage.com/api/v1/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'multipart/form-data',
  },
});

export default axiosInstance;