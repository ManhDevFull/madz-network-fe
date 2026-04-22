import axios from "axios";

import { getApiBaseUrl } from "@/lib/env";
import type {
  AuthSuccessResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";
import type { UserProfile } from "@/types/user";

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  login(payload: LoginPayload) {
    return request<AuthSuccessResponse>("/auth/login", payload);
  },
  register(payload: RegisterPayload) {
    return request<AuthSuccessResponse>("/auth/register", payload);
  },
  me(accessToken: string) {
    return apiClient
      .get<UserProfile>("/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(extractErrorMessage(error));
      });
  },
};

async function request<T>(path: string, body: Record<string, string>): Promise<T> {
  try {
    const response = await apiClient.post<T>(path, body);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

function extractErrorMessage(data: unknown) {
  if (axios.isAxiosError(data)) {
    const responseData = data.response?.data;

    if (typeof responseData === "string" && responseData.trim().length > 0) {
      return responseData;
    }

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData
    ) {
      const message = responseData.message;
      if (Array.isArray(message)) {
        return message.join(", ");
      }
      if (typeof message === "string") {
        return message;
      }
    }

    if (typeof data.message === "string" && data.message.length > 0) {
      return data.message;
    }
  }

  if (typeof data === "object" && data !== null && "message" in data) {
    const message = data.message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    if (typeof message === "string") {
      return message;
    }
  }

  return "Request failed. Please verify the backend is running.";
}
