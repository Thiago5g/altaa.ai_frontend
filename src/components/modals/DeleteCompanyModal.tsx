"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Company } from "@/services/companies.service";

export interface DeleteCompanyModalProps {
  open: boolean;
  company: Company | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteCompanyModal = (props: DeleteCompanyModalProps) => {
  const { open, company, deleting, onClose, onConfirm } = props;
  if (!open || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6">
      <Card className="w-full max-w-md relative mt-20">
        <CardHeader className="border-b">
          <CardTitle className="text-destructive">Deletar Empresa</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-sm">
              Tem certeza que deseja deletar a empresa <strong>&quot;{company.name}&quot;</strong>?
            </p>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. Todos os dados relacionados a esta empresa serão permanentemente removidos.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={deleting}>
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={onConfirm} disabled={deleting}>
                {deleting ? "Deletando..." : "Deletar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
