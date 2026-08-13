export interface ColorRecord {
  id: string;
  name: string;
  hexCode: string;
}

export interface IColorRepository {
  findAll(): Promise<ColorRecord[]>;
}
