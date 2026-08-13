import { z } from "zod";

export const ListClientsQuerySchema = z.object({
  colorId: z.string().trim().min(1).optional(),
});

export type ListClientsQuery = z.infer<typeof ListClientsQuerySchema>;
