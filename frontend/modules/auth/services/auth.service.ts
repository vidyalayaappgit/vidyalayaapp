const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export interface LoginPayload {
  groupCode: string;
  userCode: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: 'include',  // 👈 COOKIES SENT TO BROWSER!
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Login failed");
  }

  return res.json();
};
