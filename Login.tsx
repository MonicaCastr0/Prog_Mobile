import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from './Types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) { 
  const [Usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  function handleLogin() {
    if (!Usuario || !senha) {
      Alert.alert('Atenção', 'Preencha o Usuário e a senha.');
      return;
    }

    Alert.alert('Login', `Bem-vindo!\n${Usuario}`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>

        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Usuario</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu usuário"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={Usuario}
          onChangeText={setUsuario}
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home', { Usuario})}
        >
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
    marginBottom: 20,
    fontSize: 16,
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