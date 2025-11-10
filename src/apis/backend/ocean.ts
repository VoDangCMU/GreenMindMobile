import BackendInstance from "../instances/BackendInstance";
import { authHeader } from "../instances/getToken";

export interface OceanScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

export interface OceanResponse {
  user_id: string;
  scores: OceanScores;
}

export async function getUserOcean(userId: string): Promise<OceanResponse> {
  const res = await BackendInstance.get(`/big-five/user/${userId}`, { headers: authHeader() });
  return res.data;
}

export async function createUserOcean(userId: string, scores: OceanScores): Promise<OceanResponse> {
  const res = await BackendInstance.post("/big-five/submit", { user_id: userId, scores }, { headers: authHeader() });
  return res.data;
}

export async function updateUserOcean(userId: string, scores: OceanScores): Promise<OceanResponse> {
  const res = await BackendInstance.put(`/big-five/user/${userId}`, { scores }, { headers: authHeader() });
  return res.data;
}

export const DEFAULT_OCEAN: OceanScores = {
  O: 50.0,
  C: 50.0,
  E: 50.0,
  A: 50.0,
  N: 50.0,
};
