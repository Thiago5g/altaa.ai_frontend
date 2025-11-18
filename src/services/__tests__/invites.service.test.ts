import { getPendingInvites, acceptInvite, declineInvite } from '../invites.service';
import * as authService from '../auth.service';

jest.mock('../auth.service');

const mockAuthHeaders = authService.authHeaders as jest.MockedFunction<typeof authService.authHeaders>;

global.fetch = jest.fn();

describe('Invites Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    mockAuthHeaders.mockReturnValue({
      'Authorization': 'Bearer test-token',
      'Content-Type': 'application/json',
    });
  });

  describe('getPendingInvites', () => {
    it('deve buscar convites pendentes com sucesso', async () => {
      const mockInvites = [
        {
          id: '1',
          companyId: 'c1',
          companyName: 'Company 1',
          email: 'user@test.com',
          role: 'MEMBER',
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          companyId: 'c2',
          companyName: 'Company 2',
          email: 'user@test.com',
          role: 'ADMIN',
          createdAt: '2024-01-02',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockInvites,
      });

      const result = await getPendingInvites();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/invites/pending'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
      expect(result).toEqual(mockInvites);
    });

    it('deve retornar array vazio se não houver convites', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      const result = await getPendingInvites();

      expect(result).toEqual([]);
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(getPendingInvites()).rejects.toThrow('Falha ao buscar convites');
    });

    it('deve lançar erro se a resposta for inválida', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      });

      await expect(getPendingInvites()).rejects.toThrow('Formato inválido de convites');
    });
  });

  describe('acceptInvite', () => {
    it('deve aceitar convite com sucesso', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await acceptInvite('invite-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/invites/invite-1/accept'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(acceptInvite('invite-1')).rejects.toThrow('Falha ao aceitar convite');
    });
  });

  describe('declineInvite', () => {
    it('deve recusar convite com sucesso', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await declineInvite('invite-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/invites/invite-1/decline'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('deve lançar erro se falhar', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(declineInvite('invite-1')).rejects.toThrow('Falha ao recusar convite');
    });
  });
});
