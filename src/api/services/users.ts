import { apiCall, type ApiResponse } from "../client";
import { endpoints } from "../endpoints";

export interface UserProfile {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly picture?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UserSettings {
  readonly language: string;
  readonly theme: "light" | "dark";
  readonly notifications: boolean;
  readonly currency: string;
}

export const usersService = {
  getProfile: (): Promise<ApiResponse<UserProfile>> =>
    apiCall<UserProfile>(endpoints.users.profile, { method: "GET" }),

  updateProfile: (payload: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> =>
    apiCall<UserProfile>(endpoints.users.profile, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  getSettings: (): Promise<ApiResponse<UserSettings>> =>
    apiCall<UserSettings>(endpoints.users.settings, { method: "GET" }),

  updateSettings: (payload: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> =>
    apiCall<UserSettings>(endpoints.users.settings, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
