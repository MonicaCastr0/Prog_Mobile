import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Button,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from './Types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ route }: Props) {
  const [contador, setContador] = useState(0);

  
  const { Usuario } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text>Bem-vindo, {Usuario}!</Text>
    </View>
  );
}

    
