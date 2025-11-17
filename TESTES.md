# Testes Unitários - Frontend

Este documento descreve a configuração e execução de testes unitários no frontend do projeto ALTAA.

## 🧪 Tecnologias de Teste

- **[Jest](https://jestjs.io/)** - Framework de testes JavaScript
- **[React Testing Library](https://testing-library.com/react)** - Biblioteca para testar componentes React
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - Matchers customizados para Jest
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro)** - Simula interações do usuário
- **[ts-node](https://typespec.io/docs/language-basics/type-relations)** - Executa TypeScript diretamente

## 📋 Estrutura de Testes

```
src/
├── lib/
│   └── __tests__/
│       ├── cookies.test.ts        # Testes de gerenciamento de cookies
│       └── api.test.ts            # Testes de funções da API
├── components/
│   ├── ui/
│   │   └── __tests__/
│       │       └── button.test.tsx  # Testes do componente Button
│   └── modals/
│       └── __tests__/
│           ├── CreateCompanyModal.test.tsx
│           └── InvitesModal.test.tsx
```

## 🚀 Executando Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

## 📝 Cobertura de Testes

### Funções Utilitárias (`src/lib/cookies.ts`)
- ✅ `setCookie()` - Define cookie com nome, valor e expiração
- ✅ `getCookie()` - Lê valor do cookie
- ✅ `deleteCookie()` - Remove cookie

**Testes**: 7 testes | Status: ✅ Todos passando

### API Client (`src/lib/api.ts`)
- ✅ `getAuthToken()` - Recupera token de autenticação
- ✅ `signin()` - Login de usuário
- ✅ `signup()` - Cadastro de usuário
- ✅ `signout()` - Logout do sistema

**Testes**: 7 testes | Status: ✅ Todos passando

### Componente Button (`src/components/ui/button.tsx`)
- ✅ Renderização com texto
- ✅ Variantes: default, destructive, outline, ghost
- ✅ Tamanhos: sm, lg
- ✅ Estado disabled
- ✅ Suporte a asChild (Slot component)

**Testes**: 9 testes | Status: ✅ Todos passando

### CreateCompanyModal (`src/components/modals/CreateCompanyModal.tsx`)
- ✅ Renderização condicional (open/closed)
- ✅ Exibição de valores nos inputs
- ✅ Callbacks de mudança (onChangeName, onChangeLogo)
- ✅ Submit do formulário
- ✅ Estado de loading (creating)
- ✅ Botão de fechar

**Testes**: 8 testes | Status: ✅ Todos passando

### InvitesModal (`src/components/modals/InvitesModal.tsx`)
- ✅ Renderização condicional
- ✅ Mensagem quando sem convites
- ✅ Lista de convites
- ✅ Botões aceitar/recusar
- ✅ Callback onClose

**Testes**: 7 testes | Status: ✅ Todos passando

## 📊 Resumo Geral

- **Total de Suites**: 5
- **Total de Testes**: 38
- **Status**: ✅ **100% Passando**
- **Tempo de Execução**: ~3.8s

## 🔧 Configuração

### `jest.config.ts`
Configuração principal do Jest com suporte a Next.js:

```typescript
import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
```

### `jest.setup.ts`
Setup global para testes:

```typescript
import '@testing-library/jest-dom';
```

## 🎯 Boas Práticas Implementadas

### 1. **Testes Isolados**
Cada teste é independente e limpa os mocks antes de executar:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 2. **Testes Descritivos**
Nomes de testes em português descrevendo o comportamento esperado:

```typescript
it('deve renderizar quando open é true', () => {
  // ...
});
```

### 3. **Mock de Dependências**
Mocks adequados para isolar componentes:

```typescript
jest.mock('../cookies');
global.fetch = jest.fn();
```

### 4. **Queries Semânticas**
Uso de queries que simulam como usuários interagem:

```typescript
screen.getByText('Criar');
screen.getByPlaceholderText('Minha Empresa');
screen.getByRole('button');
```

### 5. **Testing Library Best Practices**
- Evita testes de implementação
- Foca no comportamento do usuário
- Usa matchers do @testing-library/jest-dom

## 📖 Exemplo de Teste

### Teste de Componente
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('deve renderizar com texto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Teste de Função
```typescript
import { setCookie, getCookie } from '../cookies';

describe('Cookies', () => {
  it('deve definir e ler um cookie', () => {
    setCookie('test', 'value', 1);
    expect(getCookie('test')).toBe('value');
  });
});
```

## 🐛 Depuração de Testes

### Ver HTML renderizado
```typescript
import { screen } from '@testing-library/react';

screen.debug(); // Imprime todo o DOM
screen.debug(screen.getByText('Texto')); // Imprime elemento específico
```

### Executar teste específico
```bash
npm test -- cookies.test.ts
npm test -- -t "deve renderizar"
```

## 📦 Dependências Instaladas

```json
{
  "devDependencies": {
    "jest": "^29.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "jest-environment-jsdom": "^29.x",
    "@types/jest": "^29.x",
    "ts-node": "^10.x"
  }
}
```

## 🔮 Próximos Passos (Opcional)

### Cobertura Adicional
- [ ] Testes para MembersModal
- [ ] Testes para páginas (Dashboard, Login)
- [ ] Testes de integração com API

### Melhorias
- [ ] Configurar threshold de cobertura mínima (80%)
- [ ] Testes end-to-end com Playwright/Cypress
- [ ] CI/CD para executar testes automaticamente

## 📄 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Gera relatório de cobertura |

## ✅ Status Final

**Todos os 38 testes estão passando com sucesso!** 🎉

O projeto tem uma base sólida de testes unitários cobrindo:
- ✅ Funções utilitárias
- ✅ Integração com API
- ✅ Componentes de UI
- ✅ Modais de funcionalidades

Pronto para desenvolvimento contínuo com confiança! 🚀
