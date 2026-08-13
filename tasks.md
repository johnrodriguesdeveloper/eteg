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
- [ ] Criar o `PrismaClientRepository` implementando a interface `IClientRepository`.
- [ ] Criar o `ClientController` para lidar com a requisição HTTP.
- [ ] Criar middlewares em `apps/backend/src/middlewares` (Validação do Zod e Tratamento Global de Erros).
- [ ] Configurar as rotas no Express (ex: `POST /clients`) e conectar o Controller.
- [ ] Configurar o `app.ts` centralizando rotas e middlewares.

**Critérios de Aceite:**
* O endpoint `POST /clients` deve retornar status `201` em caso de sucesso.
* O middleware de validação do Zod deve bloquear requisições com dados faltantes ou inválidos (retornando status `400`).
* Tentativas de cadastro com CPF ou e-mail já existentes devem ser tratadas e retornar um erro claro (ex: status `409 Conflict`), garantindo que o cliente saiba do erro[cite: 1].

---

## 🎨 Fase 4: Estrutura Base do Frontend
- [ ] Limpar o template padrão do Vite em `apps/frontend`.
- [ ] Instalar e configurar TailwindCSS (ou framework de UI escolhido).
- [ ] Desenhar o componente de formulário contendo os inputs: Nome completo, CPF, E-mail, Cor preferida (Select) e Observações (Textarea)[cite: 1].
- [ ] Criar a lista de cores do arco-íris em um arquivo de configuração (array/constante) para ser mapeada no Select.

**Critérios de Aceite:**
* A interface deve ser responsiva e limpa.
* A lista de cores deve ser facilmente alterável no código (não engessada), cumprindo o requisito de que as opções podem mudar posteriormente[cite: 1].

---

## 🔗 Fase 5: Integração e Validação do Frontend
- [ ] Configurar o React Hook Form no formulário.
- [ ] Integrar o Zod Resolver utilizando o `ClientSchema` importado do pacote `@eteg/shared`.
- [ ] Criar a função de submissão (fetch/axios) conectando com o endpoint do Backend.
- [ ] Implementar estados visuais: Loading (desabilitar botão), Toast de Sucesso e Toast de Erro.

**Critérios de Aceite:**
* O formulário não deve permitir submissão com dados inválidos (validação em tempo real ou no blur).
* O cliente deve receber um feedback visual claro se o cadastro foi bem sucedido ou se houve falha[cite: 1].

---

## 🚀 Fase 6: DevOps e Entrega Final
- [ ] Criar o `Dockerfile` para o Backend (imagem Node.js baseada na arquitetura sugerida)[cite: 1].
- [ ] Atualizar o `docker-compose.yml` para rodar o Banco de Dados e a Aplicação Node simultaneamente.
- [ ] Garantir que todo o código está em um único repositório[cite: 1].
- [ ] Escrever o `README.md` detalhado.

**Critérios de Aceite:**
* O comando `docker compose up` deve subir toda a infraestrutura necessária sem erros.
* O `README.md` deve conter as instruções exatas de como rodar o projeto e uma breve explicação sobre a escolha da Arquitetura Hexagonal e do Monorepo.