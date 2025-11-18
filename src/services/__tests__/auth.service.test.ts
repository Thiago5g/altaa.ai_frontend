import { getAuthToken, authHeaders, signin, signup, signout } from '../auth.service';
import { getCookie, setCookie, deleteCookie } from '@/lib/cookies';

jest.mock('@/lib/cookies');

const mockGetCookie = getCookie as jest.MockedFunction<typeof getCookie>;
const mockSetCookie = setCookie as jest.MockedFunction<typeof setCookie>;
const mockDeleteCookie = deleteCookie as jest.MockedFunction<typeof deleteCookie>;

global.fetch = jest.fn();

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getAuthToken', () => {
    it('deve retornar o token dos cookies', () => {
      mockGetCookie.mockReturnValue('test-token');
      const token = getAuthToken();
      expect(token).toBe('test-token');
      expect(mockGetCookie).toHaveBeenCalledWith('token');
    });

    it('deve retornar null se não houver token', () => {
      mockGetCookie.mockReturnValue(null);
      const token = getAuthToken();
      expect(token).toBeNull();
    });

    it('deve retornar null no server-side', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Simulando server-side
      delete global.window;

      const token = getAuthToken();
      expect(token).toBeNull();

      global.window = originalWindow;
    });
  });

  describe('authHeaders', () => {
    it('deve retornar headers com authorization quando houver token', () => {
      mockGetCookie.mockReturnValue('test-token');
      const headers = authHeaders();
      expect(headers).toEqual({
        Authorization: 'Bearer test-token',
      });
    });

    it('deve retornar headers vazios quando não houver token', () => {
      mockGetCookie.mockReturnValue(null);
      const headers = authHeaders();
      expect(headers).toEqual({});
    });
  });

  describe('signin', () => {
    it('deve fazer login com sucesso', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ access_token: 'test-token' }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await signin('test@example.com', 'password');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signin'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
        })
      );
      expect(mockSetCookie).toHaveBeenCalledWith('token', 'test-token', 7);
    });

    it('deve lançar erro se o login falhar', async () => {
      const mockResponse = {
        ok: false,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(signin('test@example.com', 'wrong')).rejects.toThrow('Falha no login');
      expect(mockSetCookie).not.toHaveBeenCalled();
    });

    it('deve lançar erro se a resposta for inválida', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ invalid: 'data' }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(signin('test@example.com', 'password')).rejects.toThrow('Resposta inválida do servidor');
      expect(mockSetCookie).not.toHaveBeenCalled();
    });

    it('deve lançar erro se não receber access_token', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({}),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(signin('test@example.com', 'password')).rejects.toThrow('Resposta inválida do servidor');
    });
  });

  describe('signup', () => {
    it('deve criar conta com sucesso', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ access_token: 'new-token' }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await signup('Test User', 'test@example.com', 'password');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signup'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password' }),
        })
      );
      expect(mockSetCookie).toHaveBeenCalledWith('token', 'new-token', 7);
    });

    it('deve lançar erro se o cadastro falhar', async () => {
      const mockResponse = {
        ok: false,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(signup('Test', 'test@example.com', 'password')).rejects.toThrow('Falha ao criar usuário');
      expect(mockSetCookie).not.toHaveBeenCalled();
    });

    it('deve lançar erro se a resposta for inválida', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ no_token: 'here' }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(signup('Test', 'test@example.com', 'password')).rejects.toThrow('Resposta inválida do servidor');
    });
  });

  describe('signout', () => {
    it('deve deletar o cookie de autenticação', () => {
      signout();
      expect(mockDeleteCookie).toHaveBeenCalledWith('token');
    });
  });
});
