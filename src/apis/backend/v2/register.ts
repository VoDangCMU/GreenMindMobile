import type { Gender } from "@/store/registerStore";
import BackendInstance from "@/apis/instances/BackendInstance";

export type TRegion = "North" | "Central" | "South" | "Unknown";

export interface IRegisterPayload {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  date_of_birth: string;
  location: string;
  gender: Gender;
  region?: TRegion;
}

export interface IRegisterResponse {
  message: string
  user: IUser
  access_token: string
  refresh_token: string
}

export interface IUser {
  id: string
  username: string
  email: string
  fullName: string
  dateOfBirth: string
  location: string
  region: string
  gender: string
  role: string
}

export async function registerUser(payload: IRegisterPayload) {
  const res = await BackendInstance.post<IRegisterResponse>("/auth/register/email", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
