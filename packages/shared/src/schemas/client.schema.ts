import { z } from "zod";

function isValidCPF(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const calcCheckDigit = (base: string): number => {
    let sum = 0;
    let weight = base.length + 1;
    for (const digit of base) {
      sum += Number(digit) * weight;
      weight--;
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstNine = cpf.slice(0, 9);
  const firstDigit = calcCheckDigit(firstNine);
  const secondDigit = calcCheckDigit(firstNine + firstDigit);

  return cpf === `${firstNine}${firstDigit}${secondDigit}`;
}

export const ClientSchema = z.object({
  fullName: z.string().trim().min(3, "Nome completo deve ter no mínimo 3 caracteres."),
  cpf: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine(isValidCPF, "CPF inválido."),
  email: z.string().trim().email("E-mail inválido."),
  color: z.string().trim().min(1, "Cor preferida é obrigatória."),
  notes: z.string().trim().optional(),
});

export type ClientInput = z.infer<typeof ClientSchema>;
