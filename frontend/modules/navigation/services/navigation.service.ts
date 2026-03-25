const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const getNavigation = async () => {
  const res = await fetch(`${API_BASE}/navigation`, {
    method: "GET",
    credentials: "include", // 🔥 COOKIE
  });

  if (!res.ok) throw new Error("Navigation failed");

  return res.json();
};