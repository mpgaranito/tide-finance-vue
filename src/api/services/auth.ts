import { apiCall, type ApiResponse } from "../client";
import { endpoints } from "../endpoints";

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload extends LoginPayload {
  readonly name: string;
}

export interface AuthResponse {
  readonly token: string;
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly picture?: string;
  };
}

export const authService = {
  login: (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> =>
    apiCall<AuthResponse>(endpoints.auth.login, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: (): Promise<ApiResponse<void>> =>
    apiCall<void>(endpoints.auth.logout, { method: "POST" }),

  register: (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> =>
    apiCall<AuthResponse>(endpoints.auth.register, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
