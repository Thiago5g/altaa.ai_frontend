"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getCompanies, type Company, getCompanyMembers, type Member, signout, inviteToCompany, selectActiveCompany, createCompany, getPendingInvites, type PendingInvite, acceptInvite, declineInvite } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MembersModal } from "@/components/modals/MembersModal";
import { CreateCompanyModal } from "@/components/modals/CreateCompanyModal";
import { InvitesModal } from "@/components/modals/InvitesModal";
import { toast } from "sonner";

interface MembersModalState {
  open: boolean;
  company: Company | null;
  loading: boolean;
  members: Member[];
  inviteEmail: string;
  inviteRole: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createLogo, setCreateLogo] = useState("");
  const [creating, setCreating] = useState(false);
  const [modal, setModal] = useState<MembersModalState>({
    open: false,
    company: null,
    loading: false,
    members: [],
    inviteEmail: "",
    inviteRole: "MEMBER",
  });
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [showInvites, setShowInvites] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login");
    } else {
      void loadCompanies();
      void loadInvites();
    }
  }, [router]);

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const list = await getCompanies();
      setCompanies(list);
    } catch (e) {
      toast.error((e as Error).message || "Erro ao carregar empresas");
    } finally {
      setLoadingCompanies(false);
    }
  };

  const loadInvites = async () => {
    try {
      const list = await getPendingInvites();
      setInvites(list);
    } catch {
      
    }
  };

  const openMembers = async (company: Company) => {
    setModal((m) => ({ ...m, open: true, company, loading: true }));
    try {
      await selectActiveCompany(company.id).catch(() => {});
      const data = await getCompanyMembers(company.id);
      setModal((m) => ({ ...m, members: data, loading: false }));
    } catch {
      toast.error("Falha ao buscar membros");
      setModal((m) => ({ ...m, loading: false }));
    }
  };

  const closeModal = () => {
    setModal({ open: false, company: null, loading: false, members: [], inviteEmail: "", inviteRole: "MEMBER" });
  };

  const onInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal.company || !modal.inviteEmail) return;
    try {
      await inviteToCompany(modal.company.id, modal.inviteEmail, modal.inviteRole);
      toast.success("Convite enviado");
      const data = await getCompanyMembers(modal.company.id);
      setModal((m) => ({ ...m, members: data, inviteEmail: "" }));
    } catch {
      toast.error("Erro ao convidar");
    }
  };

  const onSignout = () => {
    signout();
    router.replace("/login");
  };

  const onCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return toast.error("Nome é obrigatório");
    setCreating(true);
    try {
      await createCompany({ name: createName.trim(), logoUrl: createLogo.trim() || undefined });
      setShowCreate(false);
      setCreateName("");
      setCreateLogo("");
      toast.success("Empresa criada");
      await loadCompanies();
    } catch {
      toast.error("Falha ao criar empresa");
    } finally {
      setCreating(false);
    }
  };

  const handleAcceptInvite = async (id: string) => {
    await acceptInvite(id);
    await loadInvites();
    await loadCompanies();
  };

  const handleDeclineInvite = async (id: string) => {
    await declineInvite(id);
    await loadInvites();
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Empresas</h1>
        <div className="flex items-center gap-2">
          <Button variant={invites.length > 0 ? "destructive" : "outline"} onClick={() => setShowInvites(true)}>
            Convites{invites.length > 0 ? ` (${invites.length})` : ""}
          </Button>
          <Button onClick={() => setShowCreate(true)}>Criar empresa</Button>
          <Button variant="outline" onClick={onSignout}>Sair</Button>
        </div>
      </div>
      {loadingCompanies && <p className="text-sm text-muted-foreground">Carregando...</p>}
      {!loadingCompanies && companies.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma empresa ainda.</p>}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Nome</th>
              <th className="px-4 py-2 text-left font-medium">Logo</th>
              <th className="px-4 py-2 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="hover:bg-accent/40">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2 text-muted-foreground text-xs">{c.logoUrl || "-"}</td>
                <td className="px-4 py-2">
                  <Button size="sm" variant="secondary" onClick={() => void openMembers(c)}>Membros</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MembersModal
        open={modal.open}
        company={modal.company}
        loading={modal.loading}
        members={modal.members}
        inviteEmail={modal.inviteEmail}
        inviteRole={modal.inviteRole}
        onClose={closeModal}
        onChangeInviteEmail={(v) => setModal((m) => ({ ...m, inviteEmail: v }))}
        onChangeInviteRole={(v) => setModal((m) => ({ ...m, inviteRole: v }))}
        onInvite={onInvite}
      />

      <CreateCompanyModal
        open={showCreate}
        name={createName}
        logo={createLogo}
        creating={creating}
        onClose={() => setShowCreate(false)}
        onSubmit={onCreateCompany}
        onChangeName={setCreateName}
        onChangeLogo={setCreateLogo}
      />

      <InvitesModal
        open={showInvites}
        invites={invites}
        onClose={() => setShowInvites(false)}
        onAccept={handleAcceptInvite}
        onDecline={handleDeclineInvite}
      />
    </div>
  );
};

export default Dashboard;
