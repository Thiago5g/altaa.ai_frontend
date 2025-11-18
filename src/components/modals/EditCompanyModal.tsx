"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Company } from "@/services/companies.service";

export interface EditCompanyModalProps {
  open: boolean;
  company: Company | null;
  name: string;
  logo: string;
  updating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChangeName: (v: string) => void;
  onChangeLogo: (v: string) => void;
}

export const EditCompanyModal = (props: EditCompanyModalProps) => {
  const { open, company, name, logo, updating, onClose, onSubmit, onChangeName, onChangeLogo } = props;
  if (!open || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6">
      <Card className="w-full max-w-md relative mt-20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <CardTitle>Editar Empresa</CardTitle>
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nome da Empresa</label>
              <Input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Logo URL (opcional)</label>
              <Input
                type="text"
                placeholder="https://..."
                value={logo}
                onChange={(e) => onChangeLogo(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={updating}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
