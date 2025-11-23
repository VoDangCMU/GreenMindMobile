import BackendInstance from "../instances/BackendInstance";

export default async function login(payload: ILoginPayload) {
  const res = await BackendInstance.post("/auth/login/email", payload);
  return res.data as ILoginResponse;
}