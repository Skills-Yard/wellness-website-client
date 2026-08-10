import { apiClient } from "@/src/lib/api/apiClient";
import type { CreateUserBody, CreateUserResponse } from "@/src/types/auth";

export const userApi = {
  create(body: CreateUserBody, signupToken: string) {
    return apiClient.post<CreateUserBody, CreateUserResponse>("/users", body, {
      accessToken: signupToken,
    });
  },
};
