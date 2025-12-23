import axios from "axios";
import servers from "./servers";
import { useDevSettingsStore } from "@/store/devSettingsStore";

const AIApi = axios.create({
  baseURL: servers.BACKEND_HOST,
});

AIApi.interceptors.request.use(config => {
  let log = false;
  try {
    const state = useDevSettingsStore.getState();
    config.baseURL = state.backendUrl || servers.BACKEND_HOST;
    log = Boolean(state.axiosLogging);
  } catch (e) {
    config.baseURL = config.baseURL || servers.BACKEND_HOST;
  }

  if (log) console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || "");
  return config;
});

AIApi.interceptors.response.use(
  (response) => {
    const log = useDevSettingsStore.getState().axiosLogging;
    if (log) console.log(`[API RESPONSE] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const log = useDevSettingsStore.getState().axiosLogging;
    if (log) console.error(
      `[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error.response?.status,
      error.response?.data || error.message,
      JSON.stringify(error)
    );
    return Promise.reject(error);
  }
);

export default AIApi;