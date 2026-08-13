import { z } from "zod";
import { ClientSchema, CreateColorSchema } from "@eteg/shared";

function buildJsonSchema(schema: z.ZodType, label: string): unknown {
  try {
    return z.toJSONSchema(schema, { target: "openapi-3.0", io: "input" });
  } catch (error) {
    console.error(`Falha ao gerar o schema OpenAPI a partir do ${label}.`, error);
    return { type: "object" };
  }
}

const clientRequestSchema = buildJsonSchema(ClientSchema, "ClientSchema");
const createColorRequestSchema = buildJsonSchema(CreateColorSchema, "CreateColorSchema");

const clientResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    fullName: { type: "string" },
    cpf: { type: "string", example: "52998224725" },
    email: { type: "string", format: "email" },
    color: { type: "string" },
    notes: { type: "string", nullable: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const colorResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    hexCode: { type: "string", example: "#0000FF" },
  },
};

const errorResponseSchema = {
  type: "object",
  properties: {
    error: { type: "string" },
    details: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};

export const openApiDocument = {
  openapi: "3.0.0",
  info: {
    title: "Eteg - API de Cadastro de Clientes",
    version: "1.0.0",
    description: "API para cadastro e administração de clientes e cores disponíveis.",
  },
  paths: {
    "/clients": {
      post: {
        tags: ["Clientes"],
        summary: "Cadastra um novo cliente",
        requestBody: {
          required: true,
          content: { "application/json": { schema: clientRequestSchema } },
        },
        responses: {
          "201": {
            description: "Cliente criado com sucesso",
            content: { "application/json": { schema: clientResponseSchema } },
          },
          "400": {
            description: "Dados inválidos",
            content: { "application/json": { schema: errorResponseSchema } },
          },
          "409": {
            description: "CPF ou e-mail já cadastrado",
            content: { "application/json": { schema: errorResponseSchema } },
          },
        },
      },
      get: {
        tags: ["Clientes"],
        summary: "Lista os clientes cadastrados",
        parameters: [
          {
            name: "colorId",
            in: "query",
            required: false,
            description: "Filtra os clientes pela cor selecionada",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Lista de clientes",
            content: { "application/json": { schema: { type: "array", items: clientResponseSchema } } },
          },
        },
      },
    },
    "/clients/{id}": {
      delete: {
        tags: ["Clientes"],
        summary: "Remove um cliente",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "Cliente removido com sucesso" },
          "404": {
            description: "Cliente não encontrado",
            content: { "application/json": { schema: errorResponseSchema } },
          },
        },
      },
    },
    "/colors": {
      get: {
        tags: ["Cores"],
        summary: "Lista as cores disponíveis",
        responses: {
          "200": {
            description: "Lista de cores",
            content: { "application/json": { schema: { type: "array", items: colorResponseSchema } } },
          },
        },
      },
      post: {
        tags: ["Cores"],
        summary: "Cadastra uma nova cor",
        requestBody: {
          required: true,
          content: { "application/json": { schema: createColorRequestSchema } },
        },
        responses: {
          "201": {
            description: "Cor criada com sucesso",
            content: { "application/json": { schema: colorResponseSchema } },
          },
          "400": {
            description: "Dados inválidos",
            content: { "application/json": { schema: errorResponseSchema } },
          },
          "409": {
            description: "Cor já cadastrada",
            content: { "application/json": { schema: errorResponseSchema } },
          },
        },
      },
    },
    "/colors/{id}": {
      delete: {
        tags: ["Cores"],
        summary: "Remove uma cor",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "Cor removida com sucesso" },
          "404": {
            description: "Cor não encontrada",
            content: { "application/json": { schema: errorResponseSchema } },
          },
        },
      },
    },
  },
};
