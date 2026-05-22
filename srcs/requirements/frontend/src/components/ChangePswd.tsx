import { API_USERS, authHeaders, handleResponse } from "../api/config";

export async function updatePswd(password: string): Promise<{ password: string | null }> {
  const res = await fetch(`${API_USERS}/me/settings`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  return handleResponse<{ password: string | null }>(res);
}