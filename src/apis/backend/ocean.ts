import BackendInstance from "../instances/BackendInstance";
import { authHeader } from "../instances/getToken";

export async function getUserOcean(userId: string): Promise<IOceanResponse> {
  const res = await BackendInstance.get(`/big-five/user/${userId}`, { headers: authHeader() });
  return res.data;
}

export async function createUserOcean(userId: string, scores: IOcean): Promise<IOceanResponse> {
  const res = await BackendInstance.post("/big-five/submit", { user_id: userId, scores }, { headers: authHeader() });
  return res.data;
}

export async function updateUserOcean(userId: string, scores: IOcean): Promise<IOceanResponse> {
  const res = await BackendInstance.put(`/big-five/user/${userId}`, { scores }, { headers: authHeader() });
  return res.data;
}

export const DEFAULT_OCEAN: IOcean = {
  O: 50.0,
  C: 50.0,
  E: 50.0,
  A: 50.0,
  N: 50.0,
};
