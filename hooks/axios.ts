import axios, { type AxiosRequestConfig, type Method } from "axios";

import { getApiBaseUrl } from "@/lib/env";
import { useAuthStore } from "@/store/auth.store";

const axiosClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

export async function handleAPI<TResponse = unknown, TBody = unknown>(
  url: string,
  method: Method,
  body?: TBody,
) {
  const accessToken = useAuthStore.getState().accessToken;

  const config: AxiosRequestConfig<TBody> = {
    url,
    method,
    data: body,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };

  const response = await axiosClient.request<TResponse, { data: TResponse }, TBody>(
    config,
  );

  return response.data;
}

export { axiosClient };
