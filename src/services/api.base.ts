export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export function getHeaders(includeAuth = false, token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
