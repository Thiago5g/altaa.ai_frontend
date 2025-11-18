"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PendingInvite } from "@/services/invites.service";
import { toast } from "sonner";

export interface InvitesModalProps {
  open: boolean;
  invites: PendingInvite[];
  onClose: () => void;
  onAccept: (inviteId: string) => Promise<void>;
  onDecline: (inviteId: string) => Promise<void>;
}

export const InvitesModal = ({ open, invites, onClose, onAccept, onDecline }: InvitesModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6">
      <Card className="w-full max-w-lg relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <CardTitle>Convites pendentes</CardTitle>
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {invites.length === 0 && <p className="text-sm text-muted-foreground">Nenhum convite.</p>}
          {invites.map((i) => (
            <div key={i.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">{i.companyName}</div>
                <div className="text-xs text-muted-foreground">{new Date(i.createdAt).toLocaleString()} • {i.role}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={async () => { try { await onAccept(i.id); toast.success("Convite aceito"); } catch { toast.error("Falha ao aceitar"); } }}>Aceitar</Button>
                <Button size="sm" variant="destructive" onClick={async () => { try { await onDecline(i.id); toast.success("Convite recusado"); } catch { toast.error("Falha ao recusar"); } }}>Recusar</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
