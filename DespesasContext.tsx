import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Despesa } from './Types';

const CHAVE_STORAGE = '@despesas';

type DespesasContextData = {
  despesas: Despesa[];
  carregando: boolean;
  adicionar: (dados: Omit<Despesa, 'id'>) => void;
  remover: (id: string) => void;
};

const DespesasContext = createContext<DespesasContextData>({
  despesas: [],
  carregando: true,
  adicionar: () => {},
  remover: () => {},
});

export function DespesasProvider({ children }: { children: React.ReactNode }) {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Lê o que já estava salvo quando o app abre
  useEffect(() => {
    AsyncStorage.getItem(CHAVE_STORAGE)
      .then((json) => {
        if (json) setDespesas(JSON.parse(json));
      })
      .catch(() => {
        // se falhar a leitura, o app segue com a lista vazia
      })
      .finally(() => setCarregando(false));
  }, []);

  // Salva a cada alteração (só depois da carga inicial)
  useEffect(() => {
    if (carregando) return;
    AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify(despesas)).catch(() => {});
  }, [despesas, carregando]);

  function adicionar(dados: Omit<Despesa, 'id'>) {
    const nova: Despesa = { ...dados, id: String(Date.now()) };
    setDespesas((atual) =>
      [nova, ...atual].sort((a, b) => b.data.localeCompare(a.data))
    );
  }

  function remover(id: string) {
    setDespesas((atual) => atual.filter((d) => d.id !== id));
  }

  const valor = useMemo(
    () => ({ despesas, carregando, adicionar, remover }),
    [despesas, carregando]
  );

  return (
    <DespesasContext.Provider value={valor}>{children}</DespesasContext.Provider>
  );
}

export const useDespesas = () => useContext(DespesasContext);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ROTULOS_MES = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export type ResumoMes = {
  /** 'AAAA-MM' */
  chave: string;
  rotulo: string;
  total: number;
};

/**
 * Soma as despesas por mês nos últimos 6 meses, do mais antigo
 * para o mais recente. Meses sem despesa entram com total 0.
 */
export function resumoUltimosSeisMeses(despesas: Despesa[]): ResumoMes[] {
  const hoje = new Date();
  const meses: ResumoMes[] = [];

  for (let i = 5; i >= 0; i--) {
    const referencia = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const chave = `${referencia.getFullYear()}-${String(
      referencia.getMonth() + 1
    ).padStart(2, '0')}`;

    const total = despesas
      .filter((d) => d.data.slice(0, 7) === chave)
      .reduce((soma, d) => soma + d.valor, 0);

    meses.push({ chave, rotulo: ROTULOS_MES[referencia.getMonth()], total });
  }

  return meses;
}

/** 1234.5 -> 'R$ 1.234,50' */
export function formatarMoeda(valor: number) {
  const [inteiro, centavos] = valor.toFixed(2).split('.');
  const comSeparador = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${comSeparador},${centavos}`;
}

/** '2026-09-16' -> '16/09/2026' */
export function formatarData(iso: string) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

