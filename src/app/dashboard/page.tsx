"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAuthToken, signout } from "@/services/auth.service";
import { 
  type Company, 
  type Member, 
  getCompanies, 
  getCompanyMembers, 
  inviteToCompany, 
  selectActiveCompany, 
  createCompany, 
  updateCompany, 
  deleteCompany, 
  deleteMember 
} from "@/services/companies.service";
import { 
  type PendingInvite,
  getPendingInvites, 
  acceptInvite, 
  declineInvite
} from "@/services/invites.service";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { MembersModal } from "@/components/modals/MembersModal";
import { CreateCompanyModal } from "@/components/modals/CreateCompanyModal";
import { InvitesModal } from "@/components/modals/InvitesModal";
import { EditCompanyModal } from "@/components/modals/EditCompanyModal";
import { DeleteCompanyModal } from "@/components/modals/DeleteCompanyModal";
import { toast } from "sonner";

interface MembersModalState {
  open: boolean;
  company: Company | null;
  loading: boolean;
  members: Member[];
  inviteEmail: string;
  inviteRole: string;
  currentUserRole: string | null;
}

const Dashboard = () => {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });
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
    currentUserRole: null,
  });
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [showInvites, setShowInvites] = useState(false);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    company: Company | null;
    name: string;
    logo: string;
    updating: boolean;
  }>({
    open: false,
    company: null,
    name: "",
    logo: "",
    updating: false,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    company: Company | null;
    deleting: boolean;
  }>({
    open: false,
    company: null,
    deleting: false,
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login");
    } else {
      void loadCompanies(1);
      void loadInvites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadCompanies = async (page = 1) => {
    setLoadingCompanies(true);
    try {
      const response = await getCompanies(page, pagination.pageSize);
      setCompanies(response.data);
      setPagination({
        currentPage: response.page,
        pageSize: response.pageSize,
        total: response.total,
      });
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
      setModal((m) => ({ ...m, members: data.members, currentUserRole: data.currentUserRole, loading: false }));
    } catch {
      toast.error("Falha ao buscar membros");
      setModal((m) => ({ ...m, loading: false }));
    }
  };

  const closeModal = () => {
    setModal({ open: false, company: null, loading: false, members: [], inviteEmail: "", inviteRole: "MEMBER", currentUserRole: null });
  };

  const onInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal.company || !modal.inviteEmail) return;
    try {
      await inviteToCompany(modal.company.id, modal.inviteEmail, modal.inviteRole);
      toast.success("Convite enviado");
      const data = await getCompanyMembers(modal.company.id);
      setModal((m) => ({ ...m, members: data.members, currentUserRole: data.currentUserRole, inviteEmail: "" }));
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
      await loadCompanies(1); // Volta para a primeira página após criar
    } catch {
      toast.error("Falha ao criar empresa");
    } finally {
      setCreating(false);
    }
  };

  const handleAcceptInvite = async (id: string) => {
    await acceptInvite(id);
    await loadInvites();
    await loadCompanies(pagination.currentPage); // Mantém na página atual
  };

  const handleDeclineInvite = async (id: string) => {
    await declineInvite(id);
    await loadInvites();
  };

  const openEditModal = (company: Company) => {
    setEditModal({
      open: true,
      company,
      name: company.name,
      logo: company.logoUrl || "",
      updating: false,
    });
  };

  const closeEditModal = () => {
    setEditModal({
      open: false,
      company: null,
      name: "",
      logo: "",
      updating: false,
    });
  };

  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.company || !editModal.name.trim()) return;

    setEditModal((m) => ({ ...m, updating: true }));
    try {
      await updateCompany(editModal.company.id, {
        name: editModal.name.trim(),
        logoUrl: editModal.logo.trim() || null,
      });
      toast.success("Empresa atualizada");
      await loadCompanies(pagination.currentPage); // Mantém na página atual
      closeEditModal();
    } catch {
      toast.error("Falha ao atualizar empresa");
    } finally {
      setEditModal((m) => ({ ...m, updating: false }));
    }
  };

  const openDeleteModal = (company: Company) => {
    setDeleteModal({
      open: true,
      company,
      deleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      company: null,
      deleting: false,
    });
  };

  const handleDeleteCompany = async () => {
    if (!deleteModal.company) return;

    setDeleteModal((m) => ({ ...m, deleting: true }));
    try {
      await deleteCompany(deleteModal.company.id);
      toast.success("Empresa deletada");
      // Se após deletar não houver mais itens na página atual, volta uma página
      const newTotal = pagination.total - 1;
      const totalPages = Math.ceil(newTotal / pagination.pageSize);
      const targetPage = pagination.currentPage > totalPages ? totalPages : pagination.currentPage;
      await loadCompanies(Math.max(1, targetPage));
      closeDeleteModal();
    } catch {
      toast.error("Falha ao deletar empresa");
    } finally {
      setDeleteModal((m) => ({ ...m, deleting: false }));
    }
  };

  const handleDeleteMember = async (membershipId: string, memberRole: string) => {
    if (!modal.company) return;
    if (!confirm(`Tem certeza que deseja remover este membro (${memberRole})?`)) return;

    try {
      await deleteMember(modal.company.id, membershipId);
      toast.success("Membro removido");
      const data = await getCompanyMembers(modal.company.id);
      setModal((m) => ({ ...m, members: data.members, currentUserRole: data.currentUserRole }));
    } catch {
      toast.error("Falha ao remover membro");
    }
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
                <td className="px-4 py-2">
                  {c.logoUrl ? (
                    <div className="relative h-8 w-8">
                      <Image 
                        src={c.logoUrl} 
                        alt={`${c.name} logo`} 
                        width={32}
                        height={32}
                        className="object-contain rounded"
                        unoptimized
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) parent.textContent = 'Sem logo';
                        }}
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">Sem logo</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => void openMembers(c)}>Membros</Button>
                    {(c.userRole === "OWNER" || c.userRole === "ADMIN") && (
                      <Button size="sm" variant="outline" onClick={() => openEditModal(c)}>Editar</Button>
                    )}
                    {c.userRole === "OWNER" && (
                      <Button size="sm" variant="destructive" onClick={() => openDeleteModal(c)}>Deletar</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {companies.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={(page) => void loadCompanies(page)}
          disabled={loadingCompanies}
        />
      )}

      <MembersModal
        open={modal.open}
        company={modal.company}
        loading={modal.loading}
        members={modal.members}
        inviteEmail={modal.inviteEmail}
        inviteRole={modal.inviteRole}
        currentUserRole={modal.currentUserRole}
        onClose={closeModal}
        onChangeInviteEmail={(v) => setModal((m) => ({ ...m, inviteEmail: v }))}
        onChangeInviteRole={(v) => setModal((m) => ({ ...m, inviteRole: v }))}
        onInvite={onInvite}
        onDeleteMember={handleDeleteMember}
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

      <EditCompanyModal
        open={editModal.open}
        company={editModal.company}
        name={editModal.name}
        logo={editModal.logo}
        updating={editModal.updating}
        onClose={closeEditModal}
        onSubmit={handleEditCompany}
        onChangeName={(v) => setEditModal((m) => ({ ...m, name: v }))}
        onChangeLogo={(v) => setEditModal((m) => ({ ...m, logo: v }))}
      />

      <DeleteCompanyModal
        open={deleteModal.open}
        company={deleteModal.company}
        deleting={deleteModal.deleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCompany}
      />
    </div>
  );
};

export default Dashboard;
