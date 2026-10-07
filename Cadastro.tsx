import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from './Types';
import {
  validarConfirmacao,
  validarEmail,
  validarSenha,
  validarUsuario,
} from './validacao';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

type Erros = {
  usuario?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
};

export default function Cadastro({ navigation }: Props) {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState<Erros>({});

  function handleCadastro() {
    const novosErros: Erros = {
      usuario: validarUsuario(usuario) ?? undefined,
      email: validarEmail(email) ?? undefined,
      senha: validarSenha(senha) ?? undefined,
      confirmarSenha: validarConfirmacao(senha, confirmarSenha) ?? undefined,
    };

    setErros(novosErros);

    // se algum campo tiver erro, não avança
    if (Object.values(novosErros).some(Boolean)) return;

    navigation.navigate('Home', { usuario: usuario.trim() });
  }

  return (
    <View style={styles.container}>
      <View style={styles.cadastroContainer}>
        <Text style={styles.title}>Criar conta</Text>

        <View style={styles.campo}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={[styles.input, erros.usuario && styles.inputErro]}
            placeholder="Digite seu usuário"
            placeholderTextColor="#999"
            autoCapitalize="none"
            value={usuario}
            onChangeText={(texto) => {
              setUsuario(texto);
              if (erros.usuario) setErros((e) => ({ ...e, usuario: undefined }));
            }}
          />
          {erros.usuario && <Text style={styles.erro}>{erros.usuario}</Text>}
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, erros.email && styles.inputErro]}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(texto) => {
              setEmail(texto);
              if (erros.email) setErros((e) => ({ ...e, email: undefined }));
            }}
          />
          {erros.email && <Text style={styles.erro}>{erros.email}</Text>}
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, erros.senha && styles.inputErro]}
            placeholder="Mínimo de 8 caracteres"
            placeholderTextColor="#999"
            secureTextEntry
            value={senha}
            onChangeText={(texto) => {
              setSenha(texto);
              // a confirmação depende da senha, então limpa os dois erros
              if (erros.senha || erros.confirmarSenha) {
                setErros((e) => ({
                  ...e,
                  senha: undefined,
                  confirmarSenha: undefined,
                }));
              }
            }}
          />
          {erros.senha && <Text style={styles.erro}>{erros.senha}</Text>}
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={[styles.input, erros.confirmarSenha && styles.inputErro]}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={(texto) => {
              setConfirmarSenha(texto);
              if (erros.confirmarSenha) {
                setErros((e) => ({ ...e, confirmarSenha: undefined }));
              }
            }}
          />
          {erros.confirmarSenha && (
            <Text style={styles.erro}>{erros.confirmarSenha}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backText}>Já possui uma conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },

  cadastroContainer: {
    width: '90%',
    maxWidth: 400,
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  campo: {
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  inputErro: {
    borderColor: '#d93025',
  },

  erro: {
    color: '#d93025',
    fontSize: 13,
    marginTop: 6,
  },

  button: {
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  backText: {
    color: '#007bff',
    fontSize: 14,
  },
});