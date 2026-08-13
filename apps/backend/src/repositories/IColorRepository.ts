import type { CreateColorInput as CreateColorSchemaInput } from "@eteg/shared";

export interface ColorRecord {
  id: string;
  name: string;
  hexCode: string;
}

export type CreateColorInput = CreateColorSchemaInput;

export interface IColorRepository {
  findAll(): Promise<ColorRecord[]>;
  findByName(name: string): Promise<ColorRecord | null>;
  create(data: CreateColorInput): Promise<ColorRecord>;
  delete(id: string): Promise<void>;
}
