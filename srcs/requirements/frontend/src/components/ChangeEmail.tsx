import { API_USERS, authHeaders, handleResponse } from "../api/config";

export async function ChangeEmail(email: string): Promise<{ email: string | null }> {
  const res = await fetch(`${API_USERS}/me/settings`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse<{ email: string | null }>(res);
}