import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CATEGORIAS, Categoria, RootStackParamList } from './Types';
import { useDespesas } from './DespesasContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NovaDespesa'>;

export default function NovaDespesa({ navigation }: Props) {
  const { adicionar } = useDespesas();

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [valorTexto, setValorTexto] = useState('');
  const [dataTexto, setDataTexto] = useState(dataDeHoje());

  function handleSalvar() {
    if (!categoria) {
      Alert.alert('Atenção', 'Escolha uma categoria.');
      return;
    }

    const valor = paraNumero(valorTexto);
    if (valor <= 0) {
      Alert.alert('Atenção', 'Informe um valor maior que zero.');
      return;
    }

    const iso = paraISO(dataTexto);
    if (!iso) {
      Alert.alert('Atenção', 'Informe uma data válida no formato DD/MM/AAAA.');
      return;
    }

    adicionar({ categoria, valor, data: iso });
    navigation.goBack();
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.categorias}>
        {CATEGORIAS.map((item) => {
          const ativa = item === categoria;
          return (
            <TouchableOpacity
              key={item}
              style={[styles.chip, ativa && styles.chipAtivo]}
              onPress={() => setCategoria(item)}
            >
              <Text style={[styles.chipTexto, ativa && styles.chipTextoAtivo]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Valor</Text>
      <View style={styles.campoValor}>
        <Text style={styles.prefixo}>R$</Text>
        <TextInput
          style={styles.inputValor}
          placeholder="0,00"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={valorTexto}
          onChangeText={(texto) => setValorTexto(mascaraValor(texto))}
        />
      </View>

      <Text style={styles.label}>Data</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={10}
        value={dataTexto}
        onChangeText={(texto) => setDataTexto(mascaraData(texto))}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>Salvar despesa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/* Máscaras e conversões                                               */
/* ------------------------------------------------------------------ */

function dataDeHoje() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${hoje.getFullYear()}`;
}

/** Digita '1250' e vê '12,50' */
function mascaraValor(texto: string) {
  const digitos = texto.replace(/\D/g, '').slice(0, 11);
  if (!digitos) return '';

  const numero = Number(digitos) / 100;
  const [inteiro, centavos] = numero.toFixed(2).split('.');
  return `${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
}

function paraNumero(mascarado: string) {
  const digitos = mascarado.replace(/\D/g, '');
  return digitos ? Number(digitos) / 100 : 0;
}

function mascaraData(texto: string) {
  const d = texto.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** '16/09/2026' -> '2026-09-16' (ou null se a data não existir) */
function paraISO(texto: string): string | null {
  const partes = texto.split('/');
  if (partes.length !== 3 || partes[2].length !== 4) return null;

  const [dia, mes, ano] = partes.map(Number);
  const data = new Date(ano, mes - 1, dia);

  const valida =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia;

  if (!valida) return null;

  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  conteudo: { padding: 20 },

  label: { fontSize: 16, fontWeight: '600', marginBottom: 10, marginTop: 10 },

  categorias: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  chipAtivo: { backgroundColor: '#007bff', borderColor: '#007bff' },
  chipTexto: { fontSize: 14, color: '#333' },
  chipTextoAtivo: { color: '#fff', fontWeight: '600' },

  campoValor: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  prefixo: { fontSize: 18, color: '#666', marginRight: 8 },
  inputValor: { flex: 1, fontSize: 22, fontWeight: '600' },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  botao: {
    height: 52,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  botaoTexto: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});