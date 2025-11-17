"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface CreateCompanyModalProps {
  open: boolean;
  name: string;
  logo: string;
  creating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChangeName: (v: string) => void;
  onChangeLogo: (v: string) => void;
}

export const CreateCompanyModal = (props: CreateCompanyModalProps) => {
  const { open, name, logo, creating, onClose, onSubmit, onChangeName, onChangeLogo } = props;
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6">
      <Card className="w-full max-w-lg relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <CardTitle>Nova empresa</CardTitle>
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm">Nome</label>
              <Input placeholder="Minha Empresa" value={name} onChange={(e)=> onChangeName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm">Logo URL (opcional)</label>
              <Input placeholder="https://..." value={logo} onChange={(e)=> onChangeLogo(e.target.value)} />
            </div>
            <div className="pt-2">
              <Button disabled={creating} type="submit">{creating ? "Criando..." : "Criar"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
