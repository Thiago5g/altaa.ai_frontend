import { getAuthToken, signin, signup, signout } from '../api';
import { getCookie, setCookie, deleteCookie } from '../cookies';

jest.mock('../cookies');

const mockGetCookie = getCookie as jest.MockedFunction<typeof getCookie>;
const mockSetCookie = setCookie as jest.MockedFunction<typeof setCookie>;
const mockDeleteCookie = deleteCookie as jest.MockedFunction<typeof deleteCookie>;

global.fetch = jest.fn();

describe('API Functions', () => {
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
    });

    it('deve lançar erro se a resposta for inválida', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ invalid: 'data' }),
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
    });
  });

  describe('signout', () => {
    it('deve deletar o cookie de autenticação', () => {
      signout();
      expect(mockDeleteCookie).toHaveBeenCalledWith('token');
    });
  });
});
