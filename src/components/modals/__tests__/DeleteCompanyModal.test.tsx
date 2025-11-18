import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteCompanyModal } from '../DeleteCompanyModal';

describe('DeleteCompanyModal', () => {
  const mockCompany = {
    id: '1',
    name: 'Test Company',
    logoUrl: null,
  };

  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não deve renderizar quando open é false', () => {
    const { container } = render(
      <DeleteCompanyModal
        open={false}
        company={null}
        deleting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('não deve renderizar quando company é null', () => {
    const { container } = render(
      <DeleteCompanyModal
        open={true}
        company={null}
        deleting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar quando open é true e company existe', () => {
    render(
      <DeleteCompanyModal
        open={true}
        company={mockCompany}
        deleting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.getByText('Deletar Empresa')).toBeInTheDocument();
  });

  it('deve exibir mensagem de confirmação com nome da empresa', () => {
    render(
      <DeleteCompanyModal
        open={true}
        company={mockCompany}
        deleting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.getByText(/Test Company/)).toBeInTheDocument();
    expect(screen.getByText(/Esta ação não pode ser desfeita/)).toBeInTheDocument();
  });

  it('deve chamar onConfirm quando o botão Deletar for clicado', async () => {
    render(
      <DeleteCompanyModal
        open={true}
        company={mockCompany}
        deleting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    const button = screen.getByRole('button', { name: 'Deletar' });
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled();
    });
  });

  it('deve desabilitar o botão quando deleting é true', () => {
    render(
      <DeleteCompanyModal
        open={true}
        company={mockCompany}
        deleting={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    const button = screen.getByText('Deletando...');
    expect(button).toBeDisabled();
  });

  it('deve chamar onClose quando o botão Cancelar for clicado', () => {
    render(
      <DeleteCompanyModal
        open={true}
        company={mockCompany}
        deleting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    const button = screen.getByText('Cancelar');
    fireEvent.click(button);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('não deve chamar onConfirm quando deleting é true', () => {
    render(
      <DeleteCompanyModal
        open={true}
        company={mockCompany}
        deleting={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    const button = screen.getByText('Deletando...');
    fireEvent.click(button);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
});
