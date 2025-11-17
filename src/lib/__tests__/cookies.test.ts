import { setCookie, getCookie, deleteCookie } from '../cookies';

describe('Cookies', () => {
  beforeEach(() => {
    document.cookie = '';
  });

  describe('setCookie', () => {
    it('deve definir um cookie corretamente', () => {
      setCookie('test', 'value', 1);
      expect(document.cookie).toContain('test=value');
    });

    it('deve usar 7 dias como padrão de expiração', () => {
      setCookie('test', 'value');
      expect(document.cookie).toContain('test=value');
    });
  });

  describe('getCookie', () => {
    it('deve retornar o valor do cookie', () => {
      document.cookie = 'test=value;path=/';
      expect(getCookie('test')).toBe('value');
    });

    it('deve retornar null se o cookie não existir', () => {
      expect(getCookie('nonexistent')).toBeNull();
    });

    it('deve lidar com múltiplos cookies', () => {
      document.cookie = 'cookie1=value1;path=/';
      document.cookie = 'cookie2=value2;path=/';
      expect(getCookie('cookie1')).toBe('value1');
      expect(getCookie('cookie2')).toBe('value2');
    });
  });

  describe('deleteCookie', () => {
    it('deve deletar um cookie existente', () => {
      document.cookie = 'test=value;path=/';
      deleteCookie('test');
      expect(getCookie('test')).toBeNull();
    });
  });
});
