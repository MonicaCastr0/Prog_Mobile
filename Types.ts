export const CATEGORIAS = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Lazer',
  'Outros',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export type Despesa = {
  id: string;
  categoria: Categoria;
  valor: number;
  /** Data no formato ISO: 'AAAA-MM-DD' */
  data: string;
};

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: { usuario: string };
  NovaDespesa: undefined;
};