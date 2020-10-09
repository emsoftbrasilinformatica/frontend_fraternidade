import axios from 'axios';

const api = axios.create({
  baseURL: 'http://19.74.80.206:3333',
});

export default api;
