import BackendInstance from "../instances/BackendInstance";

export async function getProfile(token: string): Promise<IUserSnakeCase> {
  const res = await BackendInstance.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as IUserSnakeCase;
}
