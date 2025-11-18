import { z } from "zod";
import { authHeaders } from "./auth.service";
import { API_BASE } from "./api.base";

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  userRole: z.string().optional(),
});
export type Company = z.infer<typeof CompanySchema>;

const CompaniesListSchema = z.object({
  data: z.array(CompanySchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

export type CompaniesListResponse = z.infer<typeof CompaniesListSchema>;

export const MemberSchema = z.object({
  membershipId: z.string(),
  userId: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  role: z.string(),
  createdAt: z.string(),
});
export type Member = z.infer<typeof MemberSchema>;

const MembersResponseSchema = z.object({
  data: z.array(MemberSchema),
  companyId: z.string(),
  total: z.number(),
  currentUserRole: z.string(),
});

export async function getCompanies(page = 1, pageSize = 10): Promise<CompaniesListResponse> {
  const res = await fetch(`${API_BASE}/companies?page=${page}&pageSize=${pageSize}`, { 
    headers: authHeaders(), 
    cache: "no-store" 
  });
  if (res.status === 401) throw new Error("Não autorizado");
  if (!res.ok) throw new Error("Falha ao buscar empresas");
  const json = await res.json();
  const parsed = CompaniesListSchema.safeParse(json);
  if (!parsed.success) throw new Error("Formato inválido de empresas");
  return parsed.data;
}

export async function createCompany(payload: { name: string; logoUrl?: string | null }): Promise<Company> {
  const res = await fetch(`${API_BASE}/company`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Falha ao criar empresa");
  const json = await res.json();
  const parsed = CompanySchema.safeParse(json);
  if (!parsed.success) throw new Error("Formato inválido de empresa");
  return parsed.data;
}

export async function updateCompany(companyId: string, payload: { name: string; logoUrl?: string | null }): Promise<Company> {
  const res = await fetch(`${API_BASE}/company/${companyId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Falha ao atualizar empresa");
  const json = await res.json();
  const parsed = CompanySchema.safeParse(json);
  if (!parsed.success) throw new Error("Formato inválido de empresa");
  return parsed.data;
}

export async function deleteCompany(companyId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/company/${companyId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Falha ao deletar empresa");
}

export async function selectActiveCompany(companyId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/company/${companyId}/select`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Falha ao selecionar empresa ativa");
}

export async function getCompanyMembers(companyId: string): Promise<{ members: Member[]; currentUserRole: string }> {
  const res = await fetch(`${API_BASE}/company/${companyId}/members`, { 
    headers: authHeaders(), 
    cache: "no-store" 
  });
  if (!res.ok) throw new Error("Falha ao buscar membros");
  const json = await res.json();
  const parsed = MembersResponseSchema.safeParse(json);
  if (!parsed.success) throw new Error("Formato inválido de membros");
  return { members: parsed.data.data, currentUserRole: parsed.data.currentUserRole };
}

export async function inviteToCompany(companyId: string, email: string, role: string): Promise<void> {
  const res = await fetch(`${API_BASE}/company/${companyId}/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ email, role }),
  });
  if (!res.ok) throw new Error("Falha ao convidar usuário");
}

export async function deleteMember(companyId: string, membershipId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/company/${companyId}/member/${membershipId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Falha ao remover membro");
}
