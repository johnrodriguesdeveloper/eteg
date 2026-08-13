import { z } from "zod";

export const CreateColorSchema = z.object({
  name: z.string().trim().min(1, "Nome da cor é obrigatório."),
  hexCode: z.string().trim().min(1, "Código hexadecimal é obrigatório."),
});

export type CreateColorInput = z.infer<typeof CreateColorSchema>;
