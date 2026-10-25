/**
 * Cliente HTTP para lecturas públicas SIN efectos de tracking en el servidor
 * (FAQ, testimonios, lista de cursos). No envía X-Session-Id / X-Meta-Fbc /
 * X-Meta-Fbp ni Authorization → es una "simple request" CORS: sin preflight
 * OPTIONS. NO usar para endpoints que disparan CAPI (courses/:id, landings/.../full).
 */
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { normalizeResponseData } from './apiClient';

export const publicClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

publicClient.interceptors.response.use(
  <T>(response: AxiosResponse<T>): T => normalizeResponseData(response.data) as T,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(error);
  }
);
