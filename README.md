# ALTAA Frontend

Interface web para gerenciamento de empresas, membros e convites, construída com Next.js 16, React 19 e Tailwind CSS.

## 🚀 Tecnologias

- **[Next.js 16](https://nextjs.org/)** - Framework React com Turbopack
- **[React 19](https://react.dev/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes React reutilizáveis
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e sem estilo
- **[Lucide Icons](https://lucide.dev/)** - Biblioteca de ícones moderna
- **[Sonner](https://sonner.emilkowal.ski/)** - Sistema de notificações toast

## 📋 Features

### Autenticação
- ✅ Página de login com validação
- ✅ Cadastro de novos usuários
- ✅ Armazenamento seguro de token JWT em cookies
- ✅ Redirecionamento automático pós-login
- ✅ Logout com limpeza de sessão
- ✅ **Proteção de rotas via middleware SSR**
- ✅ **Redirecionamento automático para login em rotas protegidas**

### Dashboard
- ✅ Visualização de empresas do usuário
- ✅ Badge de notificação para convites pendentes
- ✅ Seleção de empresa ativa
- ✅ Interface responsiva e moderna

### Gerenciamento de Empresas
- ✅ Listagem de empresas com dados de criação
- ✅ Criação de novas empresas via modal
- ✅ Visualização de membros da empresa
- ✅ Envio de convites para novos membros
- ✅ Indicador visual de empresa ativa

### Sistema de Convites
- ✅ Modal de convites pendentes
- ✅ Aceitar convites com um clique
- ✅ Recusar convites
- ✅ Atualização automática da lista
- ✅ Notificações toast para ações

### Componentes Modulares
- ✅ MembersModal - Modal de membros e envio de convites
- ✅ CreateCompanyModal - Modal de criação de empresa
- ✅ InvitesModal - Modal de gerenciamento de convites
- ✅ Componentes shadcn/ui (Button, Card, Input, etc.)

## 🎨 Design System

### Componentes shadcn/ui
- `Button` - Botões com variantes (default, destructive, ghost, etc.)
- `Card` - Cards com header, conteúdo e footer
- `Input` - Campos de texto estilizados
- `Toaster` - Sistema de notificações

### Padrões de Código
- ✅ Arrow functions em todos os componentes
- ✅ TypeScript strict mode
- ✅ Props interfaces tipadas
- ✅ Componentes funcionais

## 🔧 Configuração

### 1. Pré-requisitos

- Node.js 20+
- npm, yarn, pnpm ou bun
- Backend rodando em `http://localhost:3001`

### 2. Instalação

```bash
# Instalar dependências
npm install
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Como Rodar

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento com Turbopack
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

### Produção

```bash
# Build otimizado para produção
npm run build

# Iniciar servidor de produção
npm run start
```

### Outros Comandos

```bash
# Linter
npm run lint

# Testes unitários
npm test

# Testes em modo watch
npm run test:watch

# Relatório de cobertura
npm run test:coverage
```

## 🧪 Testes Unitários

O projeto possui **38 testes unitários** cobrindo:

- ✅ **Funções utilitárias** (cookies, API client)
- ✅ **Componentes de UI** (Button, Input, Card)
- ✅ **Modais** (CreateCompanyModal, InvitesModal)
- ✅ **Autenticação** (signin, signup, signout)

### Executar Testes

```bash
# Executar todos os testes
npm test

# Modo watch (re-executa ao salvar)
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### Tecnologias de Teste

- **Jest** - Framework de testes
- **React Testing Library** - Testes de componentes React
- **@testing-library/jest-dom** - Matchers customizados

📖 **Documentação completa**: Veja [TESTES.md](./TESTES.md)

## 📱 Páginas e Rotas

### `/` (Root)
- Redirecionamento automático para `/dashboard`

### `/login` (Rota Pública)
- Formulário de login
- Link para cadastro
- Redirecionamento para `/dashboard` após autenticação
- **Bloqueia acesso se já autenticado**

### `/signup` (Rota Pública)
- Formulário de cadastro
- Validação de campos
- Redirecionamento automático após criação
- **Bloqueia acesso se já autenticado**

### `/dashboard` (Rota Protegida ✅)
- Página principal do aplicativo
- Tabela de empresas
- Badge de convites pendentes
- Modais de gerenciamento
- **Requer autenticação - redireciona para /login se não autenticado**

## 🔐 Proteção de Rotas (Middleware SSR)

O projeto implementa proteção de rotas usando **Next.js Middleware** que roda no servidor.

### Como funciona:
1. **Middleware** (`src/middleware.ts`) intercepta todas as requisições
2. Verifica se o token JWT existe nos **cookies**
3. Rotas protegidas sem token → redireciona para `/login`
4. Rotas de autenticação com token → redireciona para `/dashboard`

### Exemplo de fluxo:
```
Usuário não autenticado tenta acessar /dashboard
    ↓
Middleware verifica cookie "token"
    ↓
Token não existe
    ↓
Redireciona automaticamente para /login
```

### Gerenciamento de Token:
- ✅ Token armazenado em **cookies** (não localStorage)
- ✅ Cookies acessíveis no servidor (SSR)
- ✅ Expiração de 7 dias
- ✅ SameSite=Strict para segurança

📖 **Documentação completa**: Veja [ROTAS_PROTEGIDAS.md](./ROTAS_PROTEGIDAS.md)

## 🏗️ Estrutura do Projeto

```
src/
├── middleware.ts            # 🔒 Proteção SSR de rotas
├── app/
│   ├── page.tsx              # Redirect para /dashboard
│   ├── login/
│   │   └── page.tsx         # Página de login
│   ├── signup/
│   │   └── page.tsx         # Página de cadastro
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard principal
│   ├── layout.tsx           # Layout raiz
│   └── globals.css          # Estilos globais
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── sonner.tsx
│   └── modals/              # Componentes de modal
│       ├── MembersModal.tsx
│       ├── CreateCompanyModal.tsx
│       └── InvitesModal.tsx
└── lib/
    ├── api.ts               # Cliente HTTP e helpers
    ├── cookies.ts           # 🍪 Gerenciamento de cookies
    └── utils.ts             # Utilitários (cn, etc.)
```

## 🔌 Integração com API

### Cliente HTTP (`lib/api.ts`)

```typescript
// Autenticação
await signup(email, password, name)
await signin(email, password)

// Empresas
await getCompanies()
await createCompany(name)
await selectCompany(companyId)
await getMembers(companyId)
await inviteToCompany(companyId, email, role)

// Convites
await getPendingInvites()
await acceptInvite(inviteId)
await declineInvite(inviteId)
```

### Gerenciamento de Token

O token JWT é armazenado no `localStorage`:

```typescript
localStorage.setItem('token', token)
localStorage.getItem('token')
localStorage.removeItem('token')
```

## 🎯 Fluxo de Usuário

1. **Login/Cadastro** → Usuário autentica e recebe token JWT
2. **Dashboard** → Visualiza empresas e convites pendentes
3. **Criar Empresa** → Modal para criar nova empresa
4. **Gerenciar Membros** → Visualizar membros e enviar convites
5. **Convites** → Aceitar/recusar convites de outras empresas

## 🎨 Customização de Tema

### Tailwind Config

O projeto usa Tailwind CSS 4 com variáveis CSS para temas:

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## 🛠️ CI/CD

O projeto inclui GitHub Actions para:
- ✅ Build automático em push/PR
- ✅ Validação do código TypeScript
- ✅ Execução em Node.js 20
- ✅ Build otimizado do Next.js

## 📦 Componentes Principais

### MembersModal
Modal para visualizar membros e enviar convites para uma empresa.

```typescript
<MembersModal
  open={modalOpen}
  companyId={selectedCompanyId}
  companyName={companyName}
  onClose={() => setModalOpen(false)}
/>
```

### CreateCompanyModal
Modal para criação de novas empresas.

```typescript
<CreateCompanyModal
  open={createModalOpen}
  onClose={() => setCreateModalOpen(false)}
  onSuccess={() => loadCompanies()}
/>
```

### InvitesModal
Modal para gerenciar convites pendentes.

```typescript
<InvitesModal
  open={invitesModalOpen}
  invites={pendingInvites}
  onClose={() => setInvitesModalOpen(false)}
  onAccept={handleAcceptInvite}
  onDecline={handleDeclineInvite}
/>
```

## 🔍 Troubleshooting

### Erro de CORS
Certifique-se de que o backend está configurado para aceitar requests do frontend:

```typescript
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Token Inválido
Limpe o localStorage e faça login novamente:

```javascript
localStorage.removeItem('token')
```

### Build Errors
Limpe cache e reinstale dependências:

```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📄 Licença

Este projeto é privado e não possui licença pública.
