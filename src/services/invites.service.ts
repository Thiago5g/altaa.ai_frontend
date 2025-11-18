import { z } from "zod";
import { authHeaders } from "./auth.service";
import { API_BASE } from "./api.base";

export const PendingInviteSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  companyName: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.string(),
});
export type PendingInvite = z.infer<typeof PendingInviteSchema>;

export async function getPendingInvites(): Promise<PendingInvite[]> {
  const res = await fetch(`${API_BASE}/invites/pending`, { 
    headers: authHeaders(), 
    cache: "no-store" 
  });
  if (!res.ok) throw new Error("Falha ao buscar convites");
  const json = await res.json();
  const parsed = z.array(PendingInviteSchema).safeParse(json);
  if (!parsed.success) throw new Error("Formato inválido de convites");
  return parsed.data;
}

export async function acceptInvite(inviteId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/invites/${inviteId}/accept`, { 
    method: "POST", 
    headers: authHeaders() 
  });
  if (!res.ok) throw new Error("Falha ao aceitar convite");
}

export async function declineInvite(inviteId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/invites/${inviteId}/decline`, { 
    method: "POST", 
    headers: authHeaders() 
  });
  if (!res.ok) throw new Error("Falha ao recusar convite");
}
