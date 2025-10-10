import BackendInstance from "./instances/BackendInstance";

export interface RegisterPayload {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  date_of_birth: string;
  location: string;
}

export async function registerUser(payload: RegisterPayload) {
  const res = await BackendInstance.post("/auth/register/email", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
