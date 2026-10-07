import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Despesa, RootStackParamList } from './Types';
import {
  formatarData,
  formatarMoeda,
  resumoUltimosSeisMeses,
  ResumoMes,
  useDespesas,
} from './DespesasContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const ALTURA_GRAFICO = 150;

export default function Home({ route, navigation }: Props) {
  const { usuario } = route.params;
  const { despesas, carregando, remover } = useDespesas();

  const meses = useMemo(() => resumoUltimosSeisMeses(despesas), [despesas]);
  const totalDoMes = meses[meses.length - 1]?.total ?? 0;

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={despesas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <>
            <Text style={styles.saudacao}>Olá, {usuario}</Text>

            <View style={styles.destaque}>
              <Text style={styles.destaqueRotulo}>Gasto neste mês</Text>
              <Text style={styles.destaqueValor}>{formatarMoeda(totalDoMes)}</Text>
            </View>

            <Grafico meses={meses} />

            <Text style={styles.secao}>Despesas</Text>
          </>
        }
        renderItem={({ item }) => <Linha despesa={item} onRemover={remover} />}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhuma despesa registrada ainda. Toque em “Nova despesa” para
            começar.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('NovaDespesa')}
      >
        <Text style={styles.botaoTexto}>Nova despesa</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Gráfico de barras (sem bibliotecas externas)                        */
/* ------------------------------------------------------------------ */

function Grafico({ meses }: { meses: ResumoMes[] }) {
  const maior = Math.max(...meses.map((m) => m.total), 1);

  return (
    <View style={styles.grafico}>
      <Text style={styles.graficoTitulo}>Últimos 6 meses</Text>

      <View style={styles.barras}>
        {meses.map((mes, indice) => {
          const altura = Math.max((mes.total / maior) * ALTURA_GRAFICO, 3);
          const atual = indice === meses.length - 1;

          return (
            <View key={mes.chave} style={styles.coluna}>
              <Text style={styles.valorBarra}>
                {mes.total > 0 ? Math.round(mes.total) : ''}
              </Text>

              <View
                style={[
                  styles.barra,
                  { height: altura },
                  atual && styles.barraAtual,
                ]}
              />

              <Text style={[styles.rotuloMes, atual && styles.rotuloMesAtual]}>
                {mes.rotulo}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Item da lista                                                       */
/* ------------------------------------------------------------------ */

function Linha({
  despesa,
  onRemover,
}: {
  despesa: Despesa;
  onRemover: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.linha}
      onLongPress={() => onRemover(despesa.id)}
    >
      <View>
        <Text style={styles.linhaCategoria}>{despesa.categoria}</Text>
        <Text style={styles.linhaData}>{formatarData(despesa.data)}</Text>
      </View>
      <Text style={styles.linhaValor}>{formatarMoeda(despesa.valor)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  centro: { justifyContent: 'center', alignItems: 'center' },
  lista: { padding: 20, paddingBottom: 100 },

  saudacao: { fontSize: 14, color: '#666', marginBottom: 4 },

  destaque: { marginBottom: 24 },
  destaqueRotulo: { fontSize: 16, color: '#444' },
  destaqueValor: { fontSize: 34, fontWeight: 'bold', marginTop: 2 },

  grafico: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    paddingBottom: 12,
  },
  graficoTitulo: { fontSize: 15, fontWeight: '600', marginBottom: 16 },
  barras: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: ALTURA_GRAFICO + 40,
  },
  coluna: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  valorBarra: { fontSize: 11, color: '#888', marginBottom: 4 },
  barra: {
    width: '58%',
    borderRadius: 4,
    backgroundColor: '#cfe2ff',
  },
  barraAtual: { backgroundColor: '#007bff' },
  rotuloMes: { fontSize: 12, color: '#888', marginTop: 8 },
  rotuloMesAtual: { color: '#007bff', fontWeight: '600' },

  secao: { fontSize: 15, fontWeight: '600', marginTop: 28, marginBottom: 10 },

  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  linhaCategoria: { fontSize: 16, fontWeight: '500' },
  linhaData: { fontSize: 13, color: '#888', marginTop: 2 },
  linhaValor: { fontSize: 16, fontWeight: '600' },

  vazio: { color: '#888', lineHeight: 22 },

  botao: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});