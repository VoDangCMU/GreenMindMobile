import axios from "axios";
import servers from "./servers";

const AIApi = axios.create({
  baseURL: servers.BACKEND_HOST,
});

AIApi.interceptors.request.use(config => {
  console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || "");
  return config;
});

AIApi.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(
      `[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error.response?.status,
      error.response?.data || error.message,
      JSON.stringify(error)
    );
    return Promise.reject(error);
  }
);

export default AIApi;