import { render, screen, fireEvent } from '@testing-library/react';
import { InvitesModal } from '../InvitesModal';
import type { PendingInvite } from '@/services/invites.service';

const mockInvites: PendingInvite[] = [
  {
    id: '1',
    companyId: 'comp1',
    companyName: 'Company One',
    email: 'user@example.com',
    role: 'MEMBER',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    companyId: 'comp2',
    companyName: 'Company Two',
    email: 'user@example.com',
    role: 'ADMIN',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

describe('InvitesModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAccept = jest.fn();
  const mockOnDecline = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não deve renderizar quando open é false', () => {
    const { container } = render(
      <InvitesModal
        open={false}
        invites={[]}
        onClose={mockOnClose}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar quando open é true', () => {
    render(
      <InvitesModal
        open={true}
        invites={[]}
        onClose={mockOnClose}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );
    expect(screen.getByText('Convites pendentes')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não há convites', () => {
    render(
      <InvitesModal
        open={true}
        invites={[]}
        onClose={mockOnClose}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );
    expect(screen.getByText('Nenhum convite.')).toBeInTheDocument();
  });

  it('deve exibir lista de convites', () => {
    render(
      <InvitesModal
        open={true}
        invites={mockInvites}
        onClose={mockOnClose}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );
    expect(screen.getByText('Company One')).toBeInTheDocument();
    expect(screen.getByText('Company Two')).toBeInTheDocument();
    expect(screen.getByText(/MEMBER/)).toBeInTheDocument();
    expect(screen.getByText(/ADMIN/)).toBeInTheDocument();
  });

  it('deve chamar onAccept quando o botão Aceitar for clicado', () => {
    render(
      <InvitesModal
        open={true}
        invites={mockInvites}
        onClose={mockOnClose}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );
    const acceptButtons = screen.getAllByText('Aceitar');
    fireEvent.click(acceptButtons[0]);
    expect(mockOnAccept).toHaveBeenCalledWith('1');
  });

  it('deve chamar onDecline quando o botão Recusar for clicado', () => {
    render(
      <InvitesModal
        open={true}
        invites={mockInvites}
        onClose={mockOnClose}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );
    const declineButtons = screen.getAllByText('Recusar');
    fireEvent.click(declineButtons[0]);
    expect(mockOnDecline).toHaveBeenCalledWith('1');
  });

  it('deve chamar onClose quando o botão Fechar for clicado', () => {
    render(
      <InvitesModal
        open={true}
        invites={mockInvites}
        onClose={mockOnClose}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );
    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
