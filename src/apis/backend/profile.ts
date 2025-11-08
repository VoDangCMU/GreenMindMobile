import BackendInstance from "../instances/BackendInstance";

export interface Profile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export async function getProfile(token: string): Promise<Profile> {
  const res = await BackendInstance.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
