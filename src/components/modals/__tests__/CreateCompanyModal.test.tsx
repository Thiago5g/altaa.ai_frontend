import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateCompanyModal } from '../CreateCompanyModal';

describe('CreateCompanyModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnChangeName = jest.fn();
  const mockOnChangeLogo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não deve renderizar quando open é false', () => {
    const { container } = render(
      <CreateCompanyModal
        open={false}
        name=""
        logo=""
        creating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar quando open é true', () => {
    render(
      <CreateCompanyModal
        open={true}
        name=""
        logo=""
        creating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    expect(screen.getByText('Nova empresa')).toBeInTheDocument();
  });

  it('deve exibir os valores de name e logo', () => {
    render(
      <CreateCompanyModal
        open={true}
        name="Test Company"
        logo="https://example.com/logo.png"
        creating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    expect(screen.getByPlaceholderText('Minha Empresa')).toHaveValue('Test Company');
    expect(screen.getByPlaceholderText('https://...')).toHaveValue('https://example.com/logo.png');
  });

  it('deve chamar onChangeName quando o input de nome for alterado', () => {
    render(
      <CreateCompanyModal
        open={true}
        name=""
        logo=""
        creating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const input = screen.getByPlaceholderText('Minha Empresa');
    fireEvent.change(input, { target: { value: 'New Company' } });
    expect(mockOnChangeName).toHaveBeenCalledWith('New Company');
  });

  it('deve chamar onChangeLogo quando o input de logo for alterado', () => {
    render(
      <CreateCompanyModal
        open={true}
        name=""
        logo=""
        creating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const input = screen.getByPlaceholderText('https://...');
    fireEvent.change(input, { target: { value: 'https://logo.png' } });
    expect(mockOnChangeLogo).toHaveBeenCalledWith('https://logo.png');
  });

  it('deve chamar onSubmit quando o formulário for enviado', async () => {
    mockOnSubmit.mockImplementation((e) => e.preventDefault());
    render(
      <CreateCompanyModal
        open={true}
        name="Company"
        logo=""
        creating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const button = screen.getByText('Criar');
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('deve desabilitar o botão quando creating é true', () => {
    render(
      <CreateCompanyModal
        open={true}
        name="Company"
        logo=""
        creating={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const button = screen.getByText('Criando...');
    expect(button).toBeDisabled();
  });

  it('deve chamar onClose quando o botão Fechar for clicado', () => {
    render(
      <CreateCompanyModal
        open={true}
        name=""
        logo=""
        creating={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChangeName={mockOnChangeName}
        onChangeLogo={mockOnChangeLogo}
      />
    );
    const button = screen.getByText('Fechar');
    fireEvent.click(button);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
