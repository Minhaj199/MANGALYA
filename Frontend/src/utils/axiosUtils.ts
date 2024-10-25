import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";


const client = axios.create({ baseURL: 'http://localhost:8000' });


client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  let adminToken = localStorage.getItem('adminToken');  
  if (adminToken) {
   config.headers['AuthorizationForAdmin'] = adminToken;
  }

  let userToken = localStorage.getItem('userToken');
  if (userToken) {
    config.headers['AuthForUser'] = userToken;
  }

  return config;
}, (error) => {

  return Promise.reject(error);
});


client.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    return Promise.reject(new Error(error.response?.data?.message || error.message));
  }
);


export const request = async <T>(options: AxiosRequestConfig): Promise<T> => {
  try {
    return await client(options);
  } catch (error) {
    throw error;
  }
};
