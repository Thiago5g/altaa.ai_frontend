import { 
  getCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany,
  getCompanyMembers,
  inviteToCompany,
  deleteMember,
  selectActiveCompany
} from '../companies.service';
import * as authService from '../auth.service';

jest.mock('../auth.service');

const mockAuthHeaders = authService.authHeaders as jest.MockedFunction<typeof authService.authHeaders>;

global.fetch = jest.fn();

describe('Companies Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    mockAuthHeaders.mockReturnValue({
      'Authorization': 'Bearer test-token',
      'Content-Type': 'application/json',
    });
  });

  describe('getCompanies', () => {
    it('deve buscar lista de empresas com sucesso', async () => {
      const mockResponse = {
        data: [
          { id: '1', name: 'Company 1', logoUrl: null, userRole: 'OWNER' },
          { id: '2', name: 'Company 2', logoUrl: 'https://logo.url', userRole: 'ADMIN' },
        ],
        page: 1,
        pageSize: 10,
        total: 2,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await getCompanies();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/companies?page=1&pageSize=10'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('deve aceitar parâmetros de paginação customizados', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Company 1', logoUrl: null, userRole: 'OWNER' }],
        page: 2,
        pageSize: 20,
        total: 100,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCompanies(2, 20);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/companies?page=2&pageSize=20'),
        expect.anything()
      );
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(20);
      expect(result.total).toBe(100);
    });

    it('deve lançar erro se não autorizado', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(getCompanies()).rejects.toThrow('Não autorizado');
    });

    it('deve lançar erro se a resposta for inválida', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      });

      await expect(getCompanies()).rejects.toThrow('Formato inválido de empresas');
    });
  });

  describe('createCompany', () => {
    it('deve criar empresa com sucesso', async () => {
      const mockCompany = { id: '1', name: 'New Company', logoUrl: null };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockCompany,
      });

      const result = await createCompany({ name: 'New Company' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/company'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
          body: JSON.stringify({ name: 'New Company' }),
        })
      );
      expect(result).toEqual(mockCompany);
    });

    it('deve criar empresa com logo', async () => {
      const mockCompany = { id: '1', name: 'New Company', logoUrl: 'https://logo.url' };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockCompany,
      });

      await createCompany({ name: 'New Company', logoUrl: 'https://logo.url' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({ name: 'New Company', logoUrl: 'https://logo.url' }),
        })
      );
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(createCompany({ name: 'New Company' })).rejects.toThrow('Falha ao criar empresa');
    });
  });

  describe('updateCompany', () => {
    it('deve atualizar empresa com sucesso', async () => {
      const mockCompany = { id: '1', name: 'Updated Company', logoUrl: null };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockCompany,
      });

      const result = await updateCompany('1', { name: 'Updated Company' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/company/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ name: 'Updated Company' }),
        })
      );
      expect(result).toEqual(mockCompany);
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(updateCompany('1', { name: 'Updated' })).rejects.toThrow('Falha ao atualizar empresa');
    });
  });

  describe('deleteCompany', () => {
    it('deve deletar empresa com sucesso', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await deleteCompany('1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/company/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(deleteCompany('1')).rejects.toThrow('Falha ao deletar empresa');
    });
  });

  describe('getCompanyMembers', () => {
    it('deve buscar membros com sucesso', async () => {
      const mockResponse = {
        data: [
          { membershipId: '1', userId: 'u1', name: 'User 1', email: 'user1@test.com', role: 'OWNER', createdAt: '2024-01-01' },
          { membershipId: '2', userId: 'u2', name: 'User 2', email: 'user2@test.com', role: 'MEMBER', createdAt: '2024-01-02' },
        ],
        companyId: 'c1',
        total: 2,
        currentUserRole: 'OWNER',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCompanyMembers('c1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/company/c1/members'),
        expect.anything()
      );
      expect(result.members).toEqual(mockResponse.data);
      expect(result.currentUserRole).toBe('OWNER');
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(getCompanyMembers('c1')).rejects.toThrow('Falha ao buscar membros');
    });
  });

  describe('inviteToCompany', () => {
    it('deve enviar convite com sucesso', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await inviteToCompany('c1', 'user@test.com', 'MEMBER');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/company/c1/invite'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'user@test.com', role: 'MEMBER' }),
        })
      );
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(inviteToCompany('c1', 'user@test.com', 'MEMBER')).rejects.toThrow('Falha ao convidar usuário');
    });
  });

  describe('deleteMember', () => {
    it('deve remover membro com sucesso', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await deleteMember('c1', 'm1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/company/c1/member/m1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(deleteMember('c1', 'm1')).rejects.toThrow('Falha ao remover membro');
    });
  });

  describe('selectActiveCompany', () => {
    it('deve selecionar empresa ativa com sucesso', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await selectActiveCompany('c1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/company/c1/select'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(selectActiveCompany('c1')).rejects.toThrow('Falha ao selecionar empresa ativa');
    });
  });
});
