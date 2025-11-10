
import BackendInstance from "../instances/BackendInstance";

export interface ILoginUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export interface ILoginResponse {
  message: string;
  user: ILoginUser;
  access_token: string;
  refresh_token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(payload: LoginPayload) {
  const res = await BackendInstance.post("/auth/login/email", payload);
  return res.data as ILoginResponse;
}