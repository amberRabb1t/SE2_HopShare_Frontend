import axios from 'axios';
import { API_BASE, BASIC_AUTH_ENABLED } from '../utils/constants.js';
import { getAuth } from '../context/AuthContext.jsx';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 8000
});

// Interceptor adds Authorization for mutating requests if enabled
client.interceptors.request.use((config) => {
  if (BASIC_AUTH_ENABLED && ['post', 'put', 'delete', 'patch'].includes(config.method)) {
    const auth = getAuth();
    if (auth?.email && auth?.password) {
      const token = btoa(`${auth.email}:${auth.password}`);
      config.headers['Authorization'] = `Basic ${token}`;
    }
  }
  return config;
});

// Response normalization
client.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data || error.response);
    }
    return Promise.reject({ success: false, error: 'NETWORK_ERROR', message: error.message });
  }
);

export default client;