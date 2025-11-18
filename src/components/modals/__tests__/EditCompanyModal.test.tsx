import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditCompanyModal } from '../EditCompanyModal';

describe('EditCompanyModal', () => {
  const mockCompany = {
    id: '1',
    name: 'Test Company',
    logoUrl: 'https://example.com/logo.png',
  };

  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnChangeName = jest.fn();
  const mockOnChangeLogo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não deve renderizar quando open é false', () => {
    const { container } = render(
      <EditCompanyModal
        open={false}
        company={null}
        name=""
        logo=""
        updating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('não deve renderizar quando company é null', () => {
    const { container } = render(
      <EditCompanyModal
        open={true}
        company={null}
        name=""
        logo=""
        updating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar quando open é true e company existe', () => {
    render(
      <EditCompanyModal
        open={true}
        company={mockCompany}
        name="Test Company"
        logo="https://example.com/logo.png"
        updating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    expect(screen.getByText('Editar Empresa')).toBeInTheDocument();
  });

  it('deve exibir os valores de name e logo', () => {
    render(
      <EditCompanyModal
        open={true}
        company={mockCompany}
        name="Test Company"
        logo="https://example.com/logo.png"
        updating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    expect(screen.getByPlaceholderText('Nome')).toHaveValue('Test Company');
    expect(screen.getByPlaceholderText('https://...')).toHaveValue('https://example.com/logo.png');
  });

  it('deve chamar onChangeName quando o input de nome for alterado', () => {
    render(
      <EditCompanyModal
        open={true}
        company={mockCompany}
        name="Test Company"
        logo=""
        updating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const input = screen.getByPlaceholderText('Nome');
    fireEvent.change(input, { target: { value: 'Updated Company' } });
    expect(mockOnChangeName).toHaveBeenCalledWith('Updated Company');
  });

  it('deve chamar onChangeLogo quando o input de logo for alterado', () => {
    render(
      <EditCompanyModal
        open={true}
        company={mockCompany}
        name=""
        logo=""
        updating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const input = screen.getByPlaceholderText('https://...');
    fireEvent.change(input, { target: { value: 'https://new-logo.png' } });
    expect(mockOnChangeLogo).toHaveBeenCalledWith('https://new-logo.png');
  });

  it('deve chamar onSubmit quando o formulário for enviado', async () => {
    mockOnSubmit.mockImplementation((e) => e.preventDefault());
    render(
      <EditCompanyModal
        open={true}
        company={mockCompany}
        name="Test Company"
        logo=""
        updating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const button = screen.getByText('Salvar');
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('deve desabilitar o botão quando updating é true', () => {
    render(
      <EditCompanyModal
        open={true}
        company={mockCompany}
        name="Company"
        logo=""
        updating={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const button = screen.getByText('Salvando...');
    expect(button).toBeDisabled();
  });

  it('deve chamar onClose quando o botão Cancelar for clicado', () => {
    render(
      <EditCompanyModal
        open={true}
        company={mockCompany}
        name=""
        logo=""
        updating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const button = screen.getByText('Cancelar');
    fireEvent.click(button);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
