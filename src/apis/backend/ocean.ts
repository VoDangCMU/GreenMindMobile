import BackendInstance from "../instances/BackendInstance";
import { authHeader } from "../instances/getToken";

export function ensureUserOcean(ocean: IOcean): IOcean {
  const fix = (v: number) => {
    // nếu đang là scale 0–1 -> convert thành 1–100
    const normalized = v <= 1 ? v * 100 : v;
    // clamp lại 1–100
    return Math.min(100, Math.max(1, normalized));
  };

  return {
    O: fix(ocean.O),
    C: fix(ocean.C),
    E: fix(ocean.E),
    A: fix(ocean.A),
    N: fix(ocean.N),
  };
}

export async function getUserOcean(userId: string): Promise<IOceanResponse> {
  const res = await BackendInstance.get(`/big-five/user/${userId}`, { headers: authHeader() });
  return res.data;
}

export async function createUserOcean(userId: string, scores: IOcean): Promise<IOceanResponse> {
  const res = await BackendInstance.post("/big-five/submit", { user_id: userId, scores: scores }, { headers: authHeader() });
  return res.data.data;
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
