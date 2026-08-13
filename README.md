# Eteg — Cadastro de Clientes

Monorepo full-stack para cadastro de clientes: formulário público de cadastro, painel administrativo (listagem de clientes e CRUD de cores) e uma API REST documentada em Swagger, com PostgreSQL como banco de dados.

```
eteg/
├── apps/
│   ├── backend/     # Node.js + Express + Prisma — Arquitetura Hexagonal
│   └── frontend/    # React + Vite + Shadcn — Custom Hooks
├── packages/
│   └── shared/      # Schemas Zod compartilhados entre backend e frontend
├── docker-compose.yml
└── package.json     # raiz do npm workspaces
```

O projeto é um **npm workspace**: `apps/*` e `packages/*` compartilham um único `node_modules` na raiz, e `packages/shared` é consumido por link simbólico — não é publicado, é importado como `@eteg/shared` diretamente a partir do TypeScript-fonte.

---

## Sumário

- [Decisões arquiteturais](#decisões-arquiteturais)
- [Sobre a tela de Admin (sem autenticação)](#sobre-a-tela-de-admin-sem-autenticação)
- [Como rodar com Docker](#como-rodar-com-docker-recomendado)
- [Como rodar em modo desenvolvimento (sem Docker)](#como-rodar-em-modo-desenvolvimento-sem-docker)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Documentação da API](#documentação-da-api)
- [Stack](#stack)

---

## Decisões arquiteturais

### Backend — Arquitetura Hexagonal (Ports & Adapters)

O `apps/backend` separa regra de negócio de infraestrutura em camadas explícitas:

```
src/
├── controllers/     # Adaptador HTTP de entrada — traduz Request/Response
├── use-cases/        # Regra de negócio pura, isolada de Express e Prisma
├── repositories/
│   ├── I*.ts          # Portas (interfaces) — o que o domínio precisa do mundo externo
│   └── Prisma*.ts      # Adaptadores — implementação concreta com Prisma
├── routes/           # Composição das rotas Express
├── middlewares/       # validação (Zod) e tratamento de erros
├── errors/            # erros de domínio tipados (ex: ConflictError)
└── database/          # cliente Prisma configurado com driver adapter (pg)
```

O ponto central da arquitetura é a **inversão de dependência via interface**: um `CreateClientUseCase` depende apenas de `IClientRepository` (uma porta), nunca de `PrismaClientRepository` diretamente:

```ts
export class CreateClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(input: ClientInput): Promise<ClientRecord> {
    // regra de negócio pura — nenhuma dependência de Express ou Prisma aqui
  }
}
```

Isso significa que a regra de negócio (unicidade de CPF/e-mail, validações de domínio) pode ser testada com um repositório em memória, sem subir banco de dados nem servidor HTTP, e o Prisma pode ser trocado por qualquer outro adaptador sem tocar em `use-cases/`.

Validação de entrada usa os mesmos schemas Zod de `@eteg/shared` (via `middlewares/validateSchema.ts`), garantindo que backend e frontend nunca divirjam sobre o formato de um `Client` ou de uma `Color`.

### Frontend — Custom Hooks (separação Interface / Lógica)

Cada feature em `apps/frontend/src/features/*` segue rigorosamente três arquivos:

```
features/client-form/
├── index.tsx    # Apenas JSX — consome o retorno do hook, sem estado próprio
├── hook.ts      # TODA a lógica: react-hook-form, chamadas Axios, toasts, loading
└── types.d.ts   # Contrato entre index.tsx e hook.ts
```

`index.tsx` nunca contém `useState`, chamadas HTTP ou `localStorage` — apenas renderiza o que `hook.ts` (ex.: `useClientForm()`) retorna. Essa regra foi mantida também no `ThemeToggle` (persistência em `localStorage`) e no `admin-dashboard` (chamadas Axios para `/clients` e `/colors`). O benefício prático: a lógica é testável isoladamente do JSX, e trocar a biblioteca de UI (Shadcn) não exige tocar em nenhuma regra de negócio do frontend.

A validação client-side reaproveita o **mesmo** `ClientSchema` do backend via `@hookform/resolvers/zod`, eliminando duplicação de regras entre as duas pontas.

---

## Sobre a tela de Admin (sem autenticação)

O painel `/admin` (listagem de clientes, criação e remoção de cores) está **deliberadamente aberto, sem login**. Essa foi uma decisão consciente para priorizar entregar o fluxo funcional completo (cadastro → persistência → listagem → CRUD de cores) dentro do prazo, em vez de gastar tempo de implementação em um sistema de autenticação que não fazia parte do núcleo do desafio.

Isso **não é considerado adequado para produção**. O próximo passo natural — e a primeira tarefa a priorizar caso o projeto continue — é:

1. Adicionar um `AuthController` + `LoginUseCase` (mesmo padrão hexagonal já usado nos demais use-cases) emitindo um **JWT** no login.
2. Um middleware `ensureAuthenticated` protegendo as rotas `/admin`-equivalentes no backend (`GET /clients`, `DELETE /clients/:id`, `POST /colors`, `DELETE /colors/:id` — note que `POST /clients` e `GET /colors` devem continuar públicas, pois alimentam o formulário público).
3. No frontend, uma rota protegida (`<RequireAuth>`) envolvendo `/admin`, com o token guardado fora de `localStorage` puro (idealmente em memória + refresh token em cookie `httpOnly`) para reduzir exposição a XSS.

---

## Como rodar com Docker (recomendado)

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e Docker Compose (já incluído no Docker Desktop).

```bash
# 1. Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# 2. Suba tudo (Postgres + Backend + Frontend)
docker compose up --build
```

Isso orquestra três serviços:

| Serviço    | Descrição                                             | Porta padrão (host)              |
| ---------- | ------------------------------------------------------ | --------------------------------- |
| `postgres` | PostgreSQL 16, com volume persistente `postgres_data`  | `127.0.0.1:5432`                  |
| `backend`  | API Express, roda `prisma migrate deploy` ao subir     | `127.0.0.1:3333` → Swagger em `/api-docs` |
| `frontend` | build estático do Vite, servido por Nginx              | `127.0.0.1:8080`                  |

Depois de subir, acesse:

- **Formulário de cadastro:** http://localhost:8080
- **Painel Admin:** http://localhost:8080/admin
- **Swagger UI (API):** http://localhost:3333/api-docs

Para derrubar tudo (mantendo os dados do Postgres):

```bash
docker compose down
```

Para apagar também o volume do banco (reset completo):

```bash
docker compose down -v
```

### Detalhes de implementação dos Dockerfiles

- **`apps/backend/Dockerfile`** — multi-stage: (1) instala apenas os workspaces `apps/backend` + `packages/shared` via `npm ci -w` (o `node_modules` do frontend nunca entra nessa imagem); (2) roda `prisma generate` contra o schema real; (3) imagem final `node:26-alpine`, usuário não-root, `HEALTHCHECK` embutido, e `prisma migrate deploy` executado no `CMD` (na subida do container, não no build — build time não tem acesso ao banco).
- **`apps/frontend/Dockerfile`** — multi-stage: (1) instala `apps/frontend` + `packages/shared`; (2) `vite build`, com `VITE_API_URL` injetado como build-arg (variáveis `VITE_*` são embutidas no bundle **em build time**, não em runtime — por isso o valor precisa ser a URL que o **navegador** do usuário alcança, não o nome do serviço Docker); (3) build estático servido por `nginx:1.27-alpine`, com `try_files` configurado para o roteamento client-side do `react-router-dom` (`BrowserRouter`).
- Ambos os builds usam a **raiz do monorepo como contexto** (`context: .` no `docker-compose.yml`), porque `@eteg/shared` só existe como link simbólico do workspace — não é um pacote publicado no npm.

---

## Como rodar em modo desenvolvimento (sem Docker)

Pré-requisitos: Node.js 26+, um Postgres acessível localmente (ou `docker compose up postgres` para subir só o banco).

```bash
# na raiz do monorepo
npm install

# configure as variáveis de ambiente
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# aplique as migrations e popule as cores padrão
npm run --workspace=apps/backend seed  # roda `prisma db seed`, que também aplica migrations pendentes

# backend (porta 3333)
npm run dev --workspace=apps/backend

# frontend, em outro terminal (porta 5173)
npm run dev --workspace=apps/frontend
```

> `apps/backend/package.json` não tem passo de build: o Node 26 executa TypeScript nativamente (`node --env-file=.env src/server.ts`), sem `tsx`/`ts-node`.

---

## Variáveis de ambiente

| Arquivo                        | Variável           | Descrição                                             |
| ------------------------------- | ------------------- | ------------------------------------------------------ |
| `.env` (raiz)                   | `POSTGRES_USER`      | Usuário do Postgres no container                       |
| `.env` (raiz)                   | `POSTGRES_PASSWORD`  | Senha do Postgres no container                         |
| `.env` (raiz)                   | `POSTGRES_DB`        | Nome do banco                                           |
| `.env` (raiz)                   | `BACKEND_PORT`       | Porta do host publicada para o backend (padrão `3333`) |
| `.env` (raiz)                   | `FRONTEND_PORT`      | Porta do host publicada para o frontend (padrão `8080`)|
| `apps/backend/.env`             | `DATABASE_URL`       | Connection string do Postgres (uso local, sem Docker)  |
| `apps/backend/.env`             | `PORT`               | Porta da API Express (uso local, sem Docker)            |
| `apps/frontend/.env`            | `VITE_API_URL`       | URL da API consumida pelo frontend (uso local, sem Docker) |

Em Docker, `DATABASE_URL`, `PORT`, `FRONTEND_URL` (backend) e `VITE_API_URL` (frontend) são calculados automaticamente pelo `docker-compose.yml` a partir de `BACKEND_PORT`/`FRONTEND_PORT` — não é necessário (nem recomendado) sobrescrevê-los manualmente.

---

## Documentação da API

Com o backend no ar, a documentação interativa (Swagger UI, gerada a partir dos schemas Zod de `@eteg/shared`) fica disponível em:

```
http://localhost:3333/api-docs
```

Endpoints principais:

| Método   | Rota           | Descrição                                  |
| -------- | -------------- | -------------------------------------------- |
| `POST`   | `/clients`     | Cadastra um cliente (valida CPF/e-mail únicos) |
| `GET`    | `/clients`     | Lista clientes (uso do painel Admin)          |
| `DELETE` | `/clients/:id` | Remove um cliente (uso do painel Admin)       |
| `GET`    | `/colors`      | Lista cores disponíveis                       |
| `POST`   | `/colors`      | Cria uma nova cor (uso do painel Admin)       |
| `DELETE` | `/colors/:id`  | Remove uma cor (uso do painel Admin)          |

---

## Stack

**Backend:** Node.js 26 · TypeScript · Express 5 · Prisma ORM 7 (com `@prisma/adapter-pg`) · Zod · Swagger UI
**Frontend:** React 19 · Vite · TypeScript · Shadcn/ui · Tailwind CSS 4 · React Hook Form · React Router · Axios · Sonner
**Compartilhado:** Zod (`packages/shared`) — única fonte de verdade para validação, usada por backend, frontend e geração do Swagger
**Infra:** PostgreSQL 16 · Docker (multi-stage builds) · Nginx (serve o frontend)

---

*Copyright John Rodrigues. Licenciado sob Apache 2.0.*
