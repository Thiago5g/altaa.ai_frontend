"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Company, Member } from "@/services/companies.service";

export interface MembersModalProps {
  open: boolean;
  company: Company | null;
  loading: boolean;
  members: Member[];
  inviteEmail: string;
  inviteRole: string;
  currentUserRole: string | null;
  onClose: () => void;
  onChangeInviteEmail: (v: string) => void;
  onChangeInviteRole: (v: string) => void;
  onInvite: (e: React.FormEvent) => void;
  onDeleteMember: (membershipId: string, memberRole: string) => void;
}

export const MembersModal = (props: MembersModalProps) => {
  const {
    open,
    company,
    loading,
    members,
    inviteEmail,
    inviteRole,
    currentUserRole,
    onClose,
    onChangeInviteEmail,
    onChangeInviteRole,
    onInvite,
    onDeleteMember,
  } = props;
  if (!open || !company) return null;

  const canInviteMembers =
    currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const canDeleteMember = (memberRole: string) => {
    if (!currentUserRole) return false;
    if (memberRole === "OWNER") return false;
    return currentUserRole === "OWNER" || currentUserRole === "ADMIN";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6">
      <Card className="w/full max-w-xl relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <CardTitle>Membros - {company.name}</CardTitle>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && <p className="text-sm">Carregando membros...</p>}
          {!loading && (
            <div className="space-y-3">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-1">Nome</th>
                    <th className="text-left py-1">Email</th>
                    <th className="text-left py-1">Role</th>
                    <th className="text-left py-1">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.membershipId} className="odd:bg-muted/30">
                      <td className="py-1 pr-2">{m.name || "-"}</td>
                      <td className="py-1 pr-2">{m.email}</td>
                      <td className="py-1 pr-2 uppercase text-xs font-medium">
                        {m.role}
                      </td>
                      <td className="py-1 pr-2">
                        {canDeleteMember(m.role) && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              onDeleteMember(m.membershipId, m.role)
                            }
                          >
                            Remover
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {members.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-2 text-muted-foreground text-xs"
                      >
                        Nenhum membro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {canInviteMembers && (
                <form
                  onSubmit={onInvite}
                  className="flex flex-col gap-3 border-t pt-4"
                >
                  <div className="grid gap-3 md:grid-cols-3">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={inviteEmail}
                      onChange={(e) => onChangeInviteEmail(e.target.value)}
                    />
                    <select
                      className="h-9 rounded-md border bg-background px-3 text-sm"
                      value={inviteRole}
                      onChange={(e) => onChangeInviteRole(e.target.value)}
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="OWNER">OWNER</option>
                    </select>
                    <Button type="submit">Convidar</Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
