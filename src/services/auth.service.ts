import { z } from "zod";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { API_BASE } from "./api.base";

const TokenSchema = z.object({ access_token: z.string() });

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie("token");
}

export function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signin(email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Falha no login");
  const json = await res.json();
  const parsed = TokenSchema.safeParse(json);
  if (!parsed.success) throw new Error("Resposta inválida do servidor");
  setCookie("token", parsed.data.access_token, 7);
}

export async function signup(name: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Falha ao criar usuário");
  const json = await res.json();
  const parsed = TokenSchema.safeParse(json);
  if (!parsed.success) throw new Error("Resposta inválida do servidor");
  setCookie("token", parsed.data.access_token, 7);
}

export function signout(): void {
  deleteCookie("token");
}
