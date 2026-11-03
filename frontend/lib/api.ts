const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    if (endpoint.startsWith("/admin") && !endpoint.startsWith("/admin/login")) {
      token = localStorage.getItem("gradia_admin_token") || localStorage.getItem("gradia_token");
    } else {
      token = localStorage.getItem("gradia_token") || localStorage.getItem("gradia_admin_token");
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Terjadi kesalahan pada server.");
  }

  return data as T;
}
