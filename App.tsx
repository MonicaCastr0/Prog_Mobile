import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Login';
import Cadastro from './Cadastro';
import Home from './Home';
import NovaDespesa from './NovaDespesa';

import { RootStackParamList } from './Types';
import { DespesasProvider } from './DespesasContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <DespesasProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="NovaDespesa"
            component={NovaDespesa}
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Nova despesa',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DespesasProvider>
  );
}