# Proteção de Rotas - ALTAA Frontend

Este documento explica como funciona a proteção de rotas autenticadas no frontend.

## 🔐 Arquitetura de Autenticação

### 1. **Middleware (SSR)**
O arquivo `src/middleware.ts` intercepta todas as requisições antes de renderizar as páginas.

#### Como funciona:
- Roda no **servidor** (Server-Side Rendering)
- Verifica se o usuário tem token JWT nos **cookies**
- Redireciona automaticamente para `/login` se não autenticado
- Impede acesso a `/login` e `/signup` se já autenticado

#### Rotas Protegidas:
```typescript
// Rotas públicas (não precisam de autenticação)
const publicRoutes = ['/login', '/signup'];

// Rotas de autenticação (redirecionam para /dashboard se já logado)
const authRoutes = ['/login', '/signup'];
```

#### Fluxo de Proteção:
```
Usuário tenta acessar /dashboard
    ↓
Middleware verifica cookie "token"
    ↓
Se NÃO tem token → Redireciona para /login
Se TEM token → Permite acesso à página
```

### 2. **Gerenciamento de Token com Cookies**

#### Por que cookies em vez de localStorage?

| localStorage | Cookies (HTTPOnly) |
|-------------|-------------------|
| ❌ Acessível apenas no client | ✅ Acessível no server (middleware) |
| ❌ Vulnerável a XSS | ✅ Mais seguro contra XSS |
| ❌ Não funciona com SSR | ✅ Funciona com SSR |

#### Funções de Cookie (`src/lib/cookies.ts`):

```typescript
// Salvar token (após login/signup)
setCookie('token', jwt_token, 7); // Expira em 7 dias

// Ler token (para requisições API)
getCookie('token');

// Deletar token (logout)
deleteCookie('token');
```

### 3. **Integração com API (`src/lib/api.ts`)**

Todas as funções de autenticação agora usam cookies:

```typescript
// Login
export async function signin(email: string, password: string) {
  const res = await fetch('/auth/signin', { ... });
  const { access_token } = await res.json();
  setCookie('token', access_token, 7); // ✅ Salva nos cookies
}

// Pegar token para headers
export function getAuthToken() {
  return getCookie('token'); // ✅ Lê dos cookies
}

// Logout
export function signout() {
  deleteCookie('token'); // ✅ Remove dos cookies
}
```

## 🛡️ Fluxo Completo de Autenticação

### Login:
1. Usuário acessa `/login`
2. Middleware permite (rota pública)
3. Usuário digita credenciais
4. `signin()` faz POST para backend
5. Backend retorna JWT
6. `setCookie('token', jwt, 7)` salva nos cookies
7. Redirecionamento para `/dashboard`
8. Middleware verifica cookie e permite acesso

### Acesso a Rota Protegida:
1. Usuário tenta acessar `/dashboard`
2. Middleware verifica cookie `token`
3. Se existe → Permite acesso
4. Se não existe → Redireciona para `/login`

### Logout:
1. Usuário clica em "Sair"
2. `signout()` deleta cookie
3. Redirecionamento para `/login`
4. Middleware bloqueia acesso a rotas protegidas

## 📁 Arquivos Importantes

```
frontend/src/
├── middleware.ts              # 🔒 Proteção SSR de rotas
├── lib/
│   ├── cookies.ts            # 🍪 Gerenciamento de cookies
│   └── api.ts                # 🌐 Cliente HTTP com auth
└── app/
    ├── login/page.tsx        # Login (rota pública)
    ├── signup/page.tsx       # Cadastro (rota pública)
    └── dashboard/page.tsx    # Dashboard (rota protegida)
```

## 🔧 Configuração do Middleware

### Matcher (quais rotas processar):
```typescript
export const config = {
  matcher: [
    // Processa TODAS as rotas exceto:
    // - Arquivos estáticos (_next/static)
    // - Imagens (_next/image)
    // - favicon.ico
    // - Imagens (svg, png, jpg, etc.)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

## 🚀 Como Adicionar Nova Rota Protegida

Basta criar a página normalmente. O middleware **automaticamente** protege todas as rotas que não estão em `publicRoutes`.

```typescript
// src/app/settings/page.tsx
export default function Settings() {
  return <div>Configurações</div>;
}
```

✅ `/settings` será **automaticamente protegida**

## 🆕 Como Adicionar Nova Rota Pública

Adicione ao array `publicRoutes` no middleware:

```typescript
// src/middleware.ts
const publicRoutes = ['/login', '/signup', '/about', '/terms'];
```

## ⚠️ Importante

### Cookies devem ser configurados no backend também!

O backend precisa aceitar cookies nas requisições CORS:

```typescript
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000', // URL do frontend
  credentials: true,               // ✅ Permite cookies
});
```

## 🧪 Testando a Proteção

### Teste 1: Acesso sem autenticação
1. Abra navegador em modo anônimo
2. Acesse `http://localhost:3000/dashboard`
3. ✅ Deve redirecionar para `/login`

### Teste 2: Login e acesso protegido
1. Faça login em `/login`
2. ✅ Deve salvar cookie e redirecionar para `/dashboard`
3. Recarregue a página
4. ✅ Deve manter autenticado (cookie persiste)

### Teste 3: Logout
1. No dashboard, clique em "Sair"
2. ✅ Cookie deve ser deletado
3. Tente acessar `/dashboard` novamente
4. ✅ Deve redirecionar para `/login`

### Teste 4: Acesso a login quando autenticado
1. Faça login
2. Tente acessar `/login` manualmente
3. ✅ Deve redirecionar para `/dashboard`

## 🔒 Segurança

### Boas Práticas Implementadas:
- ✅ Token em cookie com `SameSite=Strict`
- ✅ Expiração de 7 dias
- ✅ Validação server-side via middleware
- ✅ Redirecionamentos automáticos
- ✅ Sem exposição de token em URL ou localStorage

### Melhorias Futuras (Opcional):
- 🔄 Refresh token automático
- 🍪 Cookie `HttpOnly` (requer mudança no backend)
- 🔐 Cookie `Secure` em produção (HTTPS)
- ⏱️ Renovação automática antes de expirar
