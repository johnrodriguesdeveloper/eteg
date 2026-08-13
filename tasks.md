# Roadmap do Projeto: Eteg - John Doe (Desafio Técnico)

Este documento rastreia o progresso do desenvolvimento da aplicação de cadastro de clientes, utilizando arquitetura hexagonal no backend, monorepo e validações compartilhadas.

## 🗄️ Fase 1: Infraestrutura e Modelagem (Backend)
- [x] Criar o arquivo `docker-compose.yml` na raiz contendo o serviço do PostgreSQL.
- [x] Inicializar o Prisma ORM (`npx prisma init`) dentro de `apps/backend`.
- [x] Criar o modelo `Client` no `schema.prisma` com os campos: Nome completo, CPF, e-mail, cor preferida e observações[cite: 1].
- [x] Executar a primeira migration e gerar o Prisma Client.

**Critérios de Aceite:**
* O banco de dados sobe corretamente via Docker na porta padrão (5432).
* O schema do Prisma não utiliza `Enum` nativo do banco para as cores preferidas (para permitir flexibilidade futura).
* CPF e E-mail devem ser marcados com `@unique` no schema para garantir a regra de cadastro único[cite: 1].

---

## 🏗️ Fase 2: Domínio e Casos de Uso (Backend)
- [x] Configurar o pacote `@eteg/shared` com Zod exportando o `ClientSchema` (validação de tipos e formatos).
- [x] Criar a interface do repositório `IClientRepository` em `apps/backend/src/repositories`.
- [x] Criar o caso de uso `CreateClientUseCase` em `apps/backend/src/use-cases`.
- [x] Implementar a regra de negócio que verifica duplicidade de CPF ou E-mail antes de salvar.

**Critérios de Aceite:**
* O pacote `@eteg/shared` deve ser utilizável pelo backend.
* O `CreateClientUseCase` **não** pode ter imports do Express ou do Prisma (Aderência à Arquitetura Hexagonal).
* O construtor do UseCase deve receber dependências através da interface `IClientRepository`.

---

## 🔌 Fase 3: Adaptadores e API (Backend)
- [x] Criar o `PrismaClientRepository` implementando a interface `IClientRepository`.
- [x] Criar o `ClientController` para lidar com a requisição HTTP.
- [x] Criar middlewares em `apps/backend/src/middlewares` (Validação do Zod e Tratamento Global de Erros).
- [x] Configurar as rotas no Express (ex: `POST /clients`) e conectar o Controller.
- [x] Configurar o `app.ts` centralizando rotas e middlewares.

**Critérios de Aceite:**
* O endpoint `POST /clients` deve retornar status `201` em caso de sucesso.
* O middleware de validação do Zod deve bloquear requisições com dados faltantes ou inválidos (retornando status `400`).
* Tentativas de cadastro com CPF ou e-mail já existentes devem ser tratadas e retornar um erro claro (ex: status `409 Conflict`), garantindo que o cliente saiba do erro[cite: 1].

## 🛡️ Fase 4: Evolução do Domínio - Painel Admin (Backend)
- [x] Criar o modelo `Color` no `schema.prisma` (id, name, hexCode) para permitir flexibilidade e gerar nova migration.
- [x] Atualizar a interface `IClientRepository` com os métodos `findAll()` e `delete(id: string)`.
- [x] Criar a interface `IColorRepository` com o método `findAll()`.
- [x] Implementar os novos métodos no `PrismaClientRepository` e criar o adaptador `PrismaColorRepository`.
- [x] Criar os novos casos de uso em `apps/backend/src/use-cases`: `ListClientsUseCase`, `DeleteClientUseCase` e `ListColorsUseCase`.
- [x] Criar os Controllers necessários e registrar as novas rotas no Express: `GET /clients`, `DELETE /clients/:id` e `GET /colors`.

**Critérios de Aceite:**
* A modelagem de cores passa a ser dinâmica pelo banco, cumprindo o requisito de que "isso pode mudar posteriormente".
* O endpoint `DELETE /clients/:id` deve retornar status `204 (No Content)` em caso de sucesso.
* O endpoint `GET /colors` deve listar as opções disponíveis de forma limpa.
* A Arquitetura Hexagonal deve ser rigorosamente mantida: os novos UseCases **não** podem importar recursos do Prisma ou Express.

## 📖 Fase 5: Documentação e Filtros Analíticos (Fechamento do Backend)
- [x] Atualizar o `ListClientsUseCase` e o `IClientRepository` para aceitar um filtro opcional por cor (`colorId`).
- [x] Atualizar o `ClientController` para extrair o `colorId` dos *Query Parameters* (`req.query`) e repassar ao UseCase.
- [x] Instalar as dependências do Swagger (`swagger-ui-express`, `swagger-jsdoc` ou equivalente) no `apps/backend`.
- [x] Integrar os schemas do Zod (do `@eteg/shared`) para gerar as definições do Swagger automaticamente (OpenAPI 3.0).
- [x] Criar a rota pública `GET /api-docs` para renderizar a interface visual do Swagger UI.

**Critérios de Aceite:**
* A rota `GET /clients?colorId={id}` deve retornar apenas os clientes daquela cor específica.
* A interface do Swagger deve carregar corretamente e listar todos os endpoints criados (Clientes e Cores).
* Os *schemas* de requisição e resposta no Swagger devem refletir as regras de negócio[cite: 1] (ex: CPF obrigatório, etc).

## 🌈 Fase 6: Gestão de Cores e Seed do Banco (Backend)
- [x] Criar o schema de validação `CreateColorSchema` no pacote `@eteg/shared` (exigindo `name` e `hexCode` como strings).
- [x] Criar o `CreateColorUseCase` dentro de `apps/backend/src/use-cases`, injetando o `IColorRepository`.
- [x] Atualizar o `ColorController` e o arquivo de rotas para incluir o `POST /colors`.
- [x] Atualizar as configurações do Swagger para incluir a documentação deste novo endpoint.
- [x] Criar um script de "Seed" (`apps/backend/prisma/seed.ts`) que insira automaticamente as 7 cores clássicas do arco-íris no banco de dados, configurando-o no `package.json`.

**Critérios de Aceite:**
* A API deve aceitar requisições `POST` em `/colors` e persistir a nova cor no banco, suportando o requisito de mudança de cores no futuro[cite: 1].
* Se a requisição for enviada sem os campos corretos, o middleware do Zod deve bloquear e retornar `400 Bad Request`.
* O novo endpoint deve estar visível e testável na interface do Swagger UI.
* Rodar o comando de seed (`npx prisma db seed`) deve popular o banco com as cores iniciais prontas para o formulário do frontend consumir.

## ♻️ Fase 7: Refatoração do Monorepo (Shared Schemas)
- [x] Criar a pasta `src` dentro de `packages/shared` (se não existir) e configurar um arquivo `index.ts` principal.
- [x] Mover todos os schemas de validação do Zod (ex: `CreateClientSchema`, `CreateColorSchema`) que estão atualmente em `apps/backend` para dentro de `packages/shared/src`.
- [x] Exportar todos esses schemas e seus respectivos tipos inferidos (`z.infer`) no arquivo `packages/shared/src/index.ts`.
- [x] Garantir que o `package.json` do `@eteg/shared` tenha o `zod` instalado nas dependências e que os pontos de entrada (`main` ou `exports`) estejam corretos.
- [x] Refatorar o `apps/backend` (Middlewares, Controllers, Swagger, etc.) substituindo os imports locais dos schemas pelo import direto do pacote `@eteg/shared`.

**Critérios de Aceite:**
* Não deve sobrar nenhum schema de domínio do Zod perdido dentro da pasta do backend.
* O backend deve compilar sem erros de importação.
* A rota de criação de clientes e cores deve continuar funcionando e validando os dados normalmente.
* O monorepo agora está pronto para que o Frontend importe e utilize as exatas mesmas validações.

## 🎨 Fase 8: Setup do Frontend e Componentes Base (React + Shadcn)
- [ ] Configurar o TailwindCSS no `apps/frontend` (se ainda não estiver).
- [ ] Inicializar o Shadcn UI (`npx shadcn-ui@latest init`) no frontend.
- [ ] Adicionar os componentes do Shadcn que usaremos: `form`, `input`, `select`, `textarea`, `button` e `sonner` (para os Toasts).
- [ ] Instalar `axios`, `react-hook-form` e `@hookform/resolvers`.
- [ ] Criar a configuração base do Axios em `apps/frontend/src/lib/api.ts` apontando para `http://localhost:3000` (ou a porta do seu backend).
- [ ] Garantir que o `apps/frontend/package.json` dependa do `@eteg/shared` para importar os schemas.

**Critérios de Aceite:**
* O frontend deve rodar sem erros estruturais.
* O Shadcn deve estar configurado na pasta `components/ui`.
* A instância do Axios deve estar pronta para ser usada nos hooks.