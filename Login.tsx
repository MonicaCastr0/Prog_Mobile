import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from './Types';
import { validarSenha, validarUsuario } from './validacao';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type Erros = {
  usuario?: string;
  senha?: string;
};

export default function Login({ navigation }: Props) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Erros>({});

  function handleLogin() {
    const novosErros: Erros = {
      usuario: validarUsuario(usuario) ?? undefined,
      senha: validarSenha(senha) ?? undefined,
    };

    setErros(novosErros);

    // se algum campo tiver erro, não avança
    if (novosErros.usuario || novosErros.senha) return;

    navigation.navigate('Home', { usuario: usuario.trim() });
  }

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Image
          source={require('./assets/home_control.png')}
          style={styles.imagem}
        />

        <Text style={styles.title}>Login</Text>

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
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, erros.senha && styles.inputErro]}
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={senha}
            onChangeText={(texto) => {
              setSenha(texto);
              if (erros.senha) setErros((e) => ({ ...e, senha: undefined }));
            }}
          />
          {erros.senha && <Text style={styles.erro}>{erros.senha}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.registerText}>
            Ainda não possui uma conta? Cadastre-se
          </Text>
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
    backgroundColor: '#e6e6e6',
  },

  imagem: {
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  loginContainer: {
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
    marginBottom: 18,
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

  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  registerText: {
    color: '#007bff',
    fontSize: 14,
  },
});